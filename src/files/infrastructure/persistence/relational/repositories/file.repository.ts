import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../entities/file.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FileRepository } from '../../file.repository';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FileMapper } from '../mappers/file.mapper';
import { FileType } from '../../../../domain/file';
import * as path from 'path';
import * as fs from 'fs'; // Node.js File System module for dealing with local files (if using local storage)
import { promisify } from 'util'; // To use promise-based fs methods
import { CustomException } from 'src/utils/common-exception';

const unlinkAsync = promisify(fs.unlink); // Convert unlink to promise for async/await usage

@Injectable()
export class FileRelationalRepository implements FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) { }
  findById(id: FileType['id']): Promise<NullableType<FileType>> {
    throw new Error('Method not implemented.');
  }

  async create(data: FileType): Promise<FileType> {
    const persistenceModel = FileMapper.toPersistence(data);
    const entity = await this.fileRepository.save(
      this.fileRepository.create(persistenceModel),
    );
    return FileMapper.toDomain(entity);
  }

  async findOne(
    fields: EntityCondition<FileType>,
  ): Promise<NullableType<FileType>> {
    const entity = await this.fileRepository.findOne({
      where: fields as FindOptionsWhere<FileEntity>,
    });

    return entity ? FileMapper.toDomain(entity) : null;
  }

  async softDeleteAndRemoveStorage(id: string): Promise<void> {
    const file = await this.fileRepository.findOne({
      where: { id }
    });

    if (!file) {
      throw new CustomException('File not found', HttpStatus.NOT_FOUND);
    }

    // Soft delete the file record
    await this.fileRepository.delete(id);

    // Delete the file from storage
    await this.deleteFileFromStorage(file.path!);
  }

  private async deleteFileFromStorage(fileUrl: string): Promise<void> {
    const filename = fileUrl.split('/').pop();
    if (!filename) {
      throw new CustomException('Filename could not be extracted from the URL', HttpStatus.NOT_FOUND);
    }

    // Correctly construct the path to the file
    // This assumes that the `files` directory is at the root of your project
    // Adjust the '../' parts as necessary based on your project structure
    const projectRoot = path.resolve(__dirname.replace('/dist', ''), '../../../../');
    const filePath = path.join(projectRoot, filename);

    try {
      await unlinkAsync(filePath);
      console.log(`File at ${filePath} was deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting file at ${filePath}:`, error);
      // Consider more specific error handling here based on the error code
      throw new CustomException('Failed to delete file from storage', HttpStatus.BAD_REQUEST);
    }
  }

}
