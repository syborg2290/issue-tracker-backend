import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../entities/role.entity';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { Role } from 'src/roles/domain/role';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { RoleMapper } from '../mappers/role.mapper';
import { AbstractRoleRepository } from './role.abstact-repository';
import { FilterRoleDto, SortRoleDto } from 'src/roles/dto/query-role.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { CustomException } from 'src/utils/common-exception';

@Injectable()
export class RoleRepository implements AbstractRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) { }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions: FilterRoleDto | null | undefined;
    sortOptions: SortRoleDto[] | null | undefined;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Role>> {
    const where: FindOptionsWhere<RoleEntity> = {
      name: Not(ILike('SuperAdmin')), // Exclude SuperAdmin role
    };

    // if (filterOptions?.name?.length) {
    //   where.name = ILike(`%${filterOptions.name}%`);
    // }
    if (filterOptions?.status) {
      where.status = filterOptions.status;
    }

    // Ensure the SuperAdmin exclusion is maintained when other filters are applied
    if (filterOptions?.name) {
      where.name = ILike(`%${filterOptions.name}%`) && Not(ILike('SuperAdmin'));
    }

    const totalRecords = await this.roleRepository.count({ where });

    paginationOptions.totalRecords = totalRecords;
    const entities = await this.roleRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: ['rolePermission.permission'],
      //relations: { user: true, orderItems: true, timelines: true },
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });
    const records = entities.map((role) => RoleMapper.toDomain(role));

    return {
      data: records,
      currentPage: paginationOptions.page,
      totalRecords: totalRecords,
      hasNextPage: records.length === paginationOptions.limit,
    };
  }

  async findOne(fields: EntityCondition<Role>): Promise<any> {
    const entity = await this.roleRepository.findOne({
      where: { ...fields as FindOptionsWhere<RoleEntity>, name: Not(ILike('SuperAdmin')) },
      relations: ['rolePermission.permission'],
    });

    return entity;

    // return entity?.rolePermission;
    //return entity ? RoleMapper.toDomain(entity) : null;
  }

  async findOneWithName(fields: EntityCondition<Role>): Promise<any> {
    try {
      const entity = await this.roleRepository.findOne({
        where: fields as FindOptionsWhere<RoleEntity>,
        relations: ['rolePermission.permission'],
      });

      // Optionally process the entity before returning
      // e.g., return entity ? RoleMapper.toDomain(entity) : null;

      return entity || null;
    } catch (error) {
      // Handle or rethrow error
      console.error('Error finding entity:', error);
      throw error;
    }
  }


  async findOneWithSuperAdmin(fields: EntityCondition<Role>): Promise<any> {
    const entity = await this.roleRepository.findOne({
      where: fields as FindOptionsWhere<RoleEntity>,
      relations: ['rolePermission.permission'],
    });

    return entity;

    // return entity?.rolePermission;
    //return entity ? RoleMapper.toDomain(entity) : null;
  }

  async create(data: Role): Promise<Role> {
    const persistenceModel = RoleMapper.toPersistence(data);
    const newEntity = await this.roleRepository.save(
      this.roleRepository.create(persistenceModel),
    );

    return RoleMapper.toDomain(newEntity);
  }

  async update(id: number, updateData: Role): Promise<Role> {
    const entity = await this.roleRepository.findOne({ where: { id } });
    if (!entity) {
      throw new CustomException(`Category not found`, HttpStatus.NOT_FOUND);
    }

    const updatedEntity = await this.roleRepository.save({
      ...entity,
      ...RoleMapper.toPersistence(updateData),
    });

    return RoleMapper.toDomain(updatedEntity);
  }
  async delete(id: number): Promise<boolean> {
    const deleteResult = await this.roleRepository.softDelete(id);
    return deleteResult.affected! > 0;
  }
}
