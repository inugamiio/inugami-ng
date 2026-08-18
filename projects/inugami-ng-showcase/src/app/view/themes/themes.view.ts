import {Component, computed, DOCUMENT, inject, signal, viewChildren} from '@angular/core';
import {InuDropdown} from 'inugami-ng/components/inu-dropdown';
import {
  BucketTimed,
  BucketTimedLoader,
  InuSelectItem,
  InuSelectItemExtractor,
  InuSelectItemMatcher,
  SvgLayerDTO,
  TimeLineRenderer, TimeLineRendererBuilder
} from 'inugami-ng/models'
import {InuFormsUtils} from 'inugami-ng/utils'
import {disabled, form, FormField, required} from '@angular/forms/signals'
import {BUTTON_TYPES, InuButton} from 'inugami-ng/components/inu-button';
import {InuToastServices} from 'inugami-ng/components/inu-toast';
import {InuCopy} from 'inugami-ng/components/inu-copy'
import {CITE_LEVELS, InuCite} from 'inugami-ng/components/inu-cite'
import {InuCode} from 'inugami-ng/components/inu-code';
import {InuDocItem, InuDocSummary} from 'inugami-ng/components/inu-doc-item';
import {InuLoading} from 'inugami-ng/components/inu-loading'
import {InuOpenApi} from 'inugami-ng/components/inu-open-api'
import {InugamiTemplateDirective} from 'inugami-ng/directives'
import {InuPanel} from 'inugami-ng/components/inu-panel';
import {InuPanelTab, InuPanelTabs} from "inugami-ng/components/inu-panel-tabs";
import {InuProgress} from 'inugami-ng/components/inu-progress';
import {InuToolTips} from 'inugami-ng/components/inu-tool-tips';
import {InugamiIconsSwitzerlandUtils, InuIcon, SWITZERLAND_CANTONS, SwitzerlandCanton} from 'inugami-icons'
import {InuCheckboxGroup} from "inugami-ng/components/inu-checkbox-group";
import {InuInputText} from 'inugami-ng/components/inu-input-text';
import {InuInputPassword} from 'inugami-ng/components/inu-input-password';
import {InuRadioGroup} from "inugami-ng/components/inu-radio-group";
import {InuSelectList} from 'inugami-ng/components/inu-select-list';
import {InuToggle} from 'inugami-ng/components/inu-toggle';
import {InuMultiStates} from 'inugami-ng/components/inu-multi-states';
import {
  InuTableFlex,
  InuTableFlexCell,
  InuTableFlexHeader,
  InuTableFlexRow
} from 'inugami-ng/components/inu-table-flex';
import {InuSvgSwitzerland} from 'inugami-ng/components/inu-svg-switzerland';
import {InuSvgIsometric} from 'inugami-ng/components/inu-svg-isometric';
import {InuSvgTimeline, InuSvgTimelineHistogram, InuSvgTimelineLine} from 'inugami-ng/components/inu-svg-timeline';
import {Observable} from 'rxjs'
import {HttpClient, HttpParams} from '@angular/common/http'


interface ThemeModel {
  themes: string[];
}

interface MyFormModel {
  verb: string[];
  verbRequired: string[];
  verbDisabled: string[];
  cantons: string[];
  login: string;
  password: string;
  value: string;
  passphrase: string;
  sms: boolean;
  email: boolean;
  mail: boolean;
  inApp: boolean;
}

interface MultiStatesFormModel {
  logLevels: string[];
  logLevel: string;
}

interface IsometricFormModel {
  layers: SvgLayerDTO[];
}

@Component({
             templateUrl: './themes.view.html',
             styleUrls  : ['./themes.view.scss'],
             imports    : [
               InuDropdown,
               FormField,
               InuButton,
               InuCopy,
               InuCite,
               InuCode,
               InuDocItem,
               InuDocSummary,
               InuLoading,
               InuOpenApi,
               InuOpenApi,
               InuPanel,
               InugamiTemplateDirective,
               InuPanelTab,
               InuPanelTabs,
               InuProgress,
               InuToolTips,
               InuIcon,
               InuCheckboxGroup,
               InuInputText,
               InuInputPassword,
               InuRadioGroup,
               InuSelectList,
               InuToggle,
               InuTableFlex,
               InuTableFlexCell,
               InuTableFlexHeader,
               InuTableFlexRow,
               InuSvgSwitzerland,
               InuSvgIsometric,
               InuMultiStates,
               InuSvgTimeline
             ]
           })
