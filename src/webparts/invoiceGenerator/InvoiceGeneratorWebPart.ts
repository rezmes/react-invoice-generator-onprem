import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneButton,
  PropertyPaneButtonType,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import { Version } from '@microsoft/sp-core-library';
import * as strings from 'InvoiceGeneratorWebPartStrings';
import { IInvoiceGeneratorProps } from './components/InvoiceGenerator/IInvoiceGeneratorProps';
import  InvoiceGenerator  from './components/InvoiceGenerator/InvoiceGenerator';
import { InvoiceService } from './services/InvoiceService';

export interface IInvoiceGeneratorWebPartProps {
  description: string;
  listId: string;
  taxRate: number;
  companyName: string;
  companyAddress: string;
  logoImage: string;
  createListToggle: boolean;
  listName: string;
  listIdOptions: { key: string, text: string }[];
}

export default class InvoiceGeneratorWebPart extends BaseClientSideWebPart<IInvoiceGeneratorWebPartProps> {
  private _invoiceService: InvoiceService;

  protected async onInit(): Promise<void> {
    this._invoiceService = new InvoiceService(this.context);

    const availableLists = await this._invoiceService.getLists();
      this.properties.listIdOptions = availableLists.map((list) => ({
        key: list.Id,
        text: list.Title
      }));

      return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IInvoiceGeneratorProps> = React.createElement(InvoiceGenerator, {
      logoImage: this.properties.logoImage,
      listId: this.properties.listId,
      context: this.context,
      taxRate: this.properties.taxRate || 0,
      companyName: this.properties.companyName,
      companyAddress: this.properties.companyAddress,
      themeVariant: undefined
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const { createListToggle, listId, listIdOptions } = this.properties;

    const PropertyPaneFields = [
      PropertyPaneToggle('createListToggle', {
        label: 'Do you want to create a new list?',
        checked: createListToggle
      }),

      createListToggle &&
        PropertyPaneTextField('listName', {
          label: 'New list name',
          onGetErrorMessage: this.validateListName.bind(this)
        }),
      createListToggle &&
        PropertyPaneButton('CreateList', {
          text: 'Create List',
          buttonType: PropertyPaneButtonType.Normal,
          onClick: this.createList.bind(this)
        }),

      PropertyPaneDropdown('listId', {
        label: 'Pick your list',
        options: listIdOptions.map((list) => ({
          key: list.key,
          text: list.text
        })),
        selectedKey: listId
      }),
      PropertyPaneTextField('companyName', {
        label: strings.CompanyNameFieldLabel
      }),
      PropertyPaneTextField('companyAddress', {
        label: strings.CompanyAddressFieldLabel,
        multiline: true
      }),
      PropertyPaneTextField('taxRate', {
        label: strings.TaxRateFieldLabel,
        value: this.properties.taxRate.toString()
      }),
      PropertyPaneTextField('logoImage', {
        label: 'Logo Image URL',
        value: this.properties.logoImage
      })
    ].filter(Boolean);

    return {
      pages: [
        {
          groups: [
            {
              groupName: 'Invoice Settings',
              groupFields: PropertyPaneFields
            }
          ]
        }
      ]
    };
}

private async validateListName(value: string): Promise<string> {
  const listExists = await this._invoiceService.listExists(value);
  if (listExists) {
    return `List with name "${value}" already exists.`;
  }
  return '';
}

protected onPropertyPaneFieldChanged(propertyPath: string, newValue: string): void {
  if (propertyPath === 'listId' && newValue) {
    this.properties.listId = newValue;
    this.render();
  }
}

private async createList(): Promise<void> {
  try {
    const createdListId = await this._invoiceService.createList(this.properties.listName);
    if (createdListId) {
      console.log(`List "${this.properties.listName}" created successfully.`);
      const availableLists = await this._invoiceService.getLists();
      this.properties.listIdOptions = availableLists.map((list) => ({
        key: list.Id,
        text: list.Title
      }));
      this.properties.listId = createdListId;
      this.context.propertyPane.refresh();
      this.render();
    }
  } catch (error) {
    console.error('Error creating list:', error);
     }
  }
}
