import { PermissionEntity } from '../entities/permission.entity';
import { Permission } from '../../domain/permission';

export class PermissionMapper {
  static toDomain(raw: PermissionEntity): Permission {
    const permission = new Permission();

    permission.name = raw.name;
    permission.id = raw.id;
    permission.createdAt = raw.createdAt;
    return permission;
  }

  static toPersistence(permission: Permission): PermissionEntity {
    const permissionEntity = new PermissionEntity();
    permissionEntity.id = permission.id;
    permissionEntity.name = permission.name!;
    return permissionEntity;
  }
}
