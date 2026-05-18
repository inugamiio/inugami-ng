import {Component, signal} from '@angular/core';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {InuInputText} from 'inugami-ng/components/inu-input-text';
import {InuInputPassword} from 'inugami-ng/components/inu-input-password';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {FieldTree, form, FormField, required} from '@angular/forms/signals';
import {InuFormsUtils} from 'inugami-ng/utils'


interface UserForm {
  login: string;
  password: string;
}

@Component({
             templateUrl: './inu-input-password.view.html',
             styleUrls  : ['./inu-input-password.view.scss'],
             imports    : [
               InuCode,
               InuInputText,
               InuInputPassword,
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
export class InuInputPasswordView {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  data                          = signal<string>('');
  userModel                     = signal<UserForm>({
                                                     login   : '',
                                                     password: '',
                                                   });
  userForm: FieldTree<UserForm> = form(this.userModel, (path) => {
    required(path.login);
    required(path.password);
  });
  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    InuFormsUtils.onChanged(this.userModel)
      .subscribe(value => {
        this.onChanged(value)
      });
  }


  private onChanged(value: UserForm) {
    this.data.set(JSON.stringify(value, null, 4));
  }

}
