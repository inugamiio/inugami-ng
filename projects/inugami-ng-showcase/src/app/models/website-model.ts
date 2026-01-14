export interface SiteLink{
    title:string;
    path:string;
    external?:boolean;
    children?:SiteLinkChildren[];
    gaEvent?:string;
    gaCategory?:string;
}

export interface SiteLinkChildren{
    links?:SiteLink[];
    title?:string;
}