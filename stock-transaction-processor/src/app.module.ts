import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account/entity/account.entity';
import { Customer } from './customer/entity/customer.entity';
import { AccountModule } from './account/account.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3360,
      username: 'root',
      password: 'EtLTest2022',
      database: 'analytics',
      entities: [Account, Customer],
      synchronize: false,
      logging: true,
    }),
    AccountModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
