export class UuidUtils {

  private static _S4():string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  public static buildUid(): string {
    return (
      this._S4() + this._S4() + "-" +
      this._S4() + "-4" +
      this._S4().substring(0, 3) + "-" +
      this._S4() + "-" +
      this._S4() + this._S4() + this._S4()
    ).toLowerCase();
  }
}
