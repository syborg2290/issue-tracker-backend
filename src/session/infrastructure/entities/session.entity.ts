import { UserEntity } from 'src/users/infrastructure/entities/user.entity';
import { Session } from '../../../session/domain/session';
import { EntityRelationalHelper } from '../../../utils/relational-entity-helper';
import {
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';


@Entity({
  name: 'session',
})
export class SessionEntity extends EntityRelationalHelper implements Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @Index()
  user: UserEntity;

  @Column({ nullable: true })
  hash: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
