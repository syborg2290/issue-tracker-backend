import { Issue } from "src/issues/domain/issue";
import { IssueEntity } from "../entities/issue.entity";
import { UserEntity } from "src/users/infrastructure/entities/user.entity";
import { User } from "src/users/domain/user";

export class IssueMapper {
  static toDomain(entity: IssueEntity): Issue {
    const issue = new Issue();

    issue.id = entity.id;
    issue.title = entity.title;
    issue.description = entity.description;
    issue.status = entity.status;
    issue.severity = entity.severity;
    issue.priority = entity.priority;
    issue.createdBy = UserMapper.toDomain(entity.createdBy);
    issue.assignedTo = UserMapper.toDomain(entity.assignedTo);
    issue.createdAt = entity.createdAt;
    issue.updatedAt = entity.updatedAt;

    return issue;
  }

  static toPersistence(domain: Issue): IssueEntity {
    const entity = new IssueEntity();

    entity.id = domain.id;
    entity.title = domain.title;
    entity.description = domain.description;
    entity.status = domain.status;
    entity.severity = domain.severity;
    entity.priority = domain.priority;
    entity.createdBy = UserMapper.toPersistence(domain.createdBy);
    entity.assignedTo = UserMapper.toPersistence(domain.assignedTo);
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    return entity;
  }
}

class UserMapper {
  static toDomain(entity: UserEntity): User {
    const user = new User();

    user.id = entity.id;
    user.email = entity.email;
    user.firstName = entity.firstName;
    user.lastName = entity.lastName;
    // Add other properties as needed

    return user;
  }

  static toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();

    entity.id = domain.id;
    entity.email = domain.email;
    entity.firstName = domain.firstName;
    entity.lastName = domain.lastName;
    // Add other properties as needed

    return entity;
  }
}
