import {Component, computed, signal} from '@angular/core';
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuSelectItem, InuSelectItemExtractor, InuSelectItemMatcher} from 'inugami-ng/models';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {disabled, form, FormField, required,} from '@angular/forms/signals';
import {InuCode} from 'inugami-ng/components/inu-code'
import {InuSelectList} from 'inugami-ng/components/inu-select-list'
import {SwitzerlandCanton, SWITZERLAND_CANTONS, InuIcon, InugamiIconsSwitzerlandUtils} from 'inugami-icons'
import {InugamiTemplateDirective} from 'inugami-ng/directives'


interface MyFormModel {
  cantons: string[];
}


@Component({
             templateUrl: './inu-select-list.view.html',
             styleUrls  : ['./inu-select-list.view.scss'],
             imports    : [
               InuSelectList,
               InuTableFlex,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuTableFlexCell,
               InuPanelTabs,
               InuPanelTab,
               InuCode,
               FormField,
               InugamiTemplateDirective,
               InuIcon
             ]
           })
export class InuSelectListView {

  data      = signal<string>('');
  eventOnSelected= signal<string>('');
  eventOnUnSelected= signal<string>('');
  extractor = signal<InuSelectItemExtractor | undefined>(undefined);
  matcher   = signal<InuSelectItemMatcher | undefined>(undefined);
  formModel = signal<MyFormModel>({
                                    cantons: ['VD', 'GE', 'VS']
                                  });

  myForm = form(this.formModel, (path) => {
  });

  cantons = computed<InuSelectItem<SwitzerlandCanton>[]>(() => SWITZERLAND_CANTONS
    .filter(c => c.code != 'ch')
    .map(c => <InuSelectItem<SwitzerlandCanton>>{
      id   : c.code,
      title: c.nameEn,
      value: c
    }));

  genericT     = signal<string>('<T>')
  genericTList = signal<string>('<T>[]')
  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    this.matcher.set((selectItem, value) => {
      return selectItem.id.toUpperCase() == value ? selectItem : undefined;
    });
    this.extractor.set((v)=> {
      return v.id.toUpperCase();
    });

    toObservable(this.formModel)
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(value => {
        this.onValueChanged(value)
      });
  }

  private onValueChanged(value: MyFormModel) {
    console.log('onValueChanged', value)
    this.data.set(JSON.stringify(value, null, 4));
  }

  protected getCantonIcon(id: string): string {
    return InugamiIconsSwitzerlandUtils.getCanton(id).icon;
  }

  protected onSelected(event: SwitzerlandCanton) {
    this.eventOnSelected.set(JSON.stringify(event, null, 4));
  }
  protected onUnSelected(event: SwitzerlandCanton) {
    this.eventOnUnSelected.set(JSON.stringify(event, null, 4));
  }


}
