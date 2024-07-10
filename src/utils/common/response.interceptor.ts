import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();
    const method = request.method;

    return next.handle().pipe(
      map(data => {
        const response = context.switchToHttp().getResponse();
        let statusCode = response.statusCode;
        let responseData: any = { data, statusCode };

        // If there's a message property in the data, move it to the top level
        if (data?.message) {
          responseData.message = data.message;
          // Consider removing the message from data if it's no longer needed inside
          delete data.message;
        } else {
          responseData.message = data == null ? "Empty record" : Array.isArray(data.data) ? data.data.length > 0 ? "Success" : "Empty records" : "Success"
        }

        if (data != null) {
          if (Array.isArray(data.data)) {
            responseData.data = {
              "records": responseData.data.data, "currentPage": responseData.data.currentPage,
              "totalRecords": responseData.data.totalRecords,
              "hasNextPage": responseData.data.hasNextPage
            }
          }
        }

        // Check if data is empty and set status code to 404
        if (data == null && method !== 'DELETE') {
          responseData.statusCode = 404;
        }

        // Handle DELETE request specifically
        if (method === 'DELETE') {
          responseData.message = "DELETE request handled";
        }

        response.statusCode = responseData.statusCode;

        return responseData;
      }),
    );
  }
}
