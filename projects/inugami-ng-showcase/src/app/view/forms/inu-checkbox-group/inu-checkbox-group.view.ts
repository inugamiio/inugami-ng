import {Component, computed, signal} from '@angular/core';
import {InuCode} from 'inugami-ng/components/inu-code';
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
import {InuCheckboxGroup} from "inugami-ng/components/inu-checkbox-group";
import {disabled, form, FormField, required,} from '@angular/forms/signals';


interface MyFormModel {
  verb: string[];
}


@Component({
  templateUrl: './inu-checkbox-group.view.html',
  styleUrls: ['./inu-checkbox-group.view.scss'],
  imports: [
    InuCode,
    InuCheckboxGroup,
    InuCode,
    InuTableFlex,
    InuTableFlexHeader,
    InuTableFlexRow,
    InuTableFlexCell,
    InuPanelTabs,
    InuPanelTab,
    FormField
  ]
})
export class InuCheckboxGroupView {
  data = signal<string>('');

  formModel = signal<MyFormModel>({
    verb: ['GET', 'PUT']
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
    {value: 'GET', title: 'GET', styleClass: 'verb-get'},
    {value: 'POST', title: 'POST', styleClass: 'verb-post'},
    {value: 'PUT', title: 'PUT', styleClass: 'verb-put'}
  ]);

  genericT = signal<string>('<T>')
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
