import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import { IInvoice, IInvoiceItem } from '../models';

export class InvoiceService {
  private context: WebPartContext;

  constructor(context: WebPartContext) {
    this.context = context;
    sp.setup({
      sp: {
        baseUrl: this.context.pageContext.web.absoluteUrl
      }
    });
  }

  // Fetch invoices from the specified list ID
  public async getInvoice(listId: string): Promise<IInvoice[]> {
    try {
      const items = await sp.web.lists.getById(listId).items.select('ID', 'Title', 'BillTo').get();
      return items.map(item => ({
        ID: item.ID,
        Title: item.Title,
        billTo: item.BillTo || ''
      }));
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  }

  // Retrieve items related to a specific invoice
  public async getInvoiceItems(invoiceId: number): Promise<IInvoiceItem[]> {
    try {
      const items = await sp.web.lists
        .getByTitle('InvoiceItems')
        .items.filter(`InvoiceId eq ${invoiceId}`)
        .select('ID', 'Description', 'Quantity', 'Price')
        .get();

      return items.map(item => ({
        id: item.ID,
        description: item.Description,
        quantity: item.Quantity,
        price: item.Price,
        totalAmount: item.Quantity * item.Price
      }));
    } catch (error) {
      console.error(`Error fetching invoice items for invoice ID ${invoiceId}:`, error);
      return [];
    }
  }

  // Create a new invoice item
  public async createInvoiceItem(invoiceId: number, item: IInvoiceItem): Promise<void> {
    try {
      await sp.web.lists.getByTitle('InvoiceItems').items.add({
        InvoiceId: invoiceId,
        Description: item.description,
        Quantity: item.quantity,
        Price: item.price
      });
    } catch (error) {
      console.error(`Error creating invoice item for invoice ID ${invoiceId}:`, error);
    }
  }

  // Delete a specific invoice item
  public async deleteInvoiceItem(itemId: number): Promise<void> {
    try {
      await sp.web.lists.getByTitle('InvoiceItems').items.getById(itemId).delete();
    } catch (error) {
      console.error(`Error deleting invoice item with ID ${itemId}:`, error);
    }
  }

  // Fetch all SharePoint lists
  public async getLists(): Promise<{ Id: string; Title: string }[]> {
    try {
      const lists = await sp.web.lists.filter('Hidden eq false').select('Id', 'Title').get();
      return lists;
    } catch (error) {
      console.error('Error fetching lists:', error);
      return [];
    }
  }

  // Verify if a list with the given name exists
  public async listExists(listName: string): Promise<boolean> {
    try {
      const lists = await sp.web.lists.filter(`Title eq '${listName}'`).select('Id').get();
      return lists.length > 0;
    } catch (error) {
      console.error('Error checking list existence:', error);
      return false;
    }
  }

  // Create a new list
  public async createList(listName: string): Promise<string | undefined> {
    try {
      const createdList = await sp.web.lists.add(listName, '', 100, true);
      return createdList.data.Id;
    } catch (error) {
      console.error('Error creating list:', error);
      return undefined;
    }
  }
}
