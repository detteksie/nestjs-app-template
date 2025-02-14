import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ObjectId } from 'mongodb';

import { JwtAccessAuthGuard } from '|/elements/guards/jwt-access.guard';
import { ParseObjectIdPipe } from '|/elements/pipes/parse-object-id.pipe';
import { Todo } from '|/schemas/todo.schema';
import { PaginationQuery, PaginationQueryPipe } from '|/utils/pagination-query.util';
import { ApiPaginatedResponse, ApiSuccessJson } from '|/utils/response.util';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TasksService } from './tasks.service';

@ApiTags('todo-list')
@ApiBearerAuth()
@Controller({
  path: 'tasks',
  version: '1',
})
@UseGuards(JwtAccessAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiSuccessJson(Todo)
  create(@Req() req: Request, @Body() body: CreateTodoDto) {
    return this.tasksService.create(req.user, body);
  }

  @Get()
  @ApiPaginatedResponse(Todo)
  findAll(@Query(new PaginationQueryPipe()) query: PaginationQuery) {
    return this.tasksService.findAll({
      page: query.page,
      limit: query.limit,
      route: '/v1/tasks',
    });
  }

  @Get('/me')
  @ApiPaginatedResponse(Todo)
  findAllMe(@Req() req: Request, @Query(new PaginationQueryPipe()) query: PaginationQuery) {
    return this.tasksService.findAllMe(req.user, {
      page: query.page,
      limit: query.limit,
      route: '/v1/tasks',
    });
  }

  @Get('t/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiSuccessJson(Todo)
  findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.tasksService.findOne(id);
  }

  @Patch('t/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiSuccessJson(Object)
  update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() body: UpdateTodoDto) {
    return this.tasksService.update(id, body);
  }

  @Delete('t/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiSuccessJson(Object)
  remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.tasksService.remove(id);
  }
}