export class ThemesView {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  http                = inject(HttpClient);
  private document    = inject(DOCUMENT);
  toastServices       = inject(InuToastServices);
  readonly buttonType = signal<string[]>(BUTTON_TYPES);
  readonly citeLevels = signal<string[]>(CITE_LEVELS);
  readonly children   = viewChildren(InuDocItem);
  progressValue       = signal<number>(0.5);
  loading             = signal<boolean>(true);
  extractor           = signal<InuSelectItemExtractor | undefined>(undefined);
  matcher             = signal<InuSelectItemMatcher | undefined>(undefined);
  matcherMultiStates  = signal<InuSelectItemMatcher | undefined>(undefined);

  formModel = signal<ThemeModel>({
                                   themes: ['default']
                                 });


  themeForm         = form(this.formModel, (path) => {
  });
  themesSelectItems = signal<InuSelectItem<string>[]>([
                                                        {title: 'Default', id: 'default', value: 'default'},
                                                        {title: 'Dark', id: 'dark', value: 'dark'}
                                                      ]);

  verbs = computed<InuSelectItem<string>[]>(() => [
    {id: 'GET', value: 'GET', title: 'GET', styleClass: 'verb-get', tooltips: 'Read'},
    {id: 'POST', value: 'POST', title: 'POST', styleClass: 'verb-post', tooltips: 'Write, adding new value'},
    {id: 'PUT', value: 'PUT', title: 'PUT', styleClass: 'verb-put', tooltips: 'Updating value'}
  ]);

  cantons = computed<InuSelectItem<SwitzerlandCanton>[]>(() => SWITZERLAND_CANTONS
    .filter(c => c.code != 'ch')
    .map(c => <InuSelectItem<SwitzerlandCanton>>{
      id   : c.code,
      title: c.nameEn,
      value: c
    }));

  myFormModel = signal<MyFormModel>({
                                      verb        : ['GET', 'PUT'],
                                      verbRequired: [],
                                      verbDisabled: ['GET', 'PUT'],
                                      cantons     : ['GE', 'VD'],
                                      login       : '',
                                      password    : '',
                                      value       : 'some value',
                                      passphrase  : 'some passphrase',
                                      sms         : false,
                                      email       : true,
                                      inApp       : false,
                                      mail        : false
                                    });

  myForm = form(this.myFormModel, (path) => {
    required(path.verbRequired);
    required(path.login);
    required(path.password);
    required(path.email);
    //
    disabled(path.verbDisabled);
    disabled(path.value);
    disabled(path.passphrase);
    disabled(path.sms);
  });

  isometricModel = signal<IsometricFormModel>({
                                                layers: [
                                                  {
                                                    name   : 'root',
                                                    asserts: [
                                                      {
                                                        name     : 'desktop_1',
                                                        assetSet : 'isometric',
                                                        assetName: 'desktop',
                                                        x        : 0,
                                                        y        : 0,
                                                        size     : 2,
                                                        title    : 'Desktop'
                                                      },
                                                      {
                                                        name     : 'desktop_2',
                                                        assetSet : 'isometric',
                                                        assetName: 'desktop',
                                                        type     : '90',
                                                        x        : 200,
                                                        y        : 100,
                                                        size     : 2,
                                                        title    : 'Desktop 2'
                                                      },
                                                      {
                                                        name     : 'box_1',
                                                        assetSet : 'isometric',
                                                        assetName: 'box',
                                                        x        : -100,
                                                        y        : -100,
                                                        size     : 2,
                                                        title    : 'Box 1'
                                                      },
                                                      {
                                                        name     : 'router_1',
                                                        assetSet : 'isometric',
                                                        assetName: 'router',
                                                        type     : '90',
                                                        x        : -300,
                                                        y        : 0,
                                                        size     : 2,
                                                        title    : 'router 1'
                                                      },
                                                      {
                                                        name     : 'router_2',
                                                        title    : 'router 2',
                                                        assetSet : 'isometric',
                                                        assetName: 'router',
                                                        type     : '90',
                                                        x        : -200,
                                                        y        : 100,
                                                        size     : 2
                                                      },
                                                      {
                                                        name     : 'router_3',
                                                        title    : 'router 3',
                                                        assetSet : 'isometric',
                                                        assetName: 'router',
                                                        type     : 'default',
                                                        x        : 50,
                                                        y        : 200,
                                                        size     : 1
                                                      }
                                                    ]
                                                  }
                                                ]
                                              });
  isometricForm  = form(this.isometricModel, (path) => {
  });

