import {Component, computed, signal} from '@angular/core';
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuSelectItem} from 'inugami-ng/models';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {InuRadioGroup} from "inugami-ng/components/inu-radio-group";
import {disabled, form, FormField, required,} from '@angular/forms/signals';
import {InuCode} from 'inugami-ng/components/inu-code'


interface MyFormModel {
  verb: string;
}


@Component({
             templateUrl: './inu-radio-group.view.html',
             styleUrls  : ['./inu-radio-group.view.scss'],
             imports: [
               InuRadioGroup,
               InuTableFlex,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuTableFlexCell,
               InuPanelTabs,
               InuPanelTab,
               FormField,
               InuCode
             ]
           })
export class InuRadioGroupView {
  data = signal<string>('');

  formModel = signal<MyFormModel>({
                                    verb: 'GET'
                                  });

  myForm = form(this.formModel, (path) => {
  });

  myFormRequired = form(this.formModel, (path) => {
    required(path.verb);
  });

  myFormDisabled = form(this.formModel, (path) => {
    disabled(path.verb);
  });


  verbs = computed<InuSelectItem<string>[]>(() => [
    {id: 'GET', value: 'GET', title: 'GET', styleClass: 'verb-get', tooltips:'Read'},
    {id: 'POST', value: 'POST', title: 'POST', styleClass: 'verb-post', tooltips:'Write, adding new value'},
    {id: 'PUT', value: 'PUT', title: 'PUT', styleClass: 'verb-put', tooltips:'Updating value'}
  ]);

  genericT     = signal<string>('<T>')
  genericTList = signal<string>('<T>[]')
  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
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
    this.data.set(JSON.stringify(value, null, 4));
  }

}
