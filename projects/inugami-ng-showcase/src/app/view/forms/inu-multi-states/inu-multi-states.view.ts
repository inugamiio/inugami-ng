import {Component, signal} from '@angular/core';
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {NgClass} from '@angular/common'
import {form, FormField, required,} from '@angular/forms/signals';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuMultiStates} from 'inugami-ng/components/inu-multi-states';
import {InuFormsUtils} from 'inugami-ng/utils'
import {InuSelectItem, InuSelectItemMatcher} from 'inugami-ng/models'
import {InuIcon} from 'inugami-icons'
import {InugamiTemplateDirective} from 'inugami-ng/directives'


interface MyFormModel {
  logLevels: string[];
  logLevel: string;
}

@Component({
             templateUrl: './inu-multi-states.view.html',
             styleUrls  : ['./inu-multi-states.view.scss'],
             imports    : [
               InuTableFlex,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuTableFlexCell,
               InuPanelTabs,
               InuPanelTab,
               InuMultiStates,
               InuCode,
               FormField,
               InuIcon,
               InugamiTemplateDirective,
               NgClass
             ]
           })
export class InuMultiStateView {
  matcher                  = signal<InuSelectItemMatcher | undefined>(undefined);
  data                     = signal<string>('');
    formModel                = signal<MyFormModel>({
                                                     logLevels: ['info', 'warn'],
                                                     logLevel : 'info'
                                                   });
  logLevelSelectItemsBasic = signal<InuSelectItem<string>[]>([
                                                               {
                                                                 id   : 'debug',
                                                                 title: 'Debug',
                                                                 value: 'debug'
                                                               },
                                                               {
                                                                 id   : 'info',
                                                                 title: 'Info',
                                                                 value: 'info'
                                                               },
                                                               {
                                                                 id   : 'warn',
                                                                 title: 'Warn',
                                                                 value: 'warn'
                                                               },
                                                               {
                                                                 id   : 'error',
                                                                 title: 'Error',
                                                                 value: 'error'
                                                               }
                                                             ]);

  logLevelSelectItems = signal<InuSelectItem<string>[]>([
                                                          {
                                                            id        : 'debug',
                                                            title     : 'Debug',
                                                            value     : 'debug',
                                                            styleClass: 'log-level-debug'
                                                          },
                                                          {
                                                            id        : 'info',
                                                            title     : 'Info',
                                                            value     : 'info',
                                                            styleClass: 'log-level-info'
                                                          },
                                                          {
                                                            id        : 'warn',
                                                            title     : 'Warn',
                                                            value     : 'warn',
                                                            styleClass: 'log-level-warn'
                                                          },
                                                          {
                                                            id        : 'error',
                                                            title     : 'Error',
                                                            value     : 'error',
                                                            styleClass: 'log-level-error'
                                                          }
                                                        ]);

  myForm = form(this.formModel, (path) => {
   // required(path.logLevels);
  });


  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    InuFormsUtils.onChanged(this.formModel).subscribe(value => {
      this.onValueChanged(value)
    });
    this.matcher.set((selectItem, value) => {
      return selectItem.id.toUpperCase() == ('' + value).toUpperCase() ? selectItem : undefined;
    });
  }


  //==================================================================================================================
  // EVENTS
  //==================================================================================================================
  private onValueChanged(value: MyFormModel) {
    this.data.set(JSON.stringify(value, null, 4));
  }

  resolveIcon(selectItem: InuSelectItem<any>): string {
    switch (selectItem.id) {
      case 'debug':
        return 'test';
      case 'info':
        return 'idea';
      case 'warn':
        return 'warning';
      default :
        return 'bug';
    }
  }
}
