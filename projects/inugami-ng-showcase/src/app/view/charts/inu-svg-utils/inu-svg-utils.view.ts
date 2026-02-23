import {Component, computed, signal} from '@angular/core';
import {ALL_COLORS,GET_COLOR} from 'inugami-ng/services';


@Component({
  templateUrl: './inu-svg-utils.view.html',
  styleUrls: ['./inu-svg-utils.view.scss'],
  imports: []
})
export class InuSvgUtilsView {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  allColorKeys = computed(() => {
    const keys =Object.keys(ALL_COLORS);
    keys.sort();
    return keys;
  });
  percent = signal<number>(0);
  colorPalette = signal<string>(Object.keys(ALL_COLORS)[0]);
  color = computed(()=> GET_COLOR(this.percent(), ALL_COLORS[this.colorPalette()]))
  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {


  }


  protected getColor(key: string):string[] {
    return ALL_COLORS[key];
  }

  protected onPercentChanged(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = Number(inputElement.value);
    this.percent.set(value);
    console.log('onPercentChanged', value);
  }

  protected onColorPaletteChanged(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.colorPalette.set(selectElement.value);
  }
}
