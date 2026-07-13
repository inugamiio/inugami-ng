import {Component, DOCUMENT, inject, signal} from '@angular/core';
import {InuDropdown} from 'inugami-ng/components/inu-dropdown';
import {InuSelectItem} from 'inugami-ng/models'
import {InuFormsUtils} from 'inugami-ng/utils'
import {form, FormField} from '@angular/forms/signals'

interface ThemeModel {
  themes: string[];
}

@Component({
             templateUrl: './themes.view.html',
             styleUrls  : ['./themes.view.scss'],
             imports    : [
               InuDropdown,
               FormField
             ]
           })
export class ThemesView {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  private document  = inject(DOCUMENT);
  formModel         = signal<ThemeModel>({
                                           themes: ['default']
                                         });
  themeForm         = form(this.formModel, (path) => {
  });
  themesSelectItems = signal<InuSelectItem<string>[]>([
                                                        {title: 'Default', id: 'default', value: 'default'},
                                                        {title: 'Dark', id: 'dark', value: 'dark'}
                                                      ]);

  //==================================================================================================================
  // INIT
  //==================================================================================================================

  constructor() {
    InuFormsUtils.onChanged(this.formModel, 50)
      .subscribe(value => {
        this.onThemeChanged(value)
      });
  }

  private onThemeChanged(value: ThemeModel) {
    const htmlTag = this.document.documentElement;
    const theme   = value.themes.find(() => true);
    htmlTag.removeAttribute('data-theme');
    htmlTag.setAttribute('data-theme', theme ?? 'default');
  }
}
