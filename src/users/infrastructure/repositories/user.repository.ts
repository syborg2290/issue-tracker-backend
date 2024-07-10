import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAbstractRepository } from './user.abstract.repository';
import { DataSource, FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { User } from '../../../users/domain/user';
import { UserMapper } from '../mappers/user.mapper';
import { FilterUserDto, SortUserDto } from '../../../users/dto/query-user.dto';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { UserEntity } from '../entities/user.entity';
import { InfinityPaginationResultType } from '../../../utils/types/infinity-pagination-result.type';
import { CustomException } from 'src/utils/common-exception';

@Injectable()
export class UserRepository implements UserAbstractRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) { }

  async create(data: User): Promise<User> {

    console.debug(data);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const persistenceModel = UserMapper.toPersistence(data);
      const newEntity = await this.usersRepository.save(
        this.usersRepository.create(persistenceModel),
      );

      // Commit transaction
      await queryRunner.commitTransaction();

      return UserMapper.toDomain(newEntity);
    } catch (error) {
      console.debug(error);
      // Rollback in case of an error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<User>> {
    const where: FindOptionsWhere<UserEntity> = {};
    console.debug('paginationOptions : ', paginationOptions);

    // where['status'] = Not(2)

    // Exclude super admin users from the results
    where['role.id'] = Not(1);

    if (filterOptions?.userType === 'user') {
      where['role.id'] = Not(3);
    }

    if (filterOptions?.userType === 'user') {
      where['role.id'] = 3;
    }
    if (filterOptions?.name?.length) {
      where.firstName = ILike(`%${filterOptions.name}%`);
    }

    if (filterOptions?.email?.length) {
      where.email = ILike(`%${filterOptions.email}%`);
    }

    if (filterOptions?.role?.length) {
      where['role.id'] = filterOptions.role;
    }

    if (filterOptions?.status) {
      where['status.id'] = filterOptions.status;
    }

    const totalRecords = await this.usersRepository.count({ where });
    paginationOptions.totalRecords = totalRecords;
    const entities = await this.usersRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: { photo: true, role: true },
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    const records = entities.map((user) => UserMapper.toDomain(user));
    return {
      data: records,
      currentPage: paginationOptions.page,
      totalRecords: totalRecords,
      hasNextPage: records.length === paginationOptions.limit,
    };
  }

  async findOne(
    fields: EntityCondition<User>,
    relations?: Array<string>,
  ): Promise<NullableType<User>> {

    const entity = await this.usersRepository.findOne({
      where: fields as FindOptionsWhere<UserEntity>,
      relations: ['role'],
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: User['id'], payload: Partial<User>): Promise<User> {
    const entity = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }

    const updatedEntity = await this.usersRepository.save(
      this.usersRepository.create(
        UserMapper.toPersistence({
          ...UserMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserMapper.toDomain(updatedEntity);
  }

  async softDelete(id: User['id']): Promise<void> {
    // First, find the user by ID to check their role
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role'], // Ensure 'role' relation is loaded
    });

    // Check if the user has the super admin role
    if (user && user.role.id === 1) {
      // Optionally, log an attempt to delete a super admin or handle as needed
      console.error('Attempted to delete a super admin user:', id);
      throw new CustomException('Cannot delete super admin user.', HttpStatus.FORBIDDEN);
    }

    if (!user) {
      // User not found, handle accordingly
      throw new CustomException('User not found.', HttpStatus.NOT_FOUND);
    }

    // Proceed with soft deletion if the user does not have the super admin role
    await this.usersRepository.delete(id);
  }


  async setUserBlackList(id: string, user: User): Promise<User> {
    try {
      // First, find the user by ID to check their role
      const userEntity = await this.usersRepository.findOne({
        where: { id },
        relations: ['role'], // Ensure 'role' relation is loaded
      });

      // Check if the user has the super admin role
      if (userEntity && userEntity.role.id === 1) {
        // Optionally, log an attempt to delete a super admin or handle as needed
        console.error('Attempted to change a super admin user:', id);
        throw new CustomException('Cannot change super admin user.', HttpStatus.FORBIDDEN);
      }

      if (!userEntity) {
        // User not found, handle accordingly
        throw new CustomException('User not found.', HttpStatus.NOT_FOUND);
      }

      const updatedEntity = await this.usersRepository.save({
        ...userEntity,
        ...UserMapper.toPersistence(user),
      });

      return UserMapper.toDomain(updatedEntity);
    } catch (error) {
      throw new CustomException(`${error}`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
