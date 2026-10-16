import { Module } from '@nestjs/common';
import { AttributesController } from './controllers/attributes.controller';
import { AttributesService } from './services/attributes.service';

@Module({
  controllers: [AttributesController],
  providers: [AttributesService],
  exports: [AttributesService],
})
export class AttributesModule {}
