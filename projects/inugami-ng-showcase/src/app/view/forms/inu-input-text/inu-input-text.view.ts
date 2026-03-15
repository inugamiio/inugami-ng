import {Component, signal} from '@angular/core';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {InuInputText} from 'inugami-ng/components/inu-input-text';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {FieldTree, form, FormField, required} from '@angular/forms/signals';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';


interface UserForm {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  old: number;
}

@Component({
  templateUrl: './inu-input-text.view.html',
  styleUrls: ['./inu-input-text.view.scss'],
  imports: [
    InuCode,
    InuInputText,
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
export class InuInputTextView {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  data = signal<string>('');
  userModel = signal<UserForm>({
    uid: '',
    firstName: '',
    lastName: '',
    email: '',
    old : 0
  });
  userForm: FieldTree<UserForm>  = form(this.userModel, (path) => {
    required(path.email);
  });
  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    toObservable(this.userModel)
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(value => {
        this.onValueChanged(value)
      });
  }
  private onValueChanged(value: UserForm) {
    this.data.set(JSON.stringify(value, null, 4));
  }

}
