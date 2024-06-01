// In your InvoiceGeneratorWebPartStrings.d.ts file
declare interface IInvoiceGeneratorWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  CompanyNameFieldLabel: string;
  CompanyAddressFieldLabel: string;
  TaxRateFieldLabel: string;
  itemDescriptionText: string;
  quantityText: string;
  priceText: string;
  totalText: string;
  itemDescriptionPlaceholder: string;
  quantityPlaceholder: string;
  pricePlaceholder: string;
  submitButtonText: string;
  addItemButtonText: string;
  invoiceTitle: string;
  companyLogoAlt: string;
  selectInvoicesLabel: string;
  invoiceText: string;
  generatePdfButtonText: string; // Add this line
}

declare module 'InvoiceGeneratorWebPartStrings' {
  const strings: IInvoiceGeneratorWebPartStrings;
  export = strings;
}
