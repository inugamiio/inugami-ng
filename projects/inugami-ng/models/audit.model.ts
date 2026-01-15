export interface AuditDTO{
  createdBy?:string;
  createdDate?:Date;
  lastModifiedBy?:string;
  lastModifiedDate?:Date;
  version?:Date;
}

export interface Auditable{
  audit?:AuditDTO;
}
