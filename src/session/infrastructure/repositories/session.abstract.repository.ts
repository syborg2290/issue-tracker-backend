import { NullableType } from '../../../utils/types/nullable.type';
import { Session } from '../../domain/session';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { User } from 'src/users/domain/user';

export abstract class SessionAbstractRepository {
  abstract findOne(
    options: EntityCondition<Session>,
  ): Promise<NullableType<Session>>;

  abstract create(
    data: Omit<Session, 'id' | 'createdAt' | 'deletedAt'>,
  ): Promise<Session>;

  abstract softDelete({
    excludeId,
    ...criteria
  }: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<void>;
}
