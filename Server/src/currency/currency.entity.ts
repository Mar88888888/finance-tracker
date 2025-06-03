import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { TransactionEntity } from 'src/transactions/transaction.entity';
import { CurrencyCode } from './currency-code.enum';

@Entity()
export class CurrencyEntity {
  @PrimaryColumn({ type: 'enum', enum: CurrencyCode, default: CurrencyCode.USD })
  code: CurrencyCode;

  @Column()
  name: string;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.currency)
  transactions: TransactionEntity[];
}
