import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe implements PipeTransform<unknown> {
  transform(value: unknown, _metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('Validation failed: No payload provided');
    }
    return value;
  }
}
