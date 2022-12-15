import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryColumn({ name: 'username' })
  username: string;

  @Column()
  name: string;
  @Column()
  address: string;
  @Column()
  email: string;
  @Column()
  birthdate: Date;
  constructor(partial: Partial<Customer>) {
    Object.assign(this, partial);
  }
}
