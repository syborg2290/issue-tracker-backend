import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpStatus,
    HttpCode,
    UseGuards,
} from '@nestjs/common';
import {
    ApiParam,
    ApiTags,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { NullableType } from '../utils/types/nullable.type';
import { Issue } from './domain/issue';
import { PermissionDecorator } from 'src/permission/permissions.decorator';
import { PermissionEnum } from 'src/permission/enum/permission.enum';
import { PermissionsGuard } from 'src/permission/permissions.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueStatus } from './dto/issue-status.enum';
import { IssuePriority } from './dto/issue-priority.enum';
import { IssueSeverity } from './dto/issue-severity.enum';
import { IssuesService } from './issue.service';
import { UsersService } from 'src/users/users.service';
import { CustomException } from 'src/utils/common-exception';

@ApiTags('issues')
@Controller({ path: 'issues', version: '1' })
export class IssuesController {
    constructor(private readonly issuesService: IssuesService, private readonly userService: UsersService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @PermissionDecorator(PermissionEnum.CREATE_ISSUE)
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @ApiBearerAuth()
    async create(@Body() createIssueDto: CreateIssueDto): Promise<Issue> {
        const createdBy = await this.userService.findOne({ id: createIssueDto.createdBy });
        if (!createdBy) {
            throw new CustomException('Failed to create issue', HttpStatus.BAD_REQUEST);
        }
        const assignedTo = await this.userService.findOne({ id: createIssueDto.assignedTo });
        if (!assignedTo) {
            throw new CustomException('Failed to create issue', HttpStatus.BAD_REQUEST);
        }

        const createIssue = {
            ...createIssueDto,
            createdBy,
            assignedTo,

        }
        return this.issuesService.create(createIssue);
    }

    @Get()
    @PermissionDecorator(PermissionEnum.VIEW_ISSUE)
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: 'pages', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'title', required: false })
    @ApiQuery({ name: 'status', required: false, enum: IssueStatus })
    @ApiQuery({ name: 'priority', required: false, enum: IssuePriority })
    @ApiQuery({ name: 'severity', required: false, enum: IssueSeverity })
    async findAll(
        @Query('pages', { transform: (value) => (value ? Number(value) : 1) }) pages?: number,
        @Query('limit', { transform: (value) => (value ? Math.min(Number(value), 50) : 10) }) limits?: number,
        @Query('title') title?: string,
        @Query('status') status?: string,
        @Query('priority') priority?: string,
        @Query('severity') severity?: string,
    ): Promise<InfinityPaginationResultType<Issue>> {
        const filterOptions: any = { title };

        if (status && Object.values(IssueStatus).includes(status as IssueStatus)) {
            filterOptions.status = status as IssueStatus;
        }

        if (priority && Object.values(IssuePriority).includes(priority as IssuePriority)) {
            filterOptions.priority = priority as IssuePriority;
        }

        if (severity && Object.values(IssueSeverity).includes(severity as IssueSeverity)) {
            filterOptions.severity = severity as IssueSeverity;
        }

        const paginationResult = await this.issuesService.findManyWithPagination({
            filterOptions,
            sortOptions: [],
            paginationOptions: {
                page: pages || 1,
                limit: limits || 10,
            },
        });
        const { totalRecords } = paginationResult;

        return {
            ...paginationResult,
            totalRecords,
        };
    }

    @Get(':id')
    @PermissionDecorator(PermissionEnum.VIEW_ISSUE)
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    async findOne(@Param('id') id: string): Promise<NullableType<Issue>> {
        return this.issuesService.findOne({ id });
    }

    @Patch(':id')
    @PermissionDecorator(PermissionEnum.UPDATE_ISSUE)
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    async update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto): Promise<Issue | null> {
        const createdBy = await this.userService.findOne({ id: updateIssueDto.createdBy });
        if (!createdBy) {
            throw new CustomException('Failed to create issue', HttpStatus.BAD_REQUEST);
        }
        const assignedTo = await this.userService.findOne({ id: updateIssueDto.assignedTo });
        if (!assignedTo) {
            throw new CustomException('Failed to create issue', HttpStatus.BAD_REQUEST);
        }

        const updateIssue = {
            ...updateIssueDto,
            createdBy,
            assignedTo,

        }

        return this.issuesService.update(id, updateIssue);
    }

    @Delete(':id')
    @PermissionDecorator(PermissionEnum.DELETE_ISSUE)
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
        await this.issuesService.delete(id);
    }

    @Patch('set-status/:id')
    @PermissionDecorator(PermissionEnum.UPDATE_ISSUE_STATUS)
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    async setStatus(@Param('id') id: string, @Query('status') status: IssueStatus): Promise<Issue | null> {
        return this.issuesService.updateIssueStatus(id, status);
    }

    @Patch('set-priority/:id')
    @PermissionDecorator(PermissionEnum.UPDATE_ISSUE_PRIORITY)
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    async setPriority(@Param('id') id: string, @Query('priority') priority: IssuePriority): Promise<Issue | null> {
        return this.issuesService.updateIssuePriority(id, priority);
    }

    @Patch('set-severity/:id')
    @PermissionDecorator(PermissionEnum.UPDATE_ISSUE_SEVERITY)
    @UseGuards(AuthGuard('jwt'), PermissionsGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiParam({
        name: 'id',
        type: String,
        required: true,
    })
    async setSeverity(@Param('id') id: string, @Query('severity') severity: IssueSeverity): Promise<Issue | null> {
        return this.issuesService.updateIssueSeverity(id, severity);
    }
}
