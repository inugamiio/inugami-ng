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
  hasAccess = input<boolean>(true);
  label = input<string>('');
  name = input.required<string>();
  styleClass = input<string | undefined | null>('');
  valid = input<boolean>(true);
  //
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
