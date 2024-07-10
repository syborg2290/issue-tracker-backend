import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { IssueEntity } from './issue.entity';

@Entity({ name: 'issue_status_history' })
export class IssueStatusHistoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => IssueEntity, (issue) => issue.statusHistory)
    @JoinColumn({ name: 'issueId' })
    issue: IssueEntity;
}
