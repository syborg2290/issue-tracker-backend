import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { RolePermission } from './domain/role-permission';
import { InputRolePermissionDto } from './dto/input-role-permission.dto';
import { FilterRolePermissionDto } from './dto/query-role-permission.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { RolePermissionAbstractRepository } from './infrastructure/repositories/abstract-role-permission.repository';
import { PermissionService } from 'src/permission/permission.service';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { CustomException } from 'src/utils/common-exception';

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly rolePermissionRepository: RolePermissionAbstractRepository,
    @Inject(forwardRef(() => PermissionService))
    private readonly permissionService: PermissionService,
  ) { }

  async create(
    createPermissionDto: CreateRolePermissionDto,
  ): Promise<RolePermission> {
    const rolePermission = {
      ...createPermissionDto,
    };
    return await this.rolePermissionRepository.create(rolePermission);
  }

  async createPermissions(inputDto: InputRolePermissionDto) {
    const permissionArray: RolePermission[] = [];

    await this.rolePermissionRepository.deletePermissionsByRole(
      inputDto.role.id,
    );
    for (const permission of inputDto.permission) {
      const permissionsRes = await this.permissionService.findOnePermission({ id: permission });
      if (!permissionsRes) {
        throw new CustomException(
          'Permission does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      const creteDto = {
        role: inputDto.role,
        permission: permission,
        status: StatusEnum.active,
      };
      const rolePermission = await this.create(creteDto);
      permissionArray.push({ id: rolePermission.id, permission: permissionsRes });
    }
    return permissionArray;
  }

  findMany({
    filterOptions,
  }: {
    filterOptions?: FilterRolePermissionDto | null;
  }): Promise<RolePermission[]> {
    return this.rolePermissionRepository.findManyWithPagination({
      filterOptions,
    });
  }

  findOne(
    fields: EntityCondition<RolePermission>,
  ): Promise<NullableType<RolePermission>> {
    return this.rolePermissionRepository.findOne(fields);
  }

  delete(id: RolePermission['id']): Promise<boolean> {
    return this.rolePermissionRepository.delete(id);
  }
}
