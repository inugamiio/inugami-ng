import {Component, effect, input, signal, TemplateRef, viewChild} from '@angular/core';

@Component({
  selector: 'inu-panel-tab',
  standalone: true,
  providers: [],
  imports: [],
  template: `
    <ng-template #content>
      <div [class]="_styleClass()">
        <ng-content/>
      </div>
    </ng-template>
  `
})
export class InuPanelTab {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  icon = input<string>('');
  label = input<string>('');
  styleClass = input<string | undefined | null>('');
  disabled = input<boolean>(false);
    readonly templateRef = viewChild.required<TemplateRef<any>>('content');
  //
  display = signal<boolean>(false);
  _styleClass = signal<string>('');

  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
      const styles: string[] = ['inu-panel-tab'];
      const style = this.styleClass();
      if (style) {
        styles.push(style);
      }
      this._styleClass.set(styles.join(" "));
    });
  }
}
