import {Component, computed, signal} from '@angular/core';
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {
  InuSelectItem,
  InuSelectItemExtractor,
  InuSelectItemMatcher,
  InuSelectListSearchRequest,
  SearchResponse
} from 'inugami-ng/models';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged, Observable} from 'rxjs';
import {disabled, form, FormField, required,} from '@angular/forms/signals';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuSelectList} from 'inugami-ng/components/inu-select-list';
import {InugamiIconsSwitzerlandUtils, InuIcon, SWITZERLAND_CANTONS, SwitzerlandCanton} from 'inugami-icons';
import {InugamiTemplateDirective} from 'inugami-ng/directives';
import {ObservableSubscriber} from 'inugami-ng/utils';
import {InuCite} from 'inugami-ng/components/inu-cite'


interface MyFormModel {
  cantons: string[];
}

interface MyFormLazyModel {
  value: string[];
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
               InuIcon,
               InuCite
             ]
           })
export class InuSelectListView {

  data              = signal<string>('');
  dataLazy          = signal<string>('');
  eventOnSelected   = signal<string>('');
  eventOnUnSelected = signal<string>('');
  extractor         = signal<InuSelectItemExtractor | undefined>(undefined);
  matcher           = signal<InuSelectItemMatcher | undefined>(undefined);
  formModel         = signal<MyFormModel>({
                                            cantons: ['VD', 'GE', 'VS']
                                          });
  formLazyModel     = signal<MyFormLazyModel>({
                                                value: []
                                              });

  myForm = form(this.formModel, (path) => {
  });

  myFormLazy = form(this.formLazyModel, (path) => {
  });

  formDisabledModel = signal<MyFormLazyModel>({
                                                value: ["Value 0_0",
                                                        "Value 0_1",
                                                        "Value 1_3"]
                                              });

  myFormDisabled = form(this.formDisabledModel, (path) => {
    disabled(path.value);
  });
  myFormRequired = form(this.formDisabledModel, (path) => {
    required(path.value);
  });


  cantons = computed<InuSelectItem<SwitzerlandCanton>[]>(() => SWITZERLAND_CANTONS
    .filter(c => c.code != 'ch')
    .map(c => <InuSelectItem<SwitzerlandCanton>>{
      id   : c.code,
      title: c.nameEn,
      value: c
    }));

  genericT     = signal<string>('<T>');
  genericTList = signal<string>('<T>[]');
  genericSearchProvider =  signal<string>('SearchProvider<InuSelectListSearchRequest, T>');


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

    toObservable(this.formLazyModel)
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(value => {
        this.onValueLazyChanged(value)
      });
  }


  //==================================================================================================================
  // SEARCH
  //==================================================================================================================
  searchLazy(request: InuSelectListSearchRequest): Observable<SearchResponse<InuSelectItem<string>>> {
    const result = new ObservableSubscriber<SearchResponse<InuSelectItem<string>>>();

    setTimeout(() => {
      const page                          = request.page ?? 0;
      const pageSize                      = request.pageSize ?? 10;
      const data: InuSelectItem<string>[] = [];
      for (let i = 0; i < pageSize; i++) {
        const title = `${request.value ?? 'Value'} ${page}_${i}`;
        data.push({
                    id   : title,
                    title: title,
                    value: title
                  });
      }
      result.next({
                    page      : page,
                    pageSize  : pageSize,
                    previous  : page >= 1,
                    next      : page < 9,
                    totalPages: 10,
                    data      : data
                  })

    }, 2000);

    return result.observable();
  }

  //==================================================================================================================
  // EVENTS
  //==================================================================================================================
  private onValueChanged(value: MyFormModel) {
    this.data.set(JSON.stringify(value, null, 4));
  }

  private onValueLazyChanged(value: MyFormLazyModel) {
    this.dataLazy.set(JSON.stringify(value, null, 4));

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
    return InugamiIconsSwitzerlandUtils.getCanton(id).icon;
  }


}
