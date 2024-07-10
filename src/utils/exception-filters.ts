import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.debug(exception);

    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    let statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = exception instanceof HttpException ? this.extractMessage(exception.getResponse()) : 'Something went wrong!';

    // Initialize an optional errors object
    let errors: any = null;

    // Handle DTO Validation Error specifically
    if (statusCode === HttpStatus.BAD_REQUEST && exception.response && exception.response.message && Array.isArray(exception.response.message)) {
      errors = exception.response.message.reduce((acc, error) => {
        acc[error.property] = Object.values(error.constraints)[0];
        return acc;
      }, {});

      // Change the message for validation errors
      message = 'Validation failed';
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY; // Set status to 422 for validation errors
    }

    // Response structure adjustment to include errors if present
    const responseBody: any = {
      message,
      statusCode,
    };

    if (errors) {
      responseBody.message.errors = errors;
    }

    response.status(statusCode).json(responseBody);
  }

  private isEmptyOrUndefined(obj) {
    return obj === undefined || (Object.keys(obj).length === 0 && obj.constructor === Object);
  }


  private extractMessage(response: any): any {
    if (typeof response === 'string') {
      return response;
    }
    if (response.message && typeof response.message === 'string') {
      return response.message;
    }
    if (Array.isArray(response.message)) {
      return response.message[0]; // Assuming you want to extract the first message
    }

    if (response["status"] == 422) {
      // console.debug(Object.values(response['errors'])[0])
      return Object.values(response['errors'])[0];
    }
    return 'Something went wrong!';
  }
}
