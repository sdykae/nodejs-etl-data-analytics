import { CsvRecord } from './CsvRecord';

export class CsvRecordDto {
  total: string;
  email: string;
  date: string;
  total_stock: string;
  company: string;
  stock_price: string;
  transaction_type: string;
  constructor(csvRecord: CsvRecord) {
    this.total = csvRecord.total;
    this.email = csvRecord.email;
    this.date = csvRecord.date;
    this.total_stock = csvRecord.total_stock;
    this.company = csvRecord.company;
    this.stock_price = csvRecord.stock_price;
    this.transaction_type = csvRecord.transaction_type;
  }
}
