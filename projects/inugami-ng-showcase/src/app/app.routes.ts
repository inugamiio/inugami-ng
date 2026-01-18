import {Routes} from '@angular/router';
import {HomeView} from './view/home/home.view';
import {IconsView} from './view/icons/icons.view';
import {InuCiteView} from './view/display/inu-cite/inu-cite.view';
import {InuCodeView} from './view/display/inu-code/inu-code.view';
import {InuOpenApiView} from './view/display/inu-open-api/inu-open-api.view';


export const routes: Routes = [
  {path: "", component: HomeView},
  {path: "icons", component: IconsView},
  {
    path: "display", children: [
      {path: "inu-cite", component: InuCiteView},
      {path: "inu-code", component: InuCodeView},
      {path: "inu-open-api", component: InuOpenApiView}
    ]
  },
  { path: '**', redirectTo: '' }
];
