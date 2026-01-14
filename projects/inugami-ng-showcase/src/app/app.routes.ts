import {Routes} from '@angular/router';
import {HomeView} from './view/home/home.view';
import {IconsView} from './view/icons/icons.view';


export const routes: Routes = [
  { path: "", component: HomeView },
  { path: "icons", component: IconsView }
];
