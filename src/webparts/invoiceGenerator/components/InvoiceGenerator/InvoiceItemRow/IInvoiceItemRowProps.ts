
import { IInvoiceItem } from '../../../models';

export interface IInvoiceItemRowProps {
  item: IInvoiceItem;
  isSelected: boolean;
  onItemSelected: (item: IInvoiceItem) => void;
  onDeleteItem: () => void;
}
