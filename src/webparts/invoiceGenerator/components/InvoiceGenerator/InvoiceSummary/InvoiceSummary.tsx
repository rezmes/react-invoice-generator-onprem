import * as React from 'react';
import styles from './InvoiceSummary.module.scss';
import { IInvoiceSummaryProps } from './IInvoiceSummaryProps';

export class InvoiceSummary extends React.Component<IInvoiceSummaryProps, {}> {
  constructor(props: IInvoiceSummaryProps) {
    super(props);
  }

  public render(): JSX.Element {
    const { subtotal, taxRate, total } = this.props;
    const tax = (subtotal * taxRate) / 100;

    return (
      <div className={styles.invoiceSummary}>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Subtotal:</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Tax ({taxRate}%):</span>
          <span>{tax.toFixed(2)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Total:</span>
          <span>{total.toFixed(2)}</span>
        </div>
      </div>
    );
  }
}
