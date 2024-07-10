import { Module } from '@nestjs/common';
import { RelationalIssuesPersistenceModule } from './infrastructure/relational-issue.module';
import { RolePermissionModule } from 'src/role-permission/role-permission.module';
import { RoleModule } from 'src/roles/role.module';
import { UsersModule } from 'src/users/users.module';
import { IssuesController } from './issue.controller';
import { IssuesService } from './issue.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        RelationalIssuesPersistenceModule,
        RolePermissionModule,
        RoleModule,
        UsersModule,
    ],
    controllers: [IssuesController],
    providers: [IssuesService, ConfigModule, ConfigService],
    exports: [IssuesService, RelationalIssuesPersistenceModule],
})
export class IssuesModule { }
