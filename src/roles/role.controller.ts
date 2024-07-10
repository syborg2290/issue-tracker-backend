import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './domain/role';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { NullableType } from '../utils/types/nullable.type';
import { ApiTags, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';
import { StatusEnum } from '../statuses/statuses.enum';
import { PermissionDecorator } from 'src/permission/permissions.decorator';
import { PermissionsGuard } from 'src/permission/permissions.guard';
import { AuthGuard } from '@nestjs/passport';
import { PermissionEnum } from 'src/permission/enum/permission.enum';

@ApiTags('role')
@Controller({ path: 'roles', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @PermissionDecorator(PermissionEnum.CREATE_ROLE)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @ApiBearerAuth()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get('get-all-role')
  @PermissionDecorator(PermissionEnum.VIEW_ROLE)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'pages', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limit', { transform: (value) => (value ? Number(value) : 10000) })
    limits?: number,
    @Query('name') name?: string,
    @Query('status') status?: StatusEnum,
  ): Promise<InfinityPaginationResultType<Role>> {

    const page = pages ?? 1;
    let limit = limits ?? 10000;

    if (limit > 50) {
      limit = 50;
    }

    const paginationResult = await this.roleService.findManyWithPagination({
      filterOptions: { name, status },
      sortOptions: [],
      paginationOptions: {
        page,
        limit,
      },
    });

    const { totalRecords } = paginationResult;

    return {
      ...paginationResult,
      totalRecords,
    };
  }

  @Get(':id')
  @PermissionDecorator(PermissionEnum.VIEW_ROLE)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Role['id']): Promise<NullableType<Role>> {
    return this.roleService.findOne({ id });
  }

  @Patch(':id')
  @PermissionDecorator(PermissionEnum.UPDATE_ROLE)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Role['id'],
    @Body() roleDto: UpdateRoleDto,
  ): Promise<NullableType<Role>> {
    return this.roleService.update(id, roleDto);
  }

  @Delete(':id')
  @PermissionDecorator(PermissionEnum.DELETE_ROLE)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', required: true })
  delete(@Param('id') id: Role['id']): Promise<boolean> {
    return this.roleService.delete(id);
  }
}
