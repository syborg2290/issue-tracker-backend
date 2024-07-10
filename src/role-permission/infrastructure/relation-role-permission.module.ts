import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionEntity } from './entities/role-permission.entity';
import { RolePermissionAbstractRepository } from './repositories/abstract-role-permission.repository';
import { RolePermissionRepository } from './repositories/role-permission.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermissionEntity])],
  providers: [
    {
      provide: RolePermissionAbstractRepository,
      useClass: RolePermissionRepository,
    },
  ],
  exports: [RolePermissionAbstractRepository],
})
export class RelationalRolePermissioneModule {}
