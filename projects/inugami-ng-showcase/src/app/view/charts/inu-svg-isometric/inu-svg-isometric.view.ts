import {Component, signal} from '@angular/core';

import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuSvgIsometric} from 'inugami-ng/components/inu-svg-isometric';
import {FieldTree, form, FormField} from '@angular/forms/signals';
import {SvgLayerDTO} from "inugami-ng/models";


interface MyFormModel {
  layers: SvgLayerDTO[];
}


@Component({
  templateUrl: './inu-svg-isometric.view.html',
  styleUrls: ['./inu-svg-isometric.view.scss'],
  imports: [

    InuTableFlex,
    InuTableFlexCell,
    InuTableFlexHeader,
    InuTableFlexRow,
    InuCode,
    InuSvgIsometric,
    FormField
  ]
})
export class InuSvgIsometricView {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  formModel = signal<MyFormModel>({
    layers: [
      {
        name: 'root',
        asserts: [
          {
            name: 'desktop_1',
            assetSet: 'isometric',
            assetName: 'desktop',
            x: 0,
            y: 0,
            size: 2,
            title: 'Desktop'
          },
          {
            name: 'desktop_2',
            assetSet: 'isometric',
            assetName: 'desktop',
            type: '90',
            x: 200,
            y: 100,
            size: 2,
            title: 'Desktop 2'
          },
          {
            name: 'box_1',
            assetSet: 'isometric',
            assetName: 'box',
            x: -100,
            y: -100,
            size: 2,
            title: 'Box 1'
          },
          {
            name: 'router_1',
            assetSet: 'isometric',
            assetName: 'router',
            type:'90',
            x: -300,
            y: 0,
            size: 2,
            title: 'router 1'
          },
          {
            name: 'router_2',
            title: 'router 2',
            assetSet: 'isometric',
            assetName: 'router',
            type:'90',
            x: -200,
            y: 100,
            size: 2
          },
          {
            name: 'router_3',
            title: 'router 3',
            assetSet: 'isometric',
            assetName: 'router',
            type:'default',
            x: 50,
            y: 200,
            size: 1
          }
        ]
      }
    ]
  });
  myForm: FieldTree<MyFormModel> = form(this.formModel, (path) => {
  });

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  constructor() {


  }


}
