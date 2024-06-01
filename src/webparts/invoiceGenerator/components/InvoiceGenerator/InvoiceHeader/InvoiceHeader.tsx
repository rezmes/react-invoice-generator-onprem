import * as React from 'react';
import styles from './InvoiceHeader.module.scss';
import { IInvoiceHeaderProps } from './IInvoiceHeaderProps';

export class InvoiceHeader extends React.Component<IInvoiceHeaderProps, {}> {
  constructor(props: IInvoiceHeaderProps) {
    super(props);
  }

  public render(): JSX.Element {
    const {
      invoiceNumber,
      customerName,
      customerAddress,
      companyAddress,
      companyName,
      amountDue,
      issueDate,
      dueDate,
      onIssueDateChange,
      onDueDateChange
    } = this.props;

    return (
      <div className={styles.invoiceHeader}>
        <div className={styles.leftColumn}>
          <div className={styles.label}>Invoice Number</div>
          <div>{invoiceNumber}</div>
          <div className={styles.label}>Customer Name</div>
          <div>{customerName}</div>
          <div className={styles.label}>Customer Address</div>
          <div>{customerAddress}</div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.label}>Amount Due</div>
          <div>{amountDue}</div>
          <div className={styles.label}>Issue Date</div>
          <label htmlFor="issueDate">Issue Date</label>
          <input
            type="date"
            id="issueDate"
            value={issueDate.toISOString().split('T')[0]}
            onChange={(e) => onIssueDateChange(new Date(e.target.value))}
          />
          <div className={styles.label}>Due Date</div>
          <label htmlFor="DueDate">Due Date</label>
          <input
            type="date"
            id="DueDate"
            value={dueDate.toISOString().split('T')[0]}
            onChange={(e) => onDueDateChange(new Date(e.target.value))}
          />
        </div>
        <div className={styles.companyInfo}>
          <div className={styles.label}>Company Name</div>
          <div>{companyName}</div>
          <div className={styles.label}>Company Address</div>
          <div>{companyAddress}</div>
        </div>
      </div>
    );
  }
}
