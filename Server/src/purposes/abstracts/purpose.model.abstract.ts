export abstract class AbstractPurpose {
  protected id: number;
  protected category: string;
  protected type: boolean;

  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getCategory(): string {
    return this.category;
  }

  setCategory(category: string): void {
    this.category = category;
  }

  getType(): boolean {
    return this.type;
  }

  setType(type: boolean): void {
    this.type = type;
  }
}
