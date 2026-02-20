import {Component, effect, signal} from '@angular/core';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {
  InuSvgSwitzerland,
  InuSvgSwitzerlandAction,
  InuSvgSwitzerlandStyleGenerator,
  SVG_SWITZERLAND_MONOCHROME, SVG_SWITZERLAND_LEVEL_MONOCHROME_BLUE, SVG_SWITZERLAND_LEVEL_MONOCHROME_GREEN,
  SVG_SWITZERLAND_LEVEL_MONOCHROME_RED, SVG_SWITZERLAND_LEVEL_COLOR_10
} from 'inugami-ng/components/inu-svg-switzerland';
import {InuButton} from 'inugami-ng/components/inu-button';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuSelectItem} from 'inugami-ng/models';
import {form, FormField} from '@angular/forms/signals';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';

interface CantonValue {
  name: string;
  level: number;
}
interface MyFormModel {
  cantons: CantonValue[];
}



@Component({
  templateUrl: './inu-svg-switzerland.view.html',
  styleUrls: ['./inu-svg-switzerland.view.scss'],
  imports: [
    InuTableFlex,
    InuTableFlexCell,
    InuTableFlexHeader,
    InuTableFlexRow,
    InuSvgSwitzerland,
    InuButton,
    InuCode,
    FormField
  ]
})
export class InuSvgSwitzerlandView {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  monochrome: InuSvgSwitzerlandStyleGenerator = SVG_SWITZERLAND_MONOCHROME;
  colorLevel = signal<InuSvgSwitzerlandStyleGenerator>(SVG_SWITZERLAND_LEVEL_MONOCHROME_BLUE);

  actionHandler!: InuSvgSwitzerlandAction;
  actionHandlerForm!: InuSvgSwitzerlandAction;
  data = signal<string>('');
  formModel = signal<MyFormModel>({
    cantons: [
      {name:'VD', level: 5 },
      {name:'GE', level: 2 },
      {name:'FR', level: 3 },
      {name:'VS', level: 1 }
    ]
  });
  myForm = form(this.formModel, (path) => {
  });
  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    effect(() => {
      const value = this.myForm();
      this.onValueChanged(value);
    }, { allowSignalWrites: true });

    this.actionHandler = {
      onSelected: (value) => this.onCantonSelected(value),
      onDeselected: (value) => this.onCantonDeselected(value),
      toggleSelectState: () => false
    }

    this.actionHandlerForm = {
      onSelected: (value) => this.onCantonSelectedForm(value),
      onDeselected: (value) => this.onCantonDeselectedForm(value),
      toggleSelectState: () => false
    }




  }


  private onValueChanged(value: any) {

      const currentValue = this.data();
      const newValue = JSON.stringify(value.value(), null, 4);
      if(currentValue!=newValue){
        this.data.set(newValue);
      }



  }
  //====================================================================================================================
  // ACTION
  //====================================================================================================================
  private onCantonSelected(value: InuSelectItem<any>): number {
    const currentValue = value.value == undefined ? 0 : (Number(value.value));
    const result = currentValue + 1;
    return result > 10 ? 10 : result;
  }

  private onCantonDeselected(value: InuSelectItem<any>): number {
    const currentValue = value.value == undefined ? 0 : (Number(value.value));
    const result = currentValue - 1;
    return result <= 0 ? 0 : result
  }

  private onCantonSelectedForm(value: InuSelectItem<any>): CantonValue {
    console.log('this.formModel',this.formModel())
    const currentValue = value?.value?.level == undefined ? 0 : (Number(value?.value?.level));
    const result = currentValue + 1;
    return {
      name: value.id,
      level : result > 10 ? 10 : result
    }
  }

  private onCantonDeselectedForm(value: InuSelectItem<any>): CantonValue {
    const currentValue = value?.value?.level == undefined ? 0 : (Number(value?.value?.level));
    const result = currentValue - 1;
    return {
      name: value.id,
      level : result <= 0 ? 0 : result
    }
  }

  protected valueExtractor(selectItem: InuSelectItem<any>): number|undefined{
    return selectItem && selectItem.value ? selectItem.value.level: undefined;
  }




  protected chooseBlue() {
    this.colorLevel.set(SVG_SWITZERLAND_LEVEL_MONOCHROME_BLUE);
  }

  protected chooseRed() {
    this.colorLevel.set(SVG_SWITZERLAND_LEVEL_MONOCHROME_RED);
  }

  protected chooseGreen() {
    this.colorLevel.set(SVG_SWITZERLAND_LEVEL_MONOCHROME_GREEN);
  }

  protected chooseColor() {
    this.colorLevel.set(SVG_SWITZERLAND_LEVEL_COLOR_10);
  }
}
