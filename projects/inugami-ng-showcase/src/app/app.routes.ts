import {Routes} from '@angular/router';
import {HomeView} from './view/home/home.view';
import {IconsView} from './view/icons/icons.view';
import {InuCiteView} from './view/display/inu-cite/inu-cite.view';
import {InuCodeView} from './view/display/inu-code/inu-code.view';
import {InuOpenApiView} from './view/display/inu-open-api/inu-open-api.view';
import {InuCheckboxGroupView} from './view/forms/inu-checkbox-group/inu-checkbox-group.view';
import {InuTableFlexView} from './view/table/inu-table-flex/inu-table-flex.view';
import {InuPanelTabsView} from './view/display/inu-panel-tabs/inu-panel-tabs.view';
import {InuToastView} from './view/display/inu-toast/inu-toast-view.component';
import {InuButtonView} from './view/actions/inu-button/inu-button-view.component';
import {InuDocItemView} from './view/display/inu-doc-item/inu-doc-item.view';
import {InuCopyView} from './view/actions/inu-copy/inu-copy.view';
import {InuSvgSwitzerlandView} from './view/charts/inu-svg-switzerland/inu-svg-switzerland.view';


export const routes: Routes = [
  {path: "", component: HomeView},
  {path: "icons", component: IconsView},
  {path: "actions", children:[
      {path: "inu-button", component: InuButtonView},
      {path: "inu-copy", component: InuCopyView}
    ]},
  {path: "charts", children:[
      {path: "inu-svg-switzerland", component: InuSvgSwitzerlandView}
    ]},
  {
    path: "display", children: [
      {path: "inu-cite", component: InuCiteView},
      {path: "inu-code", component: InuCodeView},
      {path: "inu-doc-item", component: InuDocItemView},
      {path: "inu-open-api", component: InuOpenApiView},
      {path: "inu-panel-tabs", component: InuPanelTabsView},
      {path: "inu-toast", component: InuToastView}

    ]
  },
  {path: "forms", children:[
      {path: "inu-checkbox-group", component: InuCheckboxGroupView},
  ]},
  {path: "tables", children:[
      {path: "inu-table-flex", component: InuTableFlexView},
    ]},
  { path: '**', redirectTo: '' }
];
