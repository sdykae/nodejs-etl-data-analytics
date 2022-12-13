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

async function main() {
  const logger = new Logger(main.name);
  const csvRecords = await readCsv();
  const xmlRecords = await readXml();
  const jsonRecords = await readJson();

  // logger.log(csvRecords);
  // logger.log(xmlRecords);
  // logger.log(jsonRecords);
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

main();
