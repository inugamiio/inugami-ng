export interface ToastMessage {
  title?: string;
  message?: string;
  level?:'debug'|'success'|'info'|'warn'|'error';
  icon?: string;
  delay?:number;
}
