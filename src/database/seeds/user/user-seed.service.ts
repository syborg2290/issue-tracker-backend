import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { StatusEnum } from '../../../statuses/statuses.enum';
import { UserEntity } from 'src/users/infrastructure/entities/user.entity';


@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) { }

  async run() {
    const countSuperAdmin = await this.repository.count({
      where: {
        role: {
          id: 1,
        },
      },
    });

    if (!countSuperAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'super',
          lastName: 'Admin',
          email: 'admin@example.com',
          password,
          role: {
            id: 1,
            name: 'SuperAdmin',
          },
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: 2,
        },
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'General',
          lastName: 'Admin',
          email: 'admin2@example.com',
          password,
          role: {
            id: 2,
            name: 'Admin',
          },
        }),
      );
    }

    const countUser = await this.repository.count({
      where: {
        role: {
          id: 3,
        },
      },
    });

    if (!countUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password,
          role: {
            id: 3,
            name: 'User',
          },
        }),
      );
    }
  }
}
