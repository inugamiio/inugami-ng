import {Component, effect, input, signal} from '@angular/core';

@Component({
  selector: 'inu-table-flex-header',
  standalone: true,
  providers: [],
  imports: [],
  templateUrl: './inu-table-flex-header.html',
  styleUrl: './inu-table-flex-header.scss',
})
export class InuTableFlexHeader {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  styleClass = input<string | undefined | null>('');
  size = input<string | undefined | null>('');

  //
  _styleClass = signal<string>('');

  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
      const styles: string[] = ['inu-table-flex-header'];
      const style = this.styleClass();
      if (style) {
        styles.push(style);
      }
      this._styleClass.set(styles.join(" "));
    });
  }
}
