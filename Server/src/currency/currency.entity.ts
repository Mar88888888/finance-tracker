import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { TransactionEntity } from 'src/transactions/transaction.entity';
import { CurrencyCode } from './currency-code.enum';

@Entity({name: 'currencies'})
export class CurrencyEntity {
  @PrimaryColumn({ type: 'enum', enum: CurrencyCode, default: CurrencyCode.USD })
  code: CurrencyCode;

  @Column()
  name: string;
  
  @OneToMany(/* istanbul ignore next */() => TransactionEntity, /* istanbul ignore next */(transaction) => transaction.currency)
  transactions: TransactionEntity[];
}
