export interface InuSelectItem<T>{
  title:string;
  value:T;
  id:string;
  styleClass?:string;
  disabled?:boolean;
  selected?:boolean;
}
