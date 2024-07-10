import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolePermissionService } from 'src/role-permission/role-permission.service';
import { UsersService } from 'src/users/users.service';
import { CustomException } from 'src/utils/common-exception';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly rolePermissionService: RolePermissionService,
    private readonly userService: UsersService,
  ) { }

  async canActivate(context: ExecutionContext) {
    const permissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getClass(), context.getHandler()],
    );

    const request = context.switchToHttp().getRequest();
    console.log('request : ', request.user);

    const user = await this.userService.findOne({ id: request.user.id });
    if (!user) {
      throw new CustomException('user not exist', HttpStatus.NOT_FOUND);
    }

    const userPermissions = await this.rolePermissionService.findMany({
      filterOptions: { roleId: user.role?.id },
    });
    if (!userPermissions.length) {
      throw new CustomException(
        'user does not have permission to this',
        HttpStatus.UNAUTHORIZED,
      );
    }
    //console.log('userPermissions : ', userPermissions);
    const userPermissionArray: string[] = [];
    userPermissions.forEach((per) => {
      userPermissionArray.push(per.permission!.name!);
    });
    console.log('userPermissionArray : ', userPermissionArray);

    const hasPermission = await this.hasPermission(
      permissions,
      userPermissionArray,
    );
    console.log('hasPermission : ', hasPermission);

    if (hasPermission) {
      return true;
    }
    throw new CustomException(
      'user does not have permission for this task',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async hasPermission(permissions, desiredPermission) {
    return desiredPermission.some((desiredPerm) => {
      return permissions.some((permission) => permission === desiredPerm);
    });
  }
}