  logLevelSelectItemsBasic = signal<InuSelectItem<string>[]>([
                                                               {
                                                                 id   : 'debug',
                                                                 title: 'Debug',
                                                                 value: 'debug'
                                                               },
                                                               {
                                                                 id   : 'info',
                                                                 title: 'Info',
                                                                 value: 'info'
                                                               },
                                                               {
                                                                 id   : 'warn',
                                                                 title: 'Warn',
                                                                 value: 'warn'
                                                               },
                                                               {
                                                                 id   : 'error',
                                                                 title: 'Error',
                                                                 value: 'error'
                                                               }
                                                             ]);
  formMultiStatesModel     = signal<MultiStatesFormModel>({
                                                            logLevels: ['info', 'warn'],
                                                            logLevel : 'info'
                                                          });
  formMultiStates          = form(this.formMultiStatesModel, (path) => {
    // required(path.logLevels);
  });

  // inu-svg-switzerland
  renderer      = signal<TimeLineRendererBuilder>(() => new InuSvgTimelineHistogram());
  rendererTypes = signal<InuSelectItem<TimeLineRenderer>[]>([
                                                              {
                                                                id      : 'InuSvgTimelineHistogram',
                                                                title   : 'Histograme',
                                                                value   : new InuSvgTimelineHistogram(),
                                                                selected: true
                                                              },
                                                              {
                                                                id   : 'InuSvgTimelineLine',
                                                                title: 'Line',
                                                                value: new InuSvgTimelineLine()
                                                              }
                                                            ]);
  from          = signal<Date>(new Date('2026-08-06T00:00:00.000+02:00'));
  until         = signal<Date>(new Date('2026-08-06T23:59:00.000+02:00'));
  loadData      = signal<BucketTimedLoader<number> | undefined>(undefined);
  //==================================================================================================================
  // INIT
  //==================================================================================================================

  constructor() {
    InuFormsUtils.onChanged(this.formModel, 50)
      .subscribe(value => {
        this.onThemeChanged(value)
      });
    setInterval(() => this.updateProgressValue(), 1000);
    this.matcher.set((selectItem, value) => {
      return selectItem.id.toUpperCase() == value ? selectItem : undefined;
    });
    this.extractor.set((v) => {
      return v.id.toUpperCase();
    });
    this.matcherMultiStates.set((selectItem, value) => {
      return selectItem.id.toUpperCase() == ('' + value).toUpperCase() ? selectItem : undefined;
    });
    this.loadData.set(this.processLoadingData.bind(this));
  }

  private onThemeChanged(value: ThemeModel) {
    const htmlTag = this.document.documentElement;
    const theme   = value.themes.find(() => true);
    htmlTag.removeAttribute('data-theme');
    htmlTag.setAttribute('data-theme', theme ?? 'default');
  }

  //==================================================================================================================
  // BUTTONS
  //==================================================================================================================
  protected addMessage(type: string) {
    this.toastServices.addMessage({
                                    title  : 'Hello',
                                    message: 'some message',
                                    level  : this.resolveLevel(type),
                                    icon   : 'idea'
                                  })
  }

  protected resolveButtonIcon(type: string) {
    switch (type) {
      case 'success':
        return 'approval';
      case 'primary':
        return 'check';
      case 'secondary':
        return 'download';
      case 'warn':
        return 'warning';
      case 'danger':
        return 'danger';
      case 'error':
        return 'bug';
      default:
        return 'bug';
    }
  }

  private resolveLevel(type: string) {
    switch (type) {
      case 'success':
        return 'success';
      case 'primary':
        return 'info';
      case 'secondary':
        return 'debug';
      case 'warn':
        return 'warn';
      default:
        return 'error';
    }
  }

  //==================================================================================================================
  // PROGRESS
  //==================================================================================================================
  private updateProgressValue() {

    let value = this.progressValue() + 0.1;
    if (value >= 1) {
      value = 0;
    }
    this.progressValue.set(value);
  }

  //==================================================================================================================
  // DROPDOWN
  //==================================================================================================================
  protected getCantonIcon(id: string): string {
    return InugamiIconsSwitzerlandUtils.getCanton(id ?? 'ch').icon;
  }

  //==================================================================================================================
  // inu-svg-timeline
  //==================================================================================================================
  protected rendererChange(event: TimeLineRenderer | undefined) {
    if (event) {
      this.renderer.set(() => event);
    }
  }

  private processLoadingData(from: Date,
                             until: Date,
                             resolution: number): Observable<BucketTimed<number>[]> {
    const currentRequest: any = {
      from      : from.getTime(),
      until     : until.getTime(),
      resolution: resolution
    };
    const params              = new HttpParams({fromObject: currentRequest});

    return this.http.get<BucketTimed<number>[]>(`api/svg/timeline`, {params})

  }
}
