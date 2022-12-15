import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';
import { parse as csvParse } from 'csv-parse/sync';
import { xml2json } from 'xml-js';
import { XmlTransaction } from './models/XmlTransaction';
import { XmlRecordDto } from './models/XmlRecordDto';
import { CsvRecordDto } from './models/CsvRecordDto';
import { JsonRecordDto } from './models/JsonRecordDto';
import { default as axios } from 'axios';
import { TransactionReport } from './models/TransactionReport';
import { AccountService } from './account/account.service';
import { CustomerService } from './customer/customer.service';
import { Transaction, TransactionType } from './models/Transaction';

@Injectable()
export class AppService implements OnModuleInit {
  // import AccountService in constructor
  // constructor(private readonly accountService: AccountService) {}
  constructor(
    private readonly customerService: CustomerService,
    private readonly accountService: AccountService,
  ) {}

  async createTransactionFromCsvRecord(
    csvRecordDto: CsvRecordDto,
  ): Promise<Transaction> {
    // getUser with email
    const customer = await this.customerService.findOneByEmail(
      csvRecordDto.email,
    );
    const transaction = new Transaction({
      username: customer.username,
      name: customer.name,
      transactionType:
        csvRecordDto.transaction_type === 'BUY'
          ? TransactionType.BUY
          : TransactionType.SELL,
      stockCount: Number(csvRecordDto.total_stock),
      company: csvRecordDto.company,
      stockUnitPrice: Number(csvRecordDto.stock_price),
    });
    // TODO: save transaction to db
    return transaction;
  }

  onModuleInit(): void {
    this.processCsvTransactions().then(console.log);
  }

  async processCsvTransactions(): Promise<void> {
    // TODO: processCsvTransactions should be batch
    const csvRecords = await readCsv();
    const transactions = await Promise.all(
      csvRecords.map(async (csvRecord) => {
        return await this.createTransactionFromCsvRecord(csvRecord);
      }),
    );
    console.log(JSON.stringify(transactions[0]));
  }
}

async function readCsv(): Promise<CsvRecordDto[]> {
  const filePath = 'data/group-a.csv';
  const logger = new Logger(readCsv.name);
  let fileContents = '';
  if (existsSync(filePath)) {
    try {
      fileContents = readFileSync(filePath, 'utf-8');
    } catch (error) {
      logger.error(error);
    }
  }
  const records: Record<string, string>[] = csvParse(fileContents, {
    delimiter: ',',
    columns: true,
  });
  const csvRecords: CsvRecordDto[] = records.map((record) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new CsvRecordDto(record);
  });
  return csvRecords;
}

async function readXml(): Promise<XmlTransaction[]> {
  const filePath = 'data/group-c.xml';
  const logger = new Logger(readXml.name);
  let fileContents = '';
  if (existsSync(filePath)) {
    try {
      fileContents = readFileSync(filePath, 'utf-8');
    } catch (error) {
      logger.error(error);
    }
  }
  const recordsString = xml2json(fileContents, { compact: true, spaces: 2 });
  let records: XmlRecordDto;
  try {
    records = JSON.parse(recordsString);
  } catch (error) {
    logger.error(error);
  }
  return records.transactions.transaction;
}

async function readJson(): Promise<JsonRecordDto[]> {
  const httpClient = axios.create({
    baseURL: 'https://softrizon.com/wp-content/uploads/ch/',
  });
  const records = await httpClient.get<JsonRecordDto[]>('group-b.json');
  return records.data;
}

async function main(): Promise<void> {
  const logger = new Logger(main.name);
  const csvRecords = await readCsv();
  const xmlRecords = await readXml();
  const jsonRecords = await readJson();

  logger.log(csvRecords);
  logger.log(xmlRecords);
  logger.log(jsonRecords);
}

// transform CsvRecordDto type to TransactionReport type
function transformCsvRecordToTransactionReport(
  record: CsvRecordDto,
): TransactionReport {
  // CsvRecordDto does not have name attribute, get from database

  return {
    // name: record.name, // from db
    // username: record.username, // from db
    // sell_count: record.sell_count,
    // buy_count: record.buy_count,
    // min_investment: record.min_investment,
    // max_investment: record.max_investment,
    // total_stock: record.total_stock,
  } as TransactionReport;
}
