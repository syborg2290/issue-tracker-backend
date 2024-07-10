import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from '../../../permission/infrastructure/entities/permission.entity';
import { RolePermissionEntity } from '../../../role-permission/infrastructure/entities/role-permission.entity';
import { RolePermissionSeedService } from './role-permission-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity, RolePermissionEntity])],
  providers: [RolePermissionSeedService],
  exports: [RolePermissionSeedService],
})
export class RolePermissionSeedModule {}
