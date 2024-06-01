import * as React from 'react';
import styles from './InvoiceGenerator.module.scss';
import { IInvoiceGeneratorProps } from './IInvoiceGeneratorProps';
import { InvoiceHeader } from './InvoiceHeader/InvoiceHeader';
import { InvoiceSummary } from './InvoiceSummary/InvoiceSummary';
import { PDFGenerator } from './PDFGenerator/PDFGenerator';
import { InvoiceItemRow } from './InvoiceItemRow/InvoiceItemRow';
import { InvoiceService } from '../../services/InvoiceService';
import { IInvoiceItem, IInvoice } from '../../models';
import {
  Dropdown,
  IDropdownOption,
  MessageBar,
  Icon
} from 'office-ui-fabric-react';
import * as strings from 'InvoiceGeneratorWebPartStrings';
import { Customizer } from 'office-ui-fabric-react/lib/Utilities';
import html2pdf from 'html2pdf.js';

const Plus = () => <Icon iconName="CirclePlus" />;

interface IInvoiceGeneratorState {
  invoices: IInvoice[];
  selectedInvoiceIndex: string;
  invoiceItems: IInvoiceItem[];
  selectedItem: IInvoiceItem | null;
  itemDescription: string;
  quantity: number;
  price: number;
  showAddItemForm: boolean;
  issueDate: Date;
  dueDate: Date;
}

class InvoiceGenerator extends React.Component<IInvoiceGeneratorProps, IInvoiceGeneratorState> {
  private invoiceService: InvoiceService;

  constructor(props: IInvoiceGeneratorProps) {
    super(props);

    this.state = {
      invoices: [],
      selectedInvoiceIndex: '0',
      invoiceItems: [],
      selectedItem: null,
      itemDescription: '',
      quantity: 0,
      price: 0,
      showAddItemForm: false,
      issueDate: new Date(),
      dueDate: new Date()
    };

    this.invoiceService = new InvoiceService(props.context);

    this.onItemSelected = this.onItemSelected.bind(this);
    this.toggleAddItemForm = this.toggleAddItemForm.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handlePdfGeneration = this.handlePdfGeneration.bind(this);
    this.calculateSubtotal = this.calculateSubtotal.bind(this);
    this.calculateTax = this.calculateTax.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
    this.setIssueDate = this.setIssueDate.bind(this);
    this.setDueDate = this.setDueDate.bind(this);
  }

  public componentDidMount(): void {
    this.invoiceService.getInvoice(this.props.listId)
      .then((data: IInvoice[]) => {
        this.setState({ invoices: data });
      })
      .catch((error) => {
        console.error('Error loading invoices:', error);
      });
  }

  private calculateSubtotal(): number {
    return this.state.invoiceItems.reduce((acc, cur) => acc + cur.totalAmount, 0);
  }

  private calculateTax(): number {
    const subtotal = this.calculateSubtotal();
    return (subtotal * this.props.taxRate) / 100;
  }

