import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { User } from '|/entities/user.entity';
import { Serialize } from '|/res/interceptors/serialize.interceptor';
import { PaginationQuery, PaginationQueryPipe } from '|/utils/pagination-query.util';
import { ApiPaginatedResponse, ApiSuccessJson } from '|/utils/response.util';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsernameResponse } from './dto/username.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiSuccessJson(User)
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get()
  @ApiPaginatedResponse(User)
  findAll(@Query(new PaginationQueryPipe()) query: PaginationQuery) {
    return this.usersService.findAll({
      limit: query.limit,
      page: query.page,
      route: '/v1/users',
    });
  }

  @Get(':id')
  @ApiSuccessJson(User)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Get('u/:username')
  @Serialize(UsernameResponse)
  @ApiSuccessJson(UsernameResponse)
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.getUserByUsername(username);
  }

  @Patch(':id')
  @ApiSuccessJson(Object)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @ApiSuccessJson(Object)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
