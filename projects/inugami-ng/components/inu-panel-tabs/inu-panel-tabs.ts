import {AfterViewInit, Component, contentChildren, effect, input, signal} from '@angular/core';
import {InuPanelTab} from './inu-panel-tab/inu-panel-tab.component';
import {NgTemplateOutlet} from '@angular/common';
import {InuIcon} from 'inugami-icons';

@Component({
  selector: 'inu-panel-tabs',
  standalone: true,
  providers: [],
  imports: [
    NgTemplateOutlet,
    InuIcon
  ],
  templateUrl: './inu-panel-tabs.html',
  styleUrl: './inu-panel-tabs.scss',
})
export class InuPanelTabs implements AfterViewInit {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  styleClass = input<string | undefined | null>('');
  readonly vertical = input(false);
  readonly childrenTabs = contentChildren(InuPanelTab);


  //
  _styleClass = signal<string>('');

  tabs = signal<InuPanelTab[]>([]);
  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
      this.initStyleClass();
    });
  }

  private initStyleClass() {
    const styles: string[] = ['inu-panel-tabs'];
    const style = this.styleClass();
    if (style) {
      styles.push(style);
    }
    if(this.vertical()){
      styles.push('vertical');
    }
    this._styleClass.set(styles.join(" "));
  }


  ngAfterViewInit(): void {
    this.initTabs();
  }

  private initTabs() {
    const result: InuPanelTab[] = [];
    const children = this.childrenTabs();

    let first = true;
    for (let child of children) {
      if (first) {
        child.display.set(true);
        first= false;
      }
      result.push(child);
    }
    this.tabs.set(result);
  }


}
