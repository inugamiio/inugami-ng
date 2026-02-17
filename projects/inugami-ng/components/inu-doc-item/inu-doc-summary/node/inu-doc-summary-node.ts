import {Component, input} from '@angular/core';
import {InuDocItem} from '../../inu-doc-item';
import {TreeNode} from 'inugami-ng/models';

@Component({
  selector: 'inu-doc-summary-node',
  standalone: true,
  providers: [],
  imports: [],
  templateUrl: './inu-doc-summary-node.html',
  styleUrl: './inu-doc-summary-node.scss',
})
export class InuDocSummaryNode {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  nodes = input<TreeNode<InuDocItem>[] | undefined>(undefined);
  maxLevel = input<number>(3);
  //==================================================================================================================
  // BUILDER
  //==================================================================================================================
  buildHref(nodeValue: any): string {
    const result: string[] = [];
    const href = nodeValue.href();
    if (href) {
      result.push(href);
      const id = nodeValue.id();
      if (id) {
        result.push(id)
      }
    }


    return result.join('#');
  }


  protected getTitle(value: any): string {
    return value && value.title ? value.title : '';
  }

  protected computeClass(node: TreeNode<InuDocItem>): string {
    const result: string[] = [];
    result.push('level');
    result.push('level-' + node.level);
    return result.join(' ');
  }

  protected acceptedLevels(): boolean {
    const nodes = this.nodes();
    if (!nodes || nodes.length == 0) {
      return false;
    }

    const level = nodes[0].level + 1;
    const maxLevel = this.maxLevel();
    return level <= maxLevel;
  }
}
