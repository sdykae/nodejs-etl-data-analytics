// account nestjs service that uses the account entity and the account repository
// Path: src/account/boundary/account.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entity/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find();
  }

  async findOne(accountId: string): Promise<Account> {
    return await this.accountRepository.findOne({ where: { accountId } });
  }
  // async findOneByEmail(email: string): Promise<Account> {
  //   return await this.accountRepository.findOne({ where: {  } });
  // }

  async create(accountData: Account): Promise<Account> {
    const account = new Account(accountData);
    return await this.accountRepository.save(account);
  }

  async update(accountId: string, accountData: Account): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { accountId },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID "${accountId}" not found`);
    }
    this.accountRepository.merge(account, accountData);
    return await this.accountRepository.save(account);
  }

  async delete(accountId: string): Promise<void> {
    const account = await this.accountRepository.findOne({
      where: { accountId },
    });
    if (!account) {
      throw new NotFoundException(`Account with ID "${accountId}" not found`);
    }
    await this.accountRepository.delete({ accountId });
  }
}
