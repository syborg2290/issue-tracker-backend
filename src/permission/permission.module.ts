import { Module, forwardRef } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { RelationalPermissionPersistenceModule } from './infrastructure/relational-persistence.module';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { PermissionController } from './permission.controller';
import { RoleModule } from 'src/roles/role.module';
import { RedisModule } from 'src/redis/redis.module';
import { FilesModule } from 'src/files/files.module';
import { RolePermissionModule } from 'src/role-permission/role-permission.module';

@Module({
  imports: [
    RelationalPermissionPersistenceModule,
    forwardRef(() => UsersModule),
    RoleModule,
    RedisModule,
    FilesModule,
    RolePermissionModule
  ],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    RedisService,
    UsersService
  ],
  exports: [
    PermissionService,
    RelationalPermissionPersistenceModule,
  ],
})
export class PermissionModule { }
