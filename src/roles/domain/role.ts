import { Expose } from 'class-transformer';
import { StatusEnum } from 'src/statuses/statuses.enum';

export class Role {
  id: number;
  @Expose()
  name?: string;
  status?: StatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
