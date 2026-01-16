export interface SearchRequest{
  page?:number;
  pageSize?:number;
  sortFields?:number;
  sortOrder?:'ASC'|'DESC';
  createdBy?:string[];
  createdDate?:string[];
  lastModifiedBy?:string[];
  lastModifiedDate?:string[];
}

export interface SearchResponse<T>{
  page:number;
  pageSize:number;
  previous:boolean;
  next:boolean;
  totalPages?:number;
  sortFields?:string;
  sortOrder?:'ASC'|'DESC';
  nbFoundItems?:number;
  filters?:any;
  data?:T[];
}
