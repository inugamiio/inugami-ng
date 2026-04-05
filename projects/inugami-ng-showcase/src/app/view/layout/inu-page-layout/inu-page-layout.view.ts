import {Component} from '@angular/core';
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuPanelTab, InuPanelTabs} from "inugami-ng/components/inu-panel-tabs";

@Component({
             templateUrl: './inu-page-layout.view.html',
             styleUrls  : ['./inu-page-layout.view.scss'],
             imports    : [
               InuCode,
               InuPanelTab,
               InuPanelTabs
             ]
           })
export class InuPageLayoutView {


}
