import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'InvoiceGeneratorWebPartStrings';
import InvoiceGenerator from './components/InvoiceGenerator';
import { IInvoiceGeneratorProps } from './components/IInvoiceGeneratorProps';

export interface IInvoiceGeneratorWebPartProps {
  description: string;
}

export default class InvoiceGeneratorWebPart extends BaseClientSideWebPart<IInvoiceGeneratorWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IInvoiceGeneratorProps > = React.createElement(
      InvoiceGenerator,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
