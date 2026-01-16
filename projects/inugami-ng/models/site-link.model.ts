export interface InuSiteLink{
  title:string;
  path:string;
  icon?:string;
  styleClass?:string;
  external?:boolean;
  children?: InuSiteLinkChildren[];
  gaEvent?:string;
  gaCategory?:string;
}

export interface  InuSiteLinkChildren{
  links?: InuSiteLink[];
  title?:string;
}
