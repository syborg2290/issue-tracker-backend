import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PermissionEntity } from '../entities/permission.entity';
import { PermissionMapper } from '../mappers/permission.mapper';
import { PermissionAbstractRepository } from './abstract-permission.repository.abstract';
import {
  FilterPermissionDto,
  SortPermissionDto,
} from 'src/permission/dto/query-permission.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Permission } from 'src/permission/domain/permission';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';

@Injectable()
export class PermissionRepository implements PermissionAbstractRepository {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) { }
  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPermissionDto | null | undefined;
    sortOptions?: SortPermissionDto[] | null | undefined;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Permission>> {
    const where: FindOptionsWhere<PermissionEntity> = {};

    // Count total records
    const totalRecords = await this.permissionRepository.count({ where });
    paginationOptions.totalRecords = totalRecords

    const limit = isNaN(paginationOptions.limit) ? 0 : parseInt(paginationOptions.limit.toString());
    const page = isNaN(paginationOptions.page) ? 0 : parseInt(paginationOptions.page.toString());


    let entities;

    if (limit == 0 && page == 0) {
      entities = await this.permissionRepository.find({
        where: where,
        //relations: { user: true, orderItems: true, timelines: true },
        order: sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy]: sort.order,
          }),
          {},
        ),
      });
    } else {
      entities = await this.permissionRepository.find({
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        take: paginationOptions.limit,
        where: where,
        //relations: { user: true, orderItems: true, timelines: true },
        order: sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy]: sort.order,
          }),
          {},
        ),
      });
    }

    const records = entities.map((permission) => PermissionMapper.toDomain(permission));

    return {
      data: records,
      currentPage: paginationOptions.page,
      totalRecords: totalRecords,
      hasNextPage: records.length === paginationOptions.limit,
    };
  }

  async findOne(
    options: EntityCondition<Permission>,
  ): Promise<NullableType<Permission>> {
    const entity = await this.permissionRepository.findOne({
      where: options as FindOptionsWhere<PermissionEntity>,
    });

    return entity ? PermissionMapper.toDomain(entity) : null;
  }

  async create(data: Permission): Promise<Permission> {
    const persistenceModel = PermissionMapper.toPersistence(data);
    return this.permissionRepository.save(
      this.permissionRepository.create(persistenceModel),
    );
  }
}
