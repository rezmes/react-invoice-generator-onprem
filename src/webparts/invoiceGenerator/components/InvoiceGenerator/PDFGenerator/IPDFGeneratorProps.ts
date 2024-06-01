import { IInvoiceItem } from '../../../models';

export interface IPDFGeneratorProps {
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  invoiceNumber: number;
  customerName: string;
  customerAddress: string;
  companyAddress: string;
  companyName: string;
  issueDate: Date;
  dueDate: Date;
  logoImage: string;
}
