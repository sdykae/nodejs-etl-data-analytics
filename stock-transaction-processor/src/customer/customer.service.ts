import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entity/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(username: string): Promise<Customer> {
    return await this.customerRepository.findOne({ where: { username } });
  }
  async findOneByEmail(email: string): Promise<Customer> {
    return await this.customerRepository.findOne({ where: { email } });
  }

  async create(customerData: Customer): Promise<Customer> {
    const customer = new Customer(customerData);
    return await this.customerRepository.save(customer);
  }

  async update(customerData: Customer): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { username: customerData.username },
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID "${customerData.username}" not found`,
      );
    }
    this.customerRepository.merge(customer, customerData);
    return await this.customerRepository.save(customer);
  }

  async delete(username: string): Promise<void> {
    const customer = await this.customerRepository.findOne({
      where: { username },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${username}" not found`);
    }
    await this.customerRepository.delete({ username });
  }
}
