import {Component, signal} from '@angular/core';
import {InuPanelTab, InuPanelTabs} from 'inugami-ng/components/inu-panel-tabs';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {form, FormField, required,} from '@angular/forms/signals';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuToggle} from 'inugami-ng/components/inu-toggle';



interface MyFormModel {
  sms: boolean;
  email: boolean;
  mail: boolean;
  inApp: boolean;
}

@Component({
             templateUrl: './inu-toggle.view.html',
             styleUrls  : ['./inu-toggle.view.scss'],
             imports: [
               InuTableFlex,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuTableFlexCell,
               InuPanelTabs,
               InuPanelTab,
               InuCode,
               InuToggle,
               FormField
             ]
           })
export class InuToggleView {

  data      = signal<string>('');
  formModel = signal<MyFormModel>({
                                    sms: false,
                                    email: true,
                                    inApp: false,
                                    mail: false
                                  });

  myForm = form(this.formModel, (path) => {
    required(path.sms);
  });


  eventType = signal<string>('EventEmitter<boolean>');


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


  //==================================================================================================================
  // EVENTS
  //==================================================================================================================
  private onValueChanged(value: MyFormModel) {
    this.data.set(JSON.stringify(value, null, 4));
  }


}
