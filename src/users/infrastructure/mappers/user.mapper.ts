import { User } from '../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { RoleEntity } from '../../../roles/infrastructure/entities/role.entity';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const user = new User();
    user.id = raw.id;
    user.email = raw.email;
    user.password = raw.password;
    user.previousPassword = raw.previousPassword;
    user.provider = raw.provider;
    user.socialId = raw.socialId;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    user.address = raw.address;
    user.role = raw.role;
    user.status = raw.status;
    user.role = raw.role;
    user.createdAt = raw.createdAt;
   
    return user;
  }

  static toPersistence(user: User): UserEntity {
    let role;
    if (user.role) {
      role = new RoleEntity();
      role.id = user.role.id;
    }

    let photo: FileEntity | undefined = undefined;

    if (user.photo) {
      photo = new FileEntity();
      photo.id = user.photo.id;
    }

    const userEntity = new UserEntity();
    if (user.id && typeof user.id === 'string') {
      userEntity.id = user.id;
    }
    userEntity.id = user.id;
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.previousPassword = user.previousPassword;
    userEntity.provider = user.provider;
    if (user.address) {
      userEntity.address = user.address;
    }
    userEntity.socialId = user.socialId;
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.photo = photo;
    userEntity.role = role;
    userEntity.status = user.status!;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;
    userEntity.deletedAt = user.deletedAt;
    return userEntity;
  }
}
