import {Component, computed, effect, inject, input, signal} from '@angular/core';
import { InuTableFlex } from "../inu-table-flex";

@Component({
  selector: 'inu-table-flex-row',
  standalone: true,
  providers: [],
  imports: [],
  templateUrl: './inu-table-flex-row.html',
  styleUrl: './inu-table-flex-row.scss',
})
export class InuTableFlexRow {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  styleClass = input<string | undefined | null>('');

  private parent = inject(InuTableFlex);
  readonly gridStyle = computed(() => this.parent._style());

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
