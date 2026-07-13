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
import {InuSvgUtilsView} from './view/charts/inu-svg-utils/inu-svg-utils.view';
import {InuSvgIsometricView} from './view/charts/inu-svg-isometric/inu-svg-isometric.view';
import {InuSvgAssetView} from './view/charts/inu-svg-assets/inu-svg-assets.view';
import {InuInputTextView} from './view/forms/inu-input-text/inu-input-text.view';
import {InuCacheServiceView} from './view/utils/inu-cache-service/inu-cache-service.view'
import {InuStringUtilsView} from './view/utils/inu-string-utils/inu-string-utils.view'
import {InuErrorServiceView} from './view/utils/inu-error-service/inu-error-service.view'
import {InuMainHeaderView} from './view/layout/inu-main-header/inu-main-header.view'
import {InuFooterView} from './view/layout/inu-footer/inu-footer.view'
import {InuAsideMenuView} from './view/layout/inu-aside-menu/inu-aside-menu.view'
import {InuPageLayoutView} from './view/layout/inu-page-layout/inu-page-layout.view'
import {InuFormsUtilsView} from './view/utils/inu-forms-utils/inu-forms-utils.view'
import {InuToolTipsView} from './view/display/inu-tool-tips/inu-tool-tips.view'
import {InuInputPasswordView} from './view/forms/inu-input-password/inu-input-password.view'
import {InuLabelView} from './view/display/inu-label/inu-label.view'
import {InuPanelView} from './view/display/inu-panel/inu-panel.view'
import {InuProgressView} from './view/display/inu-progress/inu-progress.view'
import {InuRadioGroupView} from './view/forms/inu-radio-group/inu-radio-group.view'
import {InuSelectListView} from './view/forms/inu-select-list/inu-select-list.view'
import {InuLoadingView} from './view/display/inu-loading/inu-loading.view'
import {InuToggleView} from './view/forms/inu-toggle/inu-toggel.view'
import {InuDropdownView} from './view/forms/inu-dropdown/inu-dropdown.view'


export const routes: Routes = [
  {path: "", component: HomeView},
  {path: "icons", component: IconsView},
  {
    path: "actions", children: [
      {path: "inu-button", component: InuButtonView},
      {path: "inu-copy", component: InuCopyView}
    ]
  },
  {
    path: "charts", children: [
      {path: "inu-svg-assets", component: InuSvgAssetView},
      {path: "inu-svg-utils", component: InuSvgUtilsView},
      {path: "inu-svg-isometric", component: InuSvgIsometricView},
      {path: "inu-svg-switzerland", component: InuSvgSwitzerlandView}
    ]
  },
  {
    path: "display", children: [
      {path: "inu-cite", component: InuCiteView},
      {path: "inu-code", component: InuCodeView},
      {path: "inu-doc-item", component: InuDocItemView},
      {path: "inu-label", component: InuLabelView},
      {path: "inu-loading", component: InuLoadingView},
      {path: "inu-open-api", component: InuOpenApiView},
      {path: "inu-panel", component: InuPanelView},
      {path: "inu-panel-tabs", component: InuPanelTabsView},
      {path: "inu-progress", component: InuProgressView},
      {path: "inu-toast", component: InuToastView},
      {path: "inu-inu-tool-tips", component: InuToolTipsView}

    ]
  },
  {
    path: "forms", children: [
      {path: "inu-checkbox-group", component: InuCheckboxGroupView},
      {path: "inu-dropdown", component: InuDropdownView},
      {path: "inu-input-password", component: InuInputPasswordView},
      {path: "inu-input-text", component: InuInputTextView},
      {path: "inu-radio-group", component: InuRadioGroupView},
      {path: "inu-select-list", component: InuSelectListView},
      {path: "inu-toggle", component: InuToggleView}
    ]
  },
  {
    path: "layout", children: [
      {path: "inu-aside-menu", component: InuAsideMenuView},
      {path: "inu-footer", component: InuFooterView},
      {path: "inu-main-header", component: InuMainHeaderView},
      {path: "inu-page-layout", component: InuPageLayoutView}
    ]
  },
  {
    path: "tables", children: [
      {path: "inu-table-flex", component: InuTableFlexView}
    ]
  },
  {
    path: "utils", children: [
      {path: "inu-cache-service", component: InuCacheServiceView},
      {path: "inu-error-service", component: InuErrorServiceView},
      {path: "inu-forms-utils", component: InuFormsUtilsView},
      {path: "inu-string-utils", component: InuStringUtilsView}
    ]
  },
  {path: '**', redirectTo: ''}
];
