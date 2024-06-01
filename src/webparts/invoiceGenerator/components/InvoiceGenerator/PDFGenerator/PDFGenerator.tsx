import * as React from 'react';
import { IPDFGeneratorProps } from './IPDFGeneratorProps';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class PDFGenerator extends React.Component<IPDFGeneratorProps, {}> {
  constructor(props: IPDFGeneratorProps) {
    super(props);
    this.printDocument = this.printDocument.bind(this);
  }

  public printDocument() {
    const input = document.getElementById('divToPrint');

    if (input) {
      html2canvas(input)
        .then((canvas) => {
          const imgWidth = 208; // Image width in mm (A4 size)
          const imgHeight = canvas.height * imgWidth / canvas.width;
          const contentDataURL = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page in portrait
          const position = 0;
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          pdf.save('invoice.pdf');
        })
        .catch(error => {
          console.error('Error generating PDF:', error);
        });
    }
  }

  public render(): JSX.Element {
    const {
      invoiceNumber,
      customerName,
      customerAddress,
      companyAddress,
      companyName,
      issueDate,
      dueDate,
      logoImage,
      items,
      subtotal,
      tax,
      total
    } = this.props;

    return (
      <div>
        <button onClick={this.printDocument}>Generate PDF</button>
        <div id="divToPrint" style={{ padding: '40px', backgroundColor: '#f5f5f5', width: '210mm', minHeight: '297mm', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px' }}>
            <div>
              <img src={logoImage} alt="Company Logo" style={{ width: '100px', height: '100px' }} />
              <p>{companyName}</p>
              <p>{companyAddress}</p>
            </div>
            <div>
              <p>Invoice #{invoiceNumber}</p>
              <p>Issue Date: {issueDate.toLocaleDateString()}</p>
              <p>Due Date: {dueDate.toLocaleDateString()}</p>
            </div>
          </div>
          <p>Bill To:</p>
          <p>{customerName}</p>
          <p>{customerAddress}</p>
          <div style={{ display: 'flex', borderBottom: '1px solid #000', paddingBottom: '8px', marginBottom: '8px', fontSize: '14px' }}>
            <p style={{ width: '40%' }}>Description</p>
            <p style={{ width: '20%', textAlign: 'right' }}>Quantity</p>
            <p style={{ width: '20%', textAlign: 'right' }}>Price</p>
            <p style={{ width: '20%', textAlign: 'right' }}>Total</p>
          </div>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', marginBottom: '8px', fontSize: '12px' }}>
              <p style={{ width: '40%' }}>{item.description}</p>
              <p style={{ width: '20%', textAlign: 'right' }}>{item.quantity}</p>
              <p style={{ width: '20%', textAlign: 'right' }}>{item.price.toFixed(2)}</p>
              <p style={{ width: '20%', textAlign: 'right' }}>{item.totalAmount.toFixed(2)}</p>
            </div>
          ))}
          <div style={{ marginTop: '20px', fontSize: '14px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <p>Subtotal:</p>
                 <p>{subtotal.toFixed(2)}</p>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <p>Tax:</p>
                 <p>{tax.toFixed(2)}</p>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                 <p>Total:</p>
                 <p>{total.toFixed(2)}</p>
               </div>
             </div>
           </div>
         </div>
       );
     }
   }
