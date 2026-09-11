import { Injectable } from '@nestjs/common';
import { SearchQueryDto } from '../dto/search-query.dto';

@Injectable()
export class SearchService {
  async search(dto: SearchQueryDto) {
    return { query: dto.query, results: [] };
  }
}
