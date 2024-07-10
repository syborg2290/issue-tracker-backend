import { Injectable } from '@nestjs/common';
import { EntityCondition } from '../utils/types/entity-condition.type';

import { Session } from './domain/session';
import { NullableType } from '../utils/types/nullable.type';
import { SessionAbstractRepository } from './infrastructure/repositories/session.abstract.repository';
import { User } from 'src/users/domain/user';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionAbstractRepository) { }

  findOne(options: EntityCondition<Session>): Promise<NullableType<Session>> {
    return this.sessionRepository.findOne(options);
  }

  create(
    data: Omit<Session, 'id' | 'createdAt' | 'deletedAt'>,
  ): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  async softDelete(criteria: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<void> {
    await this.sessionRepository.softDelete(criteria);
  }
}
