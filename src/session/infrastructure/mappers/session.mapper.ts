import { UserMapper } from 'src/users/infrastructure/mappers/user.mapper';
import { Session } from '../../../session/domain/session';
import { SessionEntity } from '../entities/session.entity';
import { UserEntity } from 'src/users/infrastructure/entities/user.entity';


export class SessionMapper {
  static toDomain(raw: SessionEntity): Session {
    const session = new Session();
    session.id = raw.id;
    if (raw.user) {
      session.user = UserMapper.toDomain(raw.user);
    }
    session.createdAt = raw.createdAt;
    return session;
  }

  static toPersistence(session: Session): SessionEntity {
    const user = new UserEntity();
    user.id = session.user.id;

    const sessionEntity = new SessionEntity();
    if (session.id && typeof session.id === 'number') {
      sessionEntity.id = session.id;
    }
    sessionEntity.user = user;
    sessionEntity.createdAt = session.createdAt;
    sessionEntity.deletedAt = session.deletedAt;
    return sessionEntity;
  }
}