  private calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    const taxAmount = this.calculateTax();
    const total = subtotal + taxAmount;
    return isNaN(total) ? 0 : total;
  }

  private onItemSelected(item: IInvoiceItem): void {
    this.setState({
      selectedItem: item,
      itemDescription: item.description,
      quantity: item.quantity,
      price: item.price
    });
  }

  private toggleAddItemForm(): void {
    this.setState({ showAddItemForm: !this.state.showAddItemForm });
  }

  private handleDeleteItem(): void {
    const { selectedItem, invoiceItems } = this.state;

    if (!selectedItem) {
      console.error('No item selected for deletion');
      return;
    }

    try {
      const updatedItems = invoiceItems.filter((item) => item !== selectedItem);
      this.setState({
        invoiceItems: updatedItems,
        selectedItem: null,
        itemDescription: '',
        quantity: 0,
        price: 0
      });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  private handleAddItem(): void {
    const { itemDescription, quantity, price, invoiceItems } = this.state;

    if (!itemDescription || quantity === 0 || price === 0) {
      return;
    }

    const newInvoiceItem: IInvoiceItem = {
      description: itemDescription,
      id: invoiceItems.length + 1,
      quantity,
      price,
      totalAmount: quantity * price
    };

    const updatedItems = [...invoiceItems, newInvoiceItem];

    this.setState({
      invoiceItems: updatedItems,
      itemDescription: '',
      quantity: 0,
      price: 0,
      showAddItemForm: false
    });
  }

  private handlePdfGeneration(): void {
    if (this.state.invoiceItems.length === 0) {
      return;
    }

    const selectedInvoice = this.state.invoices[Number(this.state.selectedInvoiceIndex)];
    const invoiceData = {
      items: this.state.invoiceItems,
      subtotal: this.calculateSubtotal(),
      tax: this.calculateTax(),
      total: this.calculateTotal(),
      invoiceNumber: selectedInvoice?.ID,
      customerName: selectedInvoice?.Title,
      customerAddress: selectedInvoice?.billTo,
      companyAddress: this.props.companyAddress,
      companyName: this.props.companyName,
      issueDate: this.state.issueDate,
      dueDate: this.state.dueDate,
      logoImage: this.props.logoImage
    };

    // Generate PDF using html2pdf.js
    const invoiceContainer = document.getElementById('invoice-container');
    if (invoiceContainer) {
      html2pdf()
        .from(invoiceContainer)
        .set({
          filename: `invoice-#000${invoiceData.invoiceNumber}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        })
        .save();
    }
  }

  private setIssueDate(date: Date): void {
    this.setState({ issueDate: date });
  }

  private setDueDate(date: Date): void {
    this.setState({ dueDate: date });
  }

  private DefaultExample(): JSX.Element {
    return (
      <MessageBar>
        Please add items to the invoice before generating a PDF.
      </MessageBar>
    );
  }

  public render(): JSX.Element {
    const {
      context,
      listId,
      logoImage,
      themeVariant,
      companyAddress,
      companyName
    } = this.props;

    const {
      invoices,
      selectedInvoiceIndex,
      invoiceItems,
      selectedItem,
      itemDescription,
      quantity,
      price,
      showAddItemForm,
      issueDate,
      dueDate
    } = this.state;

    return (
      <Customizer settings={{ theme: themeVariant }}>
        <div className={styles.invoiceGenerator}>
          {(!invoices || invoices.length === 0 || !listId) && (
            <div className={styles.placeholderWrapper}>
              <Icon iconName="Edit" className={styles.placeholderIcon} />
              <div className={styles.placeholderText}>Configure your web part</div>
              <div className={styles.placeholderDescription}>
                Please configure the web part properties.
              </div>
              <button
                className={styles.placeholderButton}
                onClick={() => {
                  context.propertyPane.open();
                }}
              >
                Configure
              </button>
            </div>
          )}
          {invoices && invoices.length > 0 && (
            <>
              <div className={styles.invoiceSelect}>
                <label style={{ marginRight: '8px', fontWeight: 'bold' }}>
                  {strings.selectInvoicesLabel}
                </label>
                <Dropdown
                  label="Pick your list"
                  options={invoices.map((invoice, index) => ({
                    key: index.toString(),
                    text: `${strings.invoiceText} ${invoice.ID} - ${invoice.Title}`
                  }))}
                  selectedKey={selectedInvoiceIndex}
                  onChanged={(option: IDropdownOption) => {
                    this.setState({ selectedInvoiceIndex: option.key.toString() });
                  }}
                />
              </div>
              <div id="invoice-container">
                <div className={styles.header}>
                  <img
                    className={styles.companyLogo}
                    src={logoImage}
                    alt={strings.companyLogoAlt}
                    height="100"
                    width="100"
                  />
                  <div className={styles.title}>{strings.invoiceTitle}</div>
                </div>
                <InvoiceHeader
                  invoiceNumber={invoices[Number(selectedInvoiceIndex)]?.ID}
                  customerName={invoices[Number(selectedInvoiceIndex)]?.Title}
                  customerAddress={invoices[Number(selectedInvoiceIndex)]?.billTo}
                  companyAddress={companyAddress}
                  companyName={companyName}
                  amountDue={this.calculateTotal()}
                  issueDate={issueDate}
                  dueDate={dueDate}
                  onIssueDateChange={this.setIssueDate}
                  onDueDateChange={this.setDueDate}
                />
                <div className={styles.itemsContainer}>
                  <div className={styles.itemsTable}>
                    <div className={styles.itemsTableHeader}>
                      <div className={styles.itemDescription}>{strings.itemDescriptionText}</div>
                      <div className={styles.itemQuantity}>{strings.quantityText}</div>
                      <div className={styles.itemPrice}>{strings.priceText}</div>
                      <div className={styles.itemTotal}>{strings.totalText}</div>
                    </div>

                    {showAddItemForm && (
                      <div className={styles.addItem}>
                        <div className={styles.inputWrapper}>
                          <input
                            type="text"
                            placeholder={strings.itemDescriptionPlaceholder}
                            value={itemDescription}
                            onChange={(e) => this.setState({ itemDescription: e.target.value })}
                          />
                        </div>
                        <div className={styles.inputWrapper}>
                          <input
                            type="number"
                            placeholder={strings.quantityPlaceholder}
                            value={quantity}
                            onChange={(e) => this.setState({ quantity: parseInt(e.target.value, 10) })}
                          />
                        </div>
                        <div className={styles.inputWrapper}>
                          <input
                            type="number"
                            placeholder={strings.pricePlaceholder}
                            value={price}
                            onChange={(e) => this.setState({ price: parseFloat(e.target.value) })}
                          />
                        </div>
                        <div onClick={this.handleAddItem} className={styles.submitButton}>
                          {strings.submitButtonText}
                        </div>
                      </div>
                    )}

                    {invoiceItems.map((item) => (
                      <InvoiceItemRow
                        key={item.id}
                        item={item}
                        isSelected={item === selectedItem}
                        onItemSelected={this.onItemSelected}
                        onDeleteItem={this.handleDeleteItem}
                      />
                    ))}

                    <div className={styles.fullWidthPlusButton} onClick={this.toggleAddItemForm}>
                      <Plus />{strings.addItemButtonText}
                    </div>

                    {invoiceItems.length === 0 && !showAddItemForm && this.DefaultExample()}

                    <div className={styles.itemsTableFooter}>
                      <InvoiceSummary
                        subtotal={this.calculateSubtotal()}
                        taxRate={this.props.taxRate}
                        total={this.calculateTotal()}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.generatePdfButton} onClick={this.handlePdfGeneration}>
                  {strings.generatePdfButtonText}
                </div>
              </div>
            </>
          )}
        </div>
      </Customizer>
    );
  }
}

export default InvoiceGenerator;
