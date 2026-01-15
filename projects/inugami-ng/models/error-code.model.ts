export interface ProblemDTO{
  type?:string;
  message?:string;
  localizedMessage?:string;
  status?:number;
  reasonPhrase?:string;
  detail?:string;
  instance?:string;
  timestamp?:Date;
  cause?:ProblemDTO;
  details?:any;
  errors?:ProblemErrorDTO[];
  parameters?:ProblemParameterDTO[];
}

export interface ProblemErrorDTO{
  name?:string;
  type?:string;
  reason?:string;

}
export interface ProblemParameterDTO{
  errorCode?:string;
  errorType?:string;
  fields?:ProblemParameterFieldsDTO[];
}
export interface ProblemParameterFieldsDTO{
  errorCode?:string;
  errorType?:string;
  name?:string;
  detail?:string;
  value?:any;
}
