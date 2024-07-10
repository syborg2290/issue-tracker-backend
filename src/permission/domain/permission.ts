import { Allow } from 'class-validator';

export class Permission {
  id: string;
  @Allow()
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
