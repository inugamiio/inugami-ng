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
  SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR,
  SVG_SWITZERLAND_LEVEL_MONOCHROME_BLUE,
  SVG_SWITZERLAND_LEVEL_MONOCHROME_GREEN,
  SVG_SWITZERLAND_LEVEL_MONOCHROME_RED,
  SVG_SWITZERLAND_MONOCHROME
} from 'inugami-ng/components/inu-svg-switzerland';
import {InuButton} from 'inugami-ng/components/inu-button';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuSelectItem, InuSelectItemMatcher, SvgStyle} from 'inugami-ng/models';
import {FieldTree, form, FormField} from '@angular/forms/signals';
import {
  COLORS_ANDROID,
  COLORS_BOOTSTRAP,
  COLORS_BOOTSTRAP_PRIMARY,
  COLORS_GNOME, COLORS_LEVEL,
  COLORS_TOPO
} from 'inugami-ng/services';

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

const COLORS : any ={
  matlab : SVG_SWITZERLAND_MAT_LAB,
  android : (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
    return SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR(selectItem, 0, MAX_LEVEL,COLORS_ANDROID);
  },
  bootstrap : (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
    return SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR(selectItem, 0, MAX_LEVEL,COLORS_BOOTSTRAP);
  },
  bootstrapPrimary : (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
    return SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR(selectItem, 0, MAX_LEVEL,COLORS_BOOTSTRAP_PRIMARY);
  },
  gnome : (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
    return SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR(selectItem, 0, MAX_LEVEL,COLORS_GNOME);
  },
  level : (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
    return SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR(selectItem, 0, MAX_LEVEL,COLORS_GNOME);
  },
  topo : (selectItem: InuSelectItem<any>): SvgStyle | undefined => {
    return SVG_SWITZERLAND_LEVEL_COLOR_GENERATOR(selectItem, 0, MAX_LEVEL,COLORS_TOPO);
  },
  blue : SVG_SWITZERLAND_LEVEL_MONOCHROME_BLUE,
  green : SVG_SWITZERLAND_LEVEL_MONOCHROME_GREEN,
  red: SVG_SWITZERLAND_LEVEL_MONOCHROME_RED
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
  colorLevel = signal<InuSvgSwitzerlandStyleGenerator>(SVG_SWITZERLAND_MAT_LAB);

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

  colorNames = computed<string[]>(()=> {
    return Object.keys(COLORS);
  })
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


  protected chooseColor(color:string){
    let currentColor = COLORS[color];
    if(!currentColor){
      currentColor = COLORS['matlab'];
    }
    this.colorLevel.set(currentColor);
  }



  protected onChanged(event: any[]) {
  }
}
