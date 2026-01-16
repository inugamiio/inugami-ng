export interface InuSelectItem<T>{
  title:string;
  value:T;
  styleClass?:string;
  disabled?:boolean;
  selected?:boolean;
}
