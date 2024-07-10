import { Module, forwardRef } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';
import { RelationalRolePermissioneModule } from './infrastructure/relation-role-permission.module';
import { RoleModule } from 'src/roles/role.module';
import { UsersModule } from 'src/users/users.module';
import { PermissionModule } from 'src/permission/permission.module';
import { RedisService } from 'src/redis/redis.service';


@Module({
  imports: [RelationalRolePermissioneModule,
    forwardRef(() => RoleModule),
    forwardRef(() => UsersModule),
    forwardRef(() => PermissionModule),
  ],
  controllers: [RolePermissionController],
  providers: [RolePermissionService, RedisService,],
  exports: [RolePermissionService, RelationalRolePermissioneModule],
})
export class RolePermissionModule { }
