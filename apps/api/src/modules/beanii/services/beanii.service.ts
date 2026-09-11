import { Injectable } from '@nestjs/common';
import { BeaniiQueryDto } from '../dto/beanii-query.dto';
import { BeaniiResponseDto } from '../dto/beanii-response.dto';

@Injectable()
export class BeaniiService {
  async processQuery(dto: BeaniiQueryDto): Promise<BeaniiResponseDto> {
    return {
      reply: `Beanii AI assistant received prompt: "${dto.message}"`,
      conversationId: dto.conversationId || 'new-session-id',
      recommendedCoffeeIds: [],
    };
  }
}
