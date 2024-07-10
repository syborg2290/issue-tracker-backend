import { User } from 'src/users/domain/user';
import { IssuePriority } from '../dto/issue-priority.enum';
import { IssueSeverity } from '../dto/issue-severity.enum';
import { IssueStatus } from '../dto/issue-status.enum';

export class Issue {
    id: string;
    title: string;
    description: string;
    status: IssueStatus;
    severity: IssueSeverity;
    priority: IssuePriority;
    createdBy: User;
    assignedTo: User;
    createdAt: Date;
    updatedAt: Date;
}
