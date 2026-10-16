import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AttributeCategory } from '@brewquest/db';
import { AttributesService } from '../services/attributes.service';
import { AttributeQueryDto } from '../dto/attribute-query.dto';

@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  findAll(@Query() query: AttributeQueryDto) {
    return this.attributesService.findAll(query.category);
  }

  @Get('category/:category')
  findByCategory(@Param('category') categoryParam: string) {
    const normalized = categoryParam.toUpperCase();
    if (!Object.values(AttributeCategory).includes(normalized as AttributeCategory)) {
      throw new BadRequestException(
        `Invalid attribute category '${categoryParam}'. Valid categories are: ${Object.values(AttributeCategory).join(', ')}`,
      );
    }
    return this.attributesService.findByCategory(normalized as AttributeCategory);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.attributesService.findById(id);
  }
}
