export interface InuSelectItem<T>{
  title:string;
  value:T;
  id:string;
  styleClass?:string;
  disabled?:boolean;
  selected?:boolean;
}
export type InuSelectItemMatcher = (selectItem: InuSelectItem<any>, value:any) => InuSelectItem<any>|undefined;
