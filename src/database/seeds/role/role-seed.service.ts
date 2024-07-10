import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../../../roles/infrastructure/entities/role.entity';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
  ) { }

  async run() {
    const countSuperAdmin = await this.repository.count({
      where: {
        id: 1,
      },
    });

    if (!countSuperAdmin) {
      await this.repository.save(
        this.repository.create({
          id: 1,
          name: 'SuperAdmin',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: 2,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: 2,
          name: 'Admin',
        }),
      );
    }

    const countUser = await this.repository.count({
      where: {
        id: 3,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          id: 3,
          name: 'User',
        }),
      );
    }
  }
}
