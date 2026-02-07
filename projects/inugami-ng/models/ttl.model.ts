export interface TTLWrapper<T>{
  id:string;
  ttl:number;
  value?:T;
}
