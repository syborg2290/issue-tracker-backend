import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { InfinityPaginationResultType } from '../../../utils/types/infinity-pagination-result.type';
import { IssuesRepository } from './issue.abstract.repository';
import { IssueEntity } from '../entities/issue.entity';
import { FilterIssuesDto, SortIssuesDto } from 'src/issues/dto/query-issues.dto';
import { Issue } from 'src/issues/domain/issue';
import { IssueMapper } from '../mappers/issue.mapper';
import { CustomException } from 'src/utils/common-exception';
import { IssueStatus } from 'src/issues/dto/issue-status.enum';
import { IssueSeverity } from 'src/issues/dto/issue-severity.enum';
import { IssuePriority } from 'src/issues/dto/issue-priority.enum';

@Injectable()
export class IssuesRelationalRepository implements IssuesRepository {
  constructor(
    @InjectRepository(IssueEntity)
    private readonly issueRepository: Repository<IssueEntity>,
  ) { }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterIssuesDto | null | undefined;
    sortOptions?: SortIssuesDto[] | null | undefined;
    paginationOptions: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Issue>> {
    const where: FindOptionsWhere<IssueEntity> = {};

    if (filterOptions?.title) {
      where["title"] = ILike(`%${filterOptions.title}%`);
    }

    if (filterOptions?.status) {
      where["status"] = filterOptions.status as any;
    }

    if (filterOptions?.severity) {
      where["severity"] = filterOptions.severity as any;
    }

    if (filterOptions?.priority) {
      where["priority"] = filterOptions.priority as any;
    }

    if (filterOptions?.start && filterOptions.end) {
      where.createdAt = Between(
        new Date(filterOptions.start),
        new Date(filterOptions.end),
      );
    } else if (filterOptions?.start) {
      where.createdAt = MoreThanOrEqual(new Date(filterOptions.start));
    } else if (filterOptions?.end) {
      where.createdAt = LessThanOrEqual(new Date(filterOptions.end));
    }

    const totalRecords = await this.issueRepository.count({ where });
    paginationOptions.totalRecords = totalRecords;
    const entities = await this.issueRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: {
        assignedTo: true,
        createdBy: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const records = entities.map((issue) => IssueMapper.toDomain(issue));

    return {
      data: records,
      currentPage: paginationOptions.page,
      totalRecords: totalRecords,
      hasNextPage: records.length === paginationOptions.limit,
    };
  }

  async findOne(
    fields: EntityCondition<Issue>,
  ): Promise<NullableType<Issue>> {
    const entity = await this.issueRepository.findOne({
      where: fields as FindOptionsWhere<IssueEntity>,
      relations: {
        assignedTo: true,
        createdBy: true,
      },
    });
    return entity ? IssueMapper.toDomain(entity) : null;
  }

  async create(data: Issue): Promise<Issue> {
    const persistenceModel = IssueMapper.toPersistence(data);
    const newEntity = await this.issueRepository.save(
      this.issueRepository.create(persistenceModel),
    );

    return IssueMapper.toDomain(newEntity);
  }

  async update(id: string, updateData: Issue): Promise<Issue | any> {
    const entity = await this.issueRepository.findOne({ where: { id } });
    if (!entity) {
      throw new CustomException(`Issue not found`, HttpStatus.NOT_FOUND);
    }

    const updatedEntity = await this.issueRepository.save({
      ...entity,
      ...IssueMapper.toPersistence(updateData),
    });

    return await this.findOne({ id: updatedEntity.id });
  }

  async updateIssueStatus(issueId: string, newStatus: IssueStatus): Promise<Issue | any> {
    const issue = await this.issueRepository.findOne({
      where: { id: issueId },
    });

    if (!issue) {
      throw new CustomException('Issue not found', HttpStatus.NOT_FOUND);
    }

    issue.status = newStatus as IssueStatus;
    await this.issueRepository.save(issue);

    return this.findOne({ id: issueId });
  }

  async updateIssueSeverity(issueId: string, newSeverity: IssueSeverity): Promise<Issue | any> {
    const issue = await this.issueRepository.findOne({
      where: { id: issueId },
    });

    if (!issue) {
      throw new CustomException('Issue not found', HttpStatus.NOT_FOUND);
    }

    issue.severity = newSeverity as IssueSeverity;
    await this.issueRepository.save(issue);

    return this.findOne({ id: issueId });
  }

  async updateIssuePriority(issueId: string, newPriority: IssuePriority): Promise<Issue | any> {
    const issue = await this.issueRepository.findOne({
      where: { id: issueId },
    });

    if (!issue) {
      throw new CustomException('Issue not found', HttpStatus.NOT_FOUND);
    }

    issue.priority = newPriority as IssuePriority;
    await this.issueRepository.save(issue);

    return this.findOne({ id: issueId });
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.issueRepository.softDelete(id);
    return deleteResult.affected! > 0;
  }
}
