/* istanbul ignore file */
export interface AbstractTransaction {
  id: number;
  sum: number;
  date: Date;
  userId: number;
  purposeId: number;
  usdEquivalent: number;
  userName?: string;
  purposeCategory?: string;
}
