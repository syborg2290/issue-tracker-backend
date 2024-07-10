import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueEntity } from './entities/issue.entity';
import { IssueStatusHistoryEntity } from './entities/issue-status-history.entity';
import { IssuesRepository } from './repositories/issue.abstract.repository';
import { IssuesRelationalRepository } from './repositories/issue.repository';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity]), TypeOrmModule.forFeature([IssueStatusHistoryEntity])],
  providers: [
    {
      provide: IssuesRepository,
      useClass: IssuesRelationalRepository,
    },
  ],
  exports: [IssuesRepository],
})
export class RelationalIssuesPersistenceModule { }
