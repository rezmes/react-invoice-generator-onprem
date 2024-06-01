// import { WebPartContext } from "@microsoft/sp-webpart-base";
// import {
//   IReadonlyTheme
// } from '@microsoft/sp-component-base';
// export interface IInvoiceGeneratorProps {
//   logoImage: string,
//   listId: string;
//   context: WebPartContext;
//   taxRate: number;
//   companyName: string;
//   companyAddress: string;
//   themeVariant: IReadonlyTheme;
// }
import { WebPartContext } from '@microsoft/sp-webpart-base';
export interface IInvoiceGeneratorProps {
  context: WebPartContext;
  listId: string;
  taxRate: number;
  companyName: string;
  companyAddress: string;
  logoImage: string;
  themeVariant: any;
}
