import { Exclude, Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';
import { Role } from '../../roles/domain/role';
import { Permission } from '../../permission/domain/permission';
import { StatusEnum } from 'src/statuses/statuses.enum';

export class User {
  @Expose()
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  provider: string;

  socialId?: string | null;

  id: string;
  firstName: string;
  lastName: string;
  address?: string | null;
  photo?: FileType | null;
  role?: Role | null;
  permissons?: Permission[] | null;
  rolePermissions?: string[];
  status: StatusEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
