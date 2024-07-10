import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Response,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1'
})
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File | Express.MulterS3.File,
  ) {
    return this.filesService.create(file);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('uploadMultiple')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File | Express.MulterS3.File>,
  ) {
    const responses: any = [];
    for (const file of files) {
      const response = await this.filesService.create(file); // Assuming create method can handle single file object
      responses.push(response);
    }
    return responses;
  }

  @Get(':path')
  @ApiParam({
    name: 'path',
    type: 'string',
  })
  download(@Param('path') path, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the file to delete',
    type: 'string',
  })
  async deleteFile(@Param('id') id: string) {
    return this.filesService.deleteFile(id);
  }
}
