import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { AbstractRoleRepository } from './infrastructure/repositories/role.abstact-repository';
import { Role } from './domain/role';
import { NullableType } from '../utils/types/nullable.type';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { FilterRoleDto, SortRoleDto } from './dto/query-role.dto';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { UpdateRoleDto } from './dto/update-role.dto';
import { StatusEnum } from '../statuses/statuses.enum';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { UsersService } from 'src/users/users.service';
import { CustomException } from 'src/utils/common-exception';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: AbstractRoleRepository,
    @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService,
  ) { }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    if (createRoleDto.name) {
      const isExist = await this.roleRepository.findOneWithName({
        name: createRoleDto.name,
      });
      if (isExist) {
        throw new CustomException(
          'Role name is already exist',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    // Create a new role with given name and permissions
    const role = {
      status: StatusEnum.active,
      ...createRoleDto,
    };
    return await this.roleRepository.create(role);
  }

  async findOne(fields: EntityCondition<Role>): Promise<NullableType<Role>> {
    const role = await this.roleRepository.findOne(fields);
    if (!role) {
      throw new CustomException('role does not exist', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  async findOneWithSuperAdmin(fields: EntityCondition<Role>): Promise<NullableType<Role>> {
    const role = await this.roleRepository.findOneWithSuperAdmin(fields);
    if (!role) {
      throw new CustomException('role does not exist', HttpStatus.NOT_FOUND);
    }
    return role;
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterRoleDto | null;
    sortOptions?: SortRoleDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Role>> {
    return this.roleRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async update(id: number, updateCategoryDto: UpdateRoleDto): Promise<Role> {
    return this.roleRepository.update(id, updateCategoryDto);
  }

  async delete(id: number): Promise<boolean> {
    if (
      id.toString() === '1' ||
      id.toString() === '2' ||
      id.toString() === '3'
    ) {
      throw new CustomException(
        'Sorry, the role cannot be deleted at this time',
        HttpStatus.CONFLICT,
      );
    }

    const rolesRecord = await this.userService.findManyWithPagination({
      filterOptions: { role: id.toString() },
      paginationOptions: { limit: 100, page: 1 },
    });
    if (rolesRecord.data.length) {
      throw new CustomException(
        'users are assigned to this role',
        HttpStatus.CONFLICT,
      );
    }
    return this.roleRepository.delete(id);
  }
}
