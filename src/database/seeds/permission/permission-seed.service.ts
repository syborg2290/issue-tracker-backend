import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEnum } from 'src/permission/enum/permission.enum';
import { PermissionEntity } from 'src/permission/infrastructure/entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionSeedService {
  constructor(
    @InjectRepository(PermissionEntity)
    private repository: Repository<PermissionEntity>,
  ) {}

  async run() {
  
    const permissionsArray: string[] = Object.values(PermissionEnum);
  
    for (const permission of permissionsArray) {
      const isExist = await this.isExist(permission);

      if (!isExist) {
        await this.repository.save(
          this.repository.create({
            name: permission,
          }),
        );
      }
    }
  }

  async isExist(permission: string): Promise<number> {
    const countPermission = await this.repository.count({
      where: {
        name: permission,
      },
    });
    return countPermission;
  }
}
