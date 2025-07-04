export abstract class AbstractTransaction {
  protected id: number;
  protected sum: number;
  protected date: Date;
  protected userId: number;
  protected purposeId: number;
  protected usdEquivalent: number;

  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getSum(): number {
    return this.sum;
  }

  setSum(sum: number): void {
    this.sum = sum;
  }

  getDate(): Date {
    return this.date;
  }

  setDate(date: Date): void {
    this.date = date;
  }

  getUserId(): number {
    return this.userId;
  }

  setUserId(memberId: number): void {
    this.userId = memberId;
  }

  getPurposeId(): number {
    return this.purposeId;
  }

  setPurposeId(purposeId: number): void {
    this.purposeId = purposeId;
  }

  getUsdEquivalent(): number {
    return this.usdEquivalent;
  }
  setUsdEquivalent(usdEquivalent: number): void {
    this.usdEquivalent = usdEquivalent;
  }
}
