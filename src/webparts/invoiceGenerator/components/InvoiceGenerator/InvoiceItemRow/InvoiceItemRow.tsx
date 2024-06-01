// import * as React from 'react';
// import styles from './InvoiceItemRow.module.scss';
// import { IInvoiceItem } from '../../../models/index';
// import { Icon } from '@fluentui/react/lib/Icon';

// interface IInvoiceItemRowProps {
//   item: IInvoiceItem;
//   isSelected: boolean;
//   onItemSelected: (item: IInvoiceItem) => void;
//   onDeleteItem: () => void;
// }

// const Delete = (): JSX.Element => <Icon iconName="Delete" />;

// export const InvoiceItemRow: React.FC<IInvoiceItemRowProps> = (props) => {
//   const { item, isSelected, onItemSelected, onDeleteItem } = props;

//   const handleClick = (): void => {
//     onItemSelected(item);
//   };

//   const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
//     e.stopPropagation();
//     onItemSelected(item);
//     onDeleteItem();
//   };

//   return (
//     <div
//       className={`${styles.itemRow} ${isSelected ? styles.selectedItem : ''}`}
//       onClick={handleClick}
//     >
//       <div className={styles.itemDescription}>{item.description}</div>
//       <div className={styles.itemQuantity}>{item.quantity}</div>
//       <div className={styles.itemPrice}>{item.price.toFixed(2)}</div>
//       <div className={styles.itemTotal}>{item.totalAmount.toFixed(2)}</div>
//       <button className={styles.deleteButton} onClick={handleDelete}>
//         <Delete />
//       </button>
//     </div>
//   );
// };

import * as React from 'react';
import styles from './InvoiceItemRow.module.scss';
import { IInvoiceItemRowProps } from './IInvoiceItemRowProps';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export class InvoiceItemRow extends React.Component<IInvoiceItemRowProps, {}> {
  constructor(props: IInvoiceItemRowProps) {
    super(props);
    this.onItemSelected = this.onItemSelected.bind(this);
    this.onDeleteItem = this.onDeleteItem.bind(this);
  }

  private onItemSelected(): void {
    this.props.onItemSelected(this.props.item);
  }

  private onDeleteItem(): void {
    this.props.onDeleteItem();
  }

  public render(): JSX.Element {
    const { item, isSelected } = this.props;

    return (
      <div
        className={`${styles.invoiceItemRow} ${isSelected ? styles.selected : ''}`}
        onClick={this.onItemSelected}
      >
        <div className={styles.itemDescription}>{item.description}</div>
        <div className={styles.itemQuantity}>{item.quantity}</div>
        <div className={styles.itemPrice}>{item.price.toFixed(2)}</div>
        <div className={styles.itemTotal}>{item.totalAmount.toFixed(2)}</div>
        <Icon
          iconName="Delete"
          className={styles.deleteIcon}
          onClick={this.onDeleteItem}
        />
      </div>
    );
  }
}
