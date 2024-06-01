declare interface IInvoiceGeneratorWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  TaxRateFieldLabel: string;
  CompanyNameFieldLabel: string;
  CompanyAddressFieldLabel: string;
  selectInvoicesLabel: string;
  invoiceText: string;
  invoiceTitle: string;
  companyLogoAlt: string;
  itemDescriptionText: string;
  quantityText: string;
  priceText: string;
  totalText: string;
  itemDescriptionPlaceholder: string;
  quantityPlaceholder: string;
  pricePlaceholder: string;
  submitButtonText: string;
  addItemButtonText: string;
  downloadPdfButtonText: string;
}

declare module 'InvoiceGeneratorWebPartStrings' {
  const strings: IInvoiceGeneratorWebPartStrings;
  export = strings;
}
