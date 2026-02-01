import {Component, effect, input, signal} from '@angular/core';

@Component({
  selector: 'inu-table-flex-cell',
  standalone: true,
  providers: [],
  imports: [],
  templateUrl: './inu-table-flex-cell.component.html',
  styleUrl: './inu-table-flex-cell.component.scss',
})
export class InuTableFlexCell {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  styleClass = input<string | undefined | null>('');

  //
  _styleClass = signal<string>('');

  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
      const styles: string[] = ['inu-table-flex-row'];
      const style = this.styleClass();
      if (style) {
        styles.push(style);
      }
      this._styleClass.set(styles.join(" "));
    });
  }
}
