import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
