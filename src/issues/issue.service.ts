import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { Issue } from 'src/issues/domain/issue';
import { IssuePriority } from 'src/issues/dto/issue-priority.enum';
import { IssueSeverity } from 'src/issues/dto/issue-severity.enum';
import { IssueStatus } from 'src/issues/dto/issue-status.enum';
import { FilterIssuesDto, SortIssuesDto } from 'src/issues/dto/query-issues.dto';
import { IssuesRepository } from './infrastructure/repositories/issue.abstract.repository';
import { CustomException } from 'src/utils/common-exception';

@Injectable()
export class IssuesService {
    constructor(private readonly issuesRepository: IssuesRepository) { }

    async create(createIssueDto: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Issue | any> {
        try {

            const issue = await this.issuesRepository.create(createIssueDto);
            return issue;

        } catch (error) {
            throw new CustomException('Failed to create issue', HttpStatus.BAD_REQUEST);
        }
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterIssuesDto | null;
        sortOptions?: SortIssuesDto[] | null;
        paginationOptions?: IPaginationOptions;
    }): Promise<InfinityPaginationResultType<Issue>> {
        try {
            return await this.issuesRepository.findManyWithPagination({
                filterOptions,
                sortOptions,
                paginationOptions,
            });

        } catch (error) {
            throw new CustomException('Failed to fetch issues', HttpStatus.BAD_REQUEST);
        }
    }

    async findOne(fields: EntityCondition<Issue>): Promise<NullableType<Issue>> {
        try {
            return await this.issuesRepository.findOne(fields);

        } catch (error) {
            throw new CustomException('Failed to find issue', HttpStatus.BAD_REQUEST);
        }
    }

    async update(id: string, updateData: Partial<Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Issue> {
        try {
            const existingIssue = await this.issuesRepository.findOne({ id });
            if (!existingIssue) {
                throw new CustomException('Issue not found', HttpStatus.NOT_FOUND);
            }

            const updatedIssue = await this.issuesRepository.update(id, updateData);
            return updatedIssue;

        } catch (error) {
            throw new CustomException('Failed to update issue', HttpStatus.BAD_REQUEST);
        }
    }

    async updateIssueStatus(issueId: string, newStatus: IssueStatus): Promise<Issue> {
        try {
            const existingIssue = await this.issuesRepository.findOne({ id: issueId });
            if (!existingIssue) {
                throw new CustomException('Issue not found', HttpStatus.NOT_FOUND);
            }

            const updatedIssue = await this.issuesRepository.updateIssueStatus(issueId, newStatus);
            return updatedIssue;

        } catch (error) {
            throw new CustomException('Failed to update issue status', HttpStatus.BAD_REQUEST);
        }
    }

    async updateIssueSeverity(issueId: string, newSeverity: IssueSeverity): Promise<Issue> {
        try {
            const existingIssue = await this.issuesRepository.findOne({ id: issueId });
            if (!existingIssue) {
                throw new CustomException('Issue not found', HttpStatus.NOT_FOUND);
            }

            const updatedIssue = await this.issuesRepository.updateIssueSeverity(issueId, newSeverity);
            return updatedIssue;

        } catch (error) {
            throw new CustomException('Failed to update issue severity', HttpStatus.BAD_REQUEST);
        }
    }

    async updateIssuePriority(issueId: string, newPriority: IssuePriority): Promise<Issue> {
        try {
            const existingIssue = await this.issuesRepository.findOne({ id: issueId });
            if (!existingIssue) {
                throw new CustomException('Issue not found', HttpStatus.NOT_FOUND);
            }

            const updatedIssue = await this.issuesRepository.updateIssuePriority(issueId, newPriority);
            return updatedIssue;

        } catch (error) {
            throw new CustomException('Failed to update issue priority', HttpStatus.BAD_REQUEST);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.issuesRepository.delete(id);
            return result;

        } catch (error) {
            throw new CustomException('Failed to delete issue', HttpStatus.BAD_REQUEST);
        }
    }
}
