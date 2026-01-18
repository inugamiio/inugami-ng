export const TARGET_BLANK = '_blank';
export const TARGET_SELF = '_self';
export const TARGET_PARENT = '_parent';
export interface InuSiteLink{
  title:string;
  path:string;
  icon?:string;
  styleClass?:string;
  external?:boolean;
  target?:string,
  children?: InuSiteLinkChildren[];
  gaEvent?:string;
  gaCategory?:string;
}

export interface  InuSiteLinkChildren{
  links?: InuSiteLink[];
  title?:string;
}
