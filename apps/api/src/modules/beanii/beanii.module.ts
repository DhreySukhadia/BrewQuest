import { Module } from '@nestjs/common';
import { BeaniiController } from './controllers/beanii.controller';
import { BeaniiService } from './services/beanii.service';

@Module({
  controllers: [BeaniiController],
  providers: [BeaniiService],
  exports: [BeaniiService],
})
export class BeaniiModule {}
