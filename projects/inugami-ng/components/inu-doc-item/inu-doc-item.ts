import {Component, contentChildren, effect, input, signal, viewChildren} from '@angular/core';
import {InuDocItemComponentData} from './inu-doc-item.model';
import {InuIcon} from 'inugami-icons';
import {UuidUtils} from 'inugami-ng/services';

@Component({
  selector: 'inu-doc-item',
  standalone: true,
  providers: [],
  imports: [
    InuIcon
  ],
  templateUrl: './inu-doc-item.html',
  styleUrl: './inu-doc-item.scss',
})
export class InuDocItem {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  readonly styleClass = input<string | undefined | null>('');
  readonly icon = input<string | null>('');
  readonly title = input<string | undefined | null>('');
  readonly href = input<string | undefined | null>('');
  readonly id = input<string | undefined | null>('');
  readonly level = input<number | undefined | null>(2);
  readonly children = contentChildren(InuDocItem);
  //
  _styleClass = signal<string>('');
  iconSize = signal<number>(1);
  data = signal<InuDocItemComponentData | undefined>(undefined);
  _data: InuDocItemComponentData | undefined = undefined;
  uid: string = UuidUtils.buildUid();

  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
      this.initStyleClass();
      this.init();
    });
  }

  init() {
    const title = this.title() ? this.title() : '';
    const href = this.href() ? this.href() : '';
    const id = this.id() ? this.id() : '';
    const level = this.level() ? this.level() : 2;

    const fullHref: string[] = [];
    if (href) {
      fullHref.push(href);
      if (id) {
        fullHref.push(id);
      }
    }
    const value: InuDocItemComponentData = {
      title: title!,
      href: fullHref.join('#'),
      id: id!,
      level: level!
    }
    this._data = value;
    this.data.set(value);


    switch (level) {
      case 1:
        this.iconSize.set(3);
        break;
      case 2:
        this.iconSize.set(2);
        break;
      default :
        this.iconSize.set(1);
        break;
    }
  }

  //==================================================================================================================
  // TOOLS
  //==================================================================================================================
  private initStyleClass() {
    const styles: string[] = ['inu-doc-item'];
    const style = this.styleClass();
    if (style) {
      styles.push(style);
    }

    const level = this.level();
    if (level) {
      styles.push(`level-${level}`);
    }
    this._styleClass.set(styles.join(" "));
  }
}
