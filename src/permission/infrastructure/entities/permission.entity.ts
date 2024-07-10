import { Permission } from 'src/permission/domain/permission';
import { RolePermissionEntity } from 'src/role-permission/infrastructure/entities/role-permission.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'permission' })
export class PermissionEntity extends EntityRelationalHelper implements Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => RolePermissionEntity, rolePermission => rolePermission.permission)
  rolePermission: RolePermissionEntity;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
