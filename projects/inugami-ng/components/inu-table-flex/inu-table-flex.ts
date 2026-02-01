import {Component, contentChildren, effect, input, signal, viewChildren} from '@angular/core';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {InuTableFlexHeader} from './header/inu-table-flex-header';

@Component({
  selector: 'inu-table-flex',
  standalone: true,
  providers: [InuTemplateRegistryService],
  imports: [],
  templateUrl: './inu-table-flex.html',
  styleUrl: './inu-table-flex.scss',
})
export class InuTableFlex {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  styleClass = input<string | undefined | null>('');
  readonly headers = contentChildren(InuTableFlexHeader);

  //
  _styleClass = signal<string>('');
  _style = signal<string>('');

  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
      this.init();
    });
  }


  init() {
    const styles: string[] = ['inu-table-flex'];
    const style = this.styleClass();
    if (style) {
      styles.push(style);
    }
    this._styleClass.set(styles.join(" "));

    const headers = this.headers();

    const columnSizes : string[] = [];
    if(headers){
      for(let header of headers) {
        const size = header.size();
        columnSizes.push(size ? size : '1fr');
      }
    }

    this._style.set(`grid-template-columns: ${columnSizes.join(' ')};`)
  }
}
