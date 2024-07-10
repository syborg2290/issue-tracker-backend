import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { FileType } from '../../domain/file';
import { NullableType } from '../../../utils/types/nullable.type';

export abstract class FileRepository {
  abstract create(data: Omit<FileType, 'id'>): Promise<FileType>;

  abstract findOne(
    fields: EntityCondition<FileType>,
  ): Promise<NullableType<FileType>>;

  abstract softDeleteAndRemoveStorage(id: string): Promise<void>;
}
