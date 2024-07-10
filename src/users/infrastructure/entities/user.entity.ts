import { Exclude, Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { AuthProvidersEnum } from '../../../auth/auth-providers.enum';
import { EntityRelationalHelper } from '../../../utils/relational-entity-helper';
import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { RoleEntity } from 'src/roles/infrastructure/entities/role.entity';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { FileEntity } from 'src/files/infrastructure/persistence/relational/entities/file.entity';


@Entity({
  name: 'user',
})
@Unique(['email'])
export class UserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  @Expose()
  @IsEmail()
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword?: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @Column({ default: AuthProvidersEnum.email })
  @Expose()
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @Index()
  @Column({ type: String, nullable: false })
  firstName: string;

  @Index()
  @Column({ type: String, nullable: false })
  lastName: string;

  @Column({ type: String, nullable: true })
  address: string | null;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @ManyToOne(() => RoleEntity, (role) => role.user)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @Column({ default: 1, })
  status: StatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}