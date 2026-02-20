import {Component, computed, signal} from '@angular/core';
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
    InuCode
  ]
})
export class InuSvgSwitzerlandView {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  monochrome: InuSvgSwitzerlandStyleGenerator = SVG_SWITZERLAND_MONOCHROME;
  colorLevel = signal<InuSvgSwitzerlandStyleGenerator>(SVG_SWITZERLAND_LEVEL_MONOCHROME_BLUE);

  actionHandler!: InuSvgSwitzerlandAction;

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {
    this.actionHandler = {
      onSelected: (value) => this.onCantonSelected(value),
      onDeselected: (value) => this.onCantonDeselected(value),
      toggleSelectState: () => false
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
