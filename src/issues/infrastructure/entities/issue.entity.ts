import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IssueStatusHistoryEntity } from './issue-status-history.entity';
import { IssueStatus } from 'src/issues/dto/issue-status.enum';
import { IssueSeverity } from 'src/issues/dto/issue-severity.enum';
import { IssuePriority } from 'src/issues/dto/issue-priority.enum';
import { UserEntity } from 'src/users/infrastructure/entities/user.entity';


@Entity({ name: 'issues' })
export class IssueEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  status: IssueStatus;

  @Column({ nullable: false, default: IssueSeverity.LOW })
  severity: IssueSeverity;

  @Column({ nullable: false, default: IssuePriority.LOW })
  priority: IssuePriority;

  @ManyToOne(() => UserEntity, (user) => user.issuesCreatedBy, { eager: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.issuesAssignedTo, { eager: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: UserEntity;

  @OneToMany(() => IssueStatusHistoryEntity, (statusHistory) => statusHistory.issue)
  statusHistory: IssueStatusHistoryEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
