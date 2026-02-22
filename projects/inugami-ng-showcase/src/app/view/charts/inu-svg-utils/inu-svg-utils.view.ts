import {Component, computed} from '@angular/core';
import {ALL_COLORS} from 'inugami-ng/services';


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
  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {


  }


  protected getColor(key: string):string[] {
    return ALL_COLORS[key];
  }
}
