import {InuSelectItem, SvgStyle} from 'inugami-ng/models';


export type InuSvgSwitzerlandValueExtractor = (selectItem: InuSelectItem<any>) => number | undefined;
export type InuSvgSwitzerlandStyleGenerator = (selectItem: InuSelectItem<any>) => SvgStyle | undefined;

export interface InuSvgSwitzerlandAction {
  onSelected: (node: InuSelectItem<any>) => any;
  onDeselected: (node: InuSelectItem<any>) => any;
  toggleSelectState : ()=> boolean;
}

export interface SelectItemCanton {
  name: string;
  node: SVGElement;
  selectItem: InuSelectItem<any>;
}
