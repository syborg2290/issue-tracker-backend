import { Module, forwardRef } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RelationalRolePersistenceModule } from './infrastructure/relation-role.module';
import { RolePermissionModule } from 'src/role-permission/role-permission.module';
import { UsersModule } from 'src/users/users.module';


@Module({
    imports: [RelationalRolePersistenceModule, RolePermissionModule, forwardRef(() => UsersModule)],
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService, RelationalRolePersistenceModule],
})
export class RoleModule { }
