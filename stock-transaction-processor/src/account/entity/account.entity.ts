import { Entity, PrimaryColumn, Column, BaseEntity, Unique } from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryColumn({ name: 'account_id', type: 'bigint' })
  accountId: string;

  @Column({ name: 'username' })
  username: string;

  constructor(partial: Partial<Account>) {
    Object.assign(this, partial);
  }
}
