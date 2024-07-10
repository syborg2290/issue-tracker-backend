import { Issue } from 'src/issues/domain/issue';
import { IssuePriority } from 'src/issues/dto/issue-priority.enum';
import { IssueSeverity } from 'src/issues/dto/issue-severity.enum';
import { IssueStatus } from 'src/issues/dto/issue-status.enum';
import { FilterIssuesDto, SortIssuesDto } from 'src/issues/dto/query-issues.dto';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';

export abstract class IssuesRepository {
  abstract create(
    data: Omit<Issue, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Issue>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterIssuesDto | null;
    sortOptions?: SortIssuesDto[] | null;
    paginationOptions?: IPaginationOptions;
  }): Promise<InfinityPaginationResultType<Issue>>;


  abstract findOne(
    fields: EntityCondition<Issue>,
  ): Promise<NullableType<Issue>>;

  abstract update(
    id: string,
    updateData: Partial<Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Issue>;

  abstract updateIssueStatus(
    issueId: string, newStatus: IssueStatus,
  ): Promise<Issue>;

  abstract updateIssueSeverity(
    issueId: string, newSeverity: IssueSeverity,
  ): Promise<Issue>;

  abstract updateIssuePriority(
    issueId: string, newPriority: IssuePriority,
  ): Promise<Issue>;

  abstract delete(id: string): Promise<boolean>;
}
