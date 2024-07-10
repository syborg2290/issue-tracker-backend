import { Role } from 'src/roles/domain/role';
import { RoleEntity } from '../entities/role.entity';
import { Permission } from 'src/permission/domain/permission';

export class RoleMapper {
  static toDomain(raw: RoleEntity): Role {
    const role = new Role();
    role.id = raw.id;
    role.name = raw.name;
    role.status = raw.status;
    role.createdAt = raw.createdAt;
    return role;
  }

  static toDomainForFindOne(raw: RoleEntity, permissions?: Permission[]): Role {
    const role = new Role();
    role.id = raw.id;
    role.name = raw.name;
    role.status = raw.status;
    role.createdAt = raw.createdAt;
    return role;
  }

  static toPersistence(role: Role): RoleEntity {
    const roleEntity = new RoleEntity();
    if (role.id && typeof role.id === 'string') {
      roleEntity.id = role.id;
    }
    roleEntity.name = role.name!;
    if (role.status) {
      roleEntity.status = role.status;
    }

    return roleEntity;
  }
}
