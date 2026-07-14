import {Component, computed, signal} from '@angular/core';
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {disabled, form, FormField, required,} from '@angular/forms/signals';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuDropdown} from 'inugami-ng/components/inu-dropdown';
import {InuSelectItem, InuSelectItemExtractor, InuSelectItemMatcher} from 'inugami-ng/models'
import {InugamiIconsSwitzerlandUtils, InuIcon, SWITZERLAND_CANTONS, SwitzerlandCanton} from 'inugami-icons'
import {InugamiTemplateDirective} from 'inugami-ng/directives';


interface MyFormModel {
  cantons: string[];
}

@Component({
             templateUrl: './inu-dropdown.view.html',
             styleUrls  : ['./inu-dropdown.view.scss'],
             imports    : [
               InuTableFlex,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuTableFlexCell,
               InuPanelTabs,
               InuPanelTab,
               InuCode,
               InuDropdown,
               FormField,
               InuIcon,
               InugamiTemplateDirective
             ]
           })
export class InuDropdownView {
  modeSignalType    = signal('ModelSignal<T[]>');
  valuesType        = signal('InuSelectItem<T>[]');
  searchType        = signal('SearchProvider<InuSelectListSearchRequest, T>');
  eventChangedType  = signal('EventEmitter<T[]>');
  eventSelectType   = signal('EventEmitter<T>');
  data              = signal<string>('');
  eventOnSelected   = signal<string>('');
  eventOnUnSelected = signal<string>('');
  extractor         = signal<InuSelectItemExtractor | undefined>(undefined);
  matcher           = signal<InuSelectItemMatcher | undefined>(undefined);
  formModel         = signal<MyFormModel>({
                                            cantons: ['GE', 'VD']
                                          });

  myForm = form(this.formModel, (path) => {
    required(path.cantons);
  });

  formModelDisabled         = signal<MyFormModel>({
                                            cantons: ['GE', 'VD']
                                          });
  myFormDisabled = form(this.formModelDisabled, (path) => {
    disabled(path.cantons);
  });

  cantons = computed<InuSelectItem<SwitzerlandCanton>[]>(() => SWITZERLAND_CANTONS
    .filter(c => c.code != 'ch')
    .map(c => <InuSelectItem<SwitzerlandCanton>>{
      id   : c.code,
      title: c.nameEn,
      value: c
    }));


  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    this.matcher.set((selectItem, value) => {
      return selectItem.id.toUpperCase() == value ? selectItem : undefined;
    });
    this.extractor.set((v) => {
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


  //==================================================================================================================
  // EVENTS
  //==================================================================================================================
  private onValueChanged(value: MyFormModel) {
    this.data.set(JSON.stringify(value, null, 4));
  }

  protected onSelected(event: SwitzerlandCanton) {
    this.eventOnSelected.set(JSON.stringify(event, null, 4));
  }

  protected onUnSelected(event: SwitzerlandCanton) {
    this.eventOnUnSelected.set(JSON.stringify(event, null, 4));
  }

  //==================================================================================================================
  // GETTERS
  //==================================================================================================================
  protected getCantonIcon(id: string): string {
    return InugamiIconsSwitzerlandUtils.getCanton(id ?? 'ch').icon;
  }

  protected getCantonTitle(id: string): string {
    return InugamiIconsSwitzerlandUtils.getCanton(id ?? 'ch').nameEn;
  }
}
