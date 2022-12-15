export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
}
export class Transaction {
  name: string; // The customer’s name.
  username: string; // The customer’s username.
  transactionType: TransactionType; // The type of transaction (buy or sell).
  stockCount: number; // The number of stock bought or sold.
  company: string; // The company name.
  stockUnitPrice: number; // The price of a single stock unit.

  constructor(partial?: Partial<Transaction>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
