import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RolePermission } from './domain/role-permission';
import { InputRolePermissionDto } from './dto/input-role-permission.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { PermissionDecorator } from 'src/permission/permissions.decorator';
import { PermissionEnum } from 'src/permission/enum/permission.enum';
import { PermissionsGuard } from 'src/permission/permissions.guard';
import { AuthGuard } from '@nestjs/passport';
import { Prefixes } from 'src/utils/prefixes';
@ApiBearerAuth()
@ApiTags('role-permission')
@Controller()
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) { }

  @Post(Prefixes.admin + 'role-permission/')
  @PermissionDecorator(PermissionEnum.ASSIGN_ROLE_PERMISSION)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createRolePermissionDto: InputRolePermissionDto,
  ): Promise<RolePermission[]> {
    return this.rolePermissionService.createPermissions(
      createRolePermissionDto,
    );
  }

  @Get('role-permission/')
  @PermissionDecorator(PermissionEnum.VIEW_PERMISSION)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'pages', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'roleId', required: false })
  findAll(
    @Query('pages', { transform: (value) => (value ? Number(value) : 1) })
    pages?: number,
    @Query('limit', { transform: (value) => (value ? Number(value) : 10) })
    limits?: number,
    @Query('roleId') roleId?: number,
  ): Promise<RolePermission[]> {
    const page = pages ?? 1;
    let limit = limits ?? 10;

    if (limit > 50) {
      limit = 50;
    }
    return this.rolePermissionService.findMany({
      filterOptions: { roleId },
    });
  }

  @Get('role-permission/' + ':id')
  @PermissionDecorator(PermissionEnum.VIEW_PERMISSION)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') id: RolePermission['id'],
  ): Promise<NullableType<RolePermission>> {
    return this.rolePermissionService.findOne({ id });
  }

  @Delete(Prefixes.admin + 'role-permission/' + ':id')
  @PermissionDecorator(PermissionEnum.DELETE_PERMISSION)
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: RolePermission['id']): Promise<boolean> {
    return this.rolePermissionService.delete(id);
  }
}
