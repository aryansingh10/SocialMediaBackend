import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const handleError = (error: any, customMessage: string) => {
  if (
    error instanceof NotFoundException ||
    error instanceof UnauthorizedException
  ) {
    throw error; 
  }
  console.error(`Internal Server Error: ${customMessage}: ${error.message}`);
  throw new InternalServerErrorException(customMessage);
};
