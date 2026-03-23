export class InuStringUtils {


  public static normalize(value?: string): string {
    if (!value) {
      return '';
    }
    return value.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\-_]/g, '')
      .toLowerCase();
  }
}
