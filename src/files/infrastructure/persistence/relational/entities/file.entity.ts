import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterLoad,
  AfterInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import appConfig from '../../../../../config/app.config';
import { AppConfig } from '../../../../../config/app-config.type';
import { FileTypeEnum } from '../../../../../files/dto/file-status.enum';


@Entity({ name: 'file' })
export class FileEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path?: string;

  @Column({ default: FileTypeEnum.IMAGE })
  type: FileTypeEnum;

  @Column({ type: String, nullable: true })
  slug: string;

  @Column({ type: String, nullable: true })
  url: string;

  @Column({ type: String, nullable: true })
  title: string;

  @Column({ type: String, nullable: true })
  extension: string;

  @Column({ type: String, nullable: true })
  altTitle: string;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path?.indexOf('/') === 0) {
      this.path = (appConfig() as AppConfig).backendDomain + this.path;
    }
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
