import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { filterXSS } from 'xss';

@Injectable()
export class XssSanitizationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'body' || metadata.type === 'custom') {
            return this.sanitize(value);
        }
        return value;
    }

    private sanitize(value: any): any {
        if (typeof value === 'object') {
            for (const key in value) {
                if (value[key] && typeof value[key] === 'object') {
                    this.sanitize(value[key]);
                } else if (typeof value[key] === 'string') {
                    value[key] = filterXSS(value[key]);
                }
            }
        }
        return value;
    }
}
