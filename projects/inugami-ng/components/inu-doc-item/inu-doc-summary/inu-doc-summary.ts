import {AfterViewInit, Component, effect, input, signal} from '@angular/core';
import {InuDocItem} from '../inu-doc-item';
import {TreeNode} from 'inugami-ng/models';
import {InuDocSummaryNode} from './node/inu-doc-summary-node';

@Component({
  selector: 'inu-doc-summary',
  standalone: true,
  providers: [],
  imports: [
    InuDocSummaryNode
  ],
  templateUrl: './inu-doc-summary.html',
  styleUrl: './inu-doc-summary.scss',
})
export class InuDocSummary implements AfterViewInit{


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  styleClass = input<string | undefined | null>('');
  children = input<readonly InuDocItem[] | undefined>(undefined);
  maxLevel = input<number>(3);
  //
  _styleClass = signal<string>('');
  nodes = signal<TreeNode<InuDocItem>[]>([]);

  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
      this.initStyleClass();
      this.init();
    });
  }

  ngAfterViewInit(): void {
    this.init();
  }

  init() {
    const children = this.children();
    if (!children) {
      return;
    }

    const compMap = new Map<string, any>();
    children.forEach(c => compMap.set(c.uid, c));

    const parentMap = new Map<string, string>(); // childUid -> parentUid
    children.forEach(parent => {
      const childrenOfThisParent = parent.children() || [];
      childrenOfThisParent.forEach((child: any) => {
        parentMap.set(child.uid, parent.uid);
      });
    });

    const roots = children.filter(c => !parentMap.has(c.uid));

    const result = roots.map(root => this.mapComponentToNode(root, 0));
    this.nodes.set(result);
  }

  private mapComponentToNode(comp: any, level: number): TreeNode<any> {
    return {
      uid: comp.uid,
      level: level,
      value: comp.data ? comp.data() : comp, // On récupère la valeur ou le composant
      children: comp.children()
        ? comp.children().map((child: any) => this.mapComponentToNode(child, level + 1))
        : []
    };
  }

  //==================================================================================================================
  // TOOLS
  //==================================================================================================================
  private initStyleClass() {
    const styles: string[] = ['inu-doc-summary'];
    const style = this.styleClass();
    if (style) {
      styles.push(style);
    }


    this._styleClass.set(styles.join(" "));
  }
}
