import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base class for custom domain exceptions.
 */
export class DomainException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super({ message, error: 'DomainError', statusCode: status }, status);
  }
}
