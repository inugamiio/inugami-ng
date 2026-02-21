import {Component, computed, effect, signal} from '@angular/core';
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
  SVG_SWITZERLAND_LEVEL_COLOR_100, SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR,
  SVG_SWITZERLAND_LEVEL_MONOCHROME_BLUE,
  SVG_SWITZERLAND_LEVEL_MONOCHROME_GREEN,
  SVG_SWITZERLAND_LEVEL_MONOCHROME_RED,
  SVG_SWITZERLAND_MONOCHROME
} from 'inugami-ng/components/inu-svg-switzerland';
import {InuButton} from 'inugami-ng/components/inu-button';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuSelectItem, InuSelectItemMatcher, SvgStyle} from 'inugami-ng/models';
import {FieldTree, form, FormField} from '@angular/forms/signals';
import {JsonPipe} from '@angular/common';

interface CantonValue {
  name: string;
  level: number;
}

interface MyFormModel {
  cantons: CantonValue[];
}

const MAX_LEVEL = 55;
const SVG_SWITZERLAND_MAT_LAB: InuSvgSwitzerlandStyleGenerator = (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
  return SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR(selectItem, 0, MAX_LEVEL);
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
    FormField,
    JsonPipe
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

  formModel = signal<MyFormModel>({
    cantons: [
      {name: 'VD', level: 35},
      {name: 'GE', level: 25},
      {name: 'FR', level: 10},
      {name: 'VS', level: 5}
    ]
  });
  myForm:FieldTree<MyFormModel> = form(this.formModel, (path) => {
  });

  data = signal<string>('');
  cantonMatcher!: InuSelectItemMatcher;
  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    this.cantonMatcher = (selectItem, value)=> this.matchCantonSelectItem(selectItem, value);
    effect(() => {
      const currentFormValue = this.myForm().value();
      const result = JSON.stringify(currentFormValue, null, 2);
      this.data.set(result);
    });
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
  matchCantonSelectItem(selectItem: InuSelectItem<any>, value:any):InuSelectItem<any>|undefined{
  console.log('selectItem',selectItem)
    if(selectItem.id  != value.name){
      return undefined;
    }
    selectItem.value = value;
    return selectItem;
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
    const currentValue = value?.value?.level == undefined ? 0 : (Number(value?.value?.level));
    const result = currentValue + 1;
    return {
      name: value.id,
      level: result > MAX_LEVEL ? MAX_LEVEL : result
    }
  }

  private onCantonDeselectedForm(value: InuSelectItem<any>): CantonValue {
    const currentValue = value?.value?.level == undefined ? 0 : (Number(value?.value?.level));
    const result = currentValue - 1;
    return {
      name: value.id,
      level: result <= 0 ? 0 : result
    }
  }

  protected valueExtractor(selectItem: InuSelectItem<any>): number | undefined {
    return selectItem && selectItem.value ? selectItem.value.level : undefined;
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
    this.colorLevel.set(SVG_SWITZERLAND_MAT_LAB);
  }

  protected onChanged(event: any[]) {
    //console.log('onChanged', event)
  }
}
