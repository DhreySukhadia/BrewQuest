import { Body, Controller, Post } from '@nestjs/common';
import { BeaniiService } from '../services/beanii.service';
import { BeaniiQueryDto } from '../dto/beanii-query.dto';

@Controller('beanii')
export class BeaniiController {
  constructor(private readonly beaniiService: BeaniiService) {}

  @Post('chat')
  chat(@Body() dto: BeaniiQueryDto) {
    return this.beaniiService.processQuery(dto);
  }
}
