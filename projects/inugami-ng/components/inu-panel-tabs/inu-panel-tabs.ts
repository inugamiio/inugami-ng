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
  readonly activeTab = input<string|undefined>(undefined);
  styleClass = input<string | undefined | null>('');
  readonly vertical = input(false);
  readonly childrenTabs = contentChildren(InuPanelTab);


  //
  _styleClass = signal<string>('');
  valid = signal<boolean>(true);
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
    if (this.vertical()) {
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



    for (let child of children) {
      result.push(child);
    }

    let found = false;
    const activeTab = this.activeTab();
    if(activeTab){
      for (let child of children) {
        if (activeTab == child.name()) {
          child.display.set(true);
          this.valid.set(child.valid());
          found = true;
        }
      }
    }

    if(!found){
      let first = true;
      for (let child of children) {
        if (first) {
          child.display.set(true);
          this.valid.set(child.valid());
          first = false;
        }
      }
    }

    this.tabs.set(result);
  }

  //==================================================================================================================
  // ACTIONS
  //==================================================================================================================
  openTab(panel: InuPanelTab) {
    if (!panel.hasAccess()) {
      return;
    }
    this.valid.set(true);
    const children = this.childrenTabs();
    if (!children) {
      return;
    }
    for (let child of children) {
      if (child.name() === panel.name()) {
        child.display.set(true);
        this.valid.set(child.valid());
      } else {
        child.display.set(false);
      }
    }
  }

  //==================================================================================================================
  // TOOLS
  //==================================================================================================================
  private checkValidity() {
    const children = this.childrenTabs();
    if (!children) {
      return;
    }
    this.valid.set(true);
    for (let child of children) {
      if(!child.valid()){
        this.valid.set(false);
        break;
      }
    }
  }
}
