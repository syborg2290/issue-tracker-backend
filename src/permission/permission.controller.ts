import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { PermissionEntity } from './infrastructure/entities/permission.entity';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Permission } from './domain/permission';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from './permissions.guard';
import { PermissionEnum } from './enum/permission.enum';
import { PermissionDecorator } from 'src/permission/permissions.decorator';

@ApiTags('permissions')
@Controller({
  path: 'permissions',

})
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  @Get('get-all-permissions')
  @PermissionDecorator(PermissionEnum.VIEW_PERMISSION)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'pages', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 0) })
    pages?: number,
    @Query('limit', { transform: (value) => (value ? Number(value) : 0) })
    limits?: number,
  ): Promise<InfinityPaginationResultType<Permission>> {

    const page = pages ?? 0;
    let limit = limits ?? 0;

    const paginationResult = await this.permissionService.findManyWithPagination({
      filterOptions: {},
      sortOptions: [],
      paginationOptions: {
        page,
        limit,
      },
    });

    // Extract total records from pagination result
    const { totalRecords } = paginationResult;

    return {
      ...paginationResult,
      totalRecords,
    };
  }

  @Get(':id')
  @PermissionDecorator(PermissionEnum.VIEW_PERMISSION)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @ApiBearerAuth()
  findOnePermission(@Param('id') id: string) {
    const condition: EntityCondition<PermissionEntity> = { id };
    return this.permissionService.findOnePermission(condition);
  }

  // Assuming you want a route to check a user's permission
  @Get('check/:userId/:permission')
  @PermissionDecorator(PermissionEnum.VIEW_PERMISSION)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @ApiBearerAuth()
  checkUserPermission(
    @Param('userId') userId: string,
    @Param('permission') permission: string,
  ) {
    return this.permissionService.checkPermission(userId, permission);
  }

}
