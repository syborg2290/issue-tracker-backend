import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class PrecisionPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value && metadata.type === 'body' && value.sellingPrice) {
            const precisionPrice = Number(value.sellingPrice).toPrecision(3); // Example: toPrecision(3)
            return {
                ...value,
                sellingPrice: precisionPrice,
            };
        }
        return value;
    }
}
