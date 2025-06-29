/* istanbul ignore file */

import { MigrationInterface, QueryRunner } from "typeorm";

export class CurrencyUpdate1748949226285 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
      CREATE TABLE currencies (
        code VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL
      )
    `);

    await queryRunner.query(`
      INSERT INTO currencies (code, name) VALUES
        ('AUD', 'Australian Dollar'),
        ('BGN', 'Bulgarian Lev'),
        ('BRL', 'Brazilian Real'),
        ('CAD', 'Canadian Dollar'),
        ('CHF', 'Swiss Franc'),
        ('CNY', 'Chinese Renminbi Yuan'),
        ('CZK', 'Czech Koruna'),
        ('DKK', 'Danish Krone'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
        ('HKD', 'Hong Kong Dollar'),
        ('HUF', 'Hungarian Forint'),
        ('IDR', 'Indonesian Rupiah'),
        ('ILS', 'Israeli New Sheqel'),
        ('INR', 'Indian Rupee'),
        ('ISK', 'Icelandic Króna'),
        ('JPY', 'Japanese Yen'),
        ('KRW', 'South Korean Won'),
        ('MXN', 'Mexican Peso'),
        ('MYR', 'Malaysian Ringgit'),
        ('NOK', 'Norwegian Krone'),
        ('NZD', 'New Zealand Dollar'),
        ('PHP', 'Philippine Peso'),
        ('PLN', 'Polish Złoty'),
        ('RON', 'Romanian Leu'),
        ('SEK', 'Swedish Krona'),
        ('SGD', 'Singapore Dollar'),
        ('THB', 'Thai Baht'),
        ('TRY', 'Turkish Lira'),
        ('USD', 'United States Dollar'),
        ('ZAR', 'South African Rand')
    `);

    await queryRunner.query(`
      ALTER TABLE transaction
      ADD COLUMN currency VARCHAR
    `);


    await queryRunner.query(`
      UPDATE transaction SET currency = 'USD'
    `);


    await queryRunner.query(`
      ALTER TABLE transaction
      ALTER COLUMN currency SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE transaction
      ADD CONSTRAINT fk_transaction_currency
      FOREIGN KEY (currency) REFERENCES currencies(code)
      ON DELETE RESTRICT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE transaction DROP CONSTRAINT fk_transaction_currency`);
    await queryRunner.query(`ALTER TABLE transaction DROP COLUMN currency`);
    await queryRunner.query(`DROP TABLE currencies`);
  }

}
