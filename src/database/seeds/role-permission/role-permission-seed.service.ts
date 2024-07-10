import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/permission/infrastructure/entities/permission.entity';
import { RolePermissionEntity } from 'src/role-permission/infrastructure/entities/role-permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolePermissionSeedService {
  constructor(
    @InjectRepository(RolePermissionEntity)
    private repository: Repository<RolePermissionEntity>,
    @InjectRepository(PermissionEntity)
    private permissionsRepository: Repository<PermissionEntity>,
  ) {}

  async run() {
    const permissionsArray = await this.permissionsRepository.find();

    for (const permission of permissionsArray) {
      await this.repository.save(
        this.repository.create({
          role: {
            id: 1,
          },
          permission: permission,
        }),
      );
    }
  }
}
