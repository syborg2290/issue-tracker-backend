import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { Permission } from './domain/permission';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { PermissionAbstractRepository } from './infrastructure/repositories/abstract-permission.repository.abstract';
import { FilterPermissionDto, SortPermissionDto } from './dto/query-permission.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';

@Injectable()
export class PermissionService {
  constructor(
    private redisService: RedisService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private readonly permissionRepository: PermissionAbstractRepository,
  ) { }

  async checkPermission(userId: string, permission: string): Promise<boolean> {
    const cacheKey = `user_permissions:${userId}`;

    let permissions: any = await this.redisService.get(cacheKey);

    if (!permissions) {
      const user = await this.userService.findOne({ id: userId }, [
        'roles',
        'permissions',
      ]);

      // permissions = [
      //     user?.role!.!.map(p => p.name),
      //     user?.permissons!.map(p => p.name),
      // ];

      await this.redisService.setex(
        cacheKey,
        3600,
        JSON.stringify(permissions),
      );
    } else {
      permissions = JSON.parse(permissions);
    }

    return permissions.includes(permission);
  }


  async findOnePermission(
    condition: EntityCondition<Permission>,
  ): Promise<Permission | null> {
    // Call the repository's findOne method
    return this.permissionRepository.findOne(condition);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPermissionDto | null;
    sortOptions?: SortPermissionDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Permission>> {
    return this.permissionRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }
}
