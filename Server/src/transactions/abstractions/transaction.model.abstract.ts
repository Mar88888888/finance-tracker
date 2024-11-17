export abstract class AbstractTransaction {
  protected id: number;
  protected sum: number;
  protected date: Date;

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
}
