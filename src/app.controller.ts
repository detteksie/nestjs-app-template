import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Redirect,
  Req,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard, RefreshAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  Serialize,
  // SerializeInterceptor,
} from './interceptors/serialize.interceptor';
import { AuthService } from './modules/auth/auth.service';
import { LoginDto, LoginResponse } from './modules/auth/dto/login.dto';
import { ProfileResponse } from './modules/auth/dto/profile.dto';
import { RegisterDto } from './modules/auth/dto/register.dto';
import { ApiSuccessJson } from './utils/response.util';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('api')
  @ApiExcludeEndpoint()
  getIndex() {
    return;
  }

  @Get('hello')
  @ApiSuccessJson(String)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('bye')
  @ApiSuccessJson(String)
  getBye(): string {
    return this.appService.getBye();
  }

  @Get('profile')
  // @UseInterceptors(new SerializeInterceptor(ProfileResponse))
  @Serialize(ProfileResponse)
  // @UseGuards(AuthGuard('jwt-access'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiSuccessJson(User)
  getProfile(@Req() req: Request) {
    return req.user;
  }
}

@ApiTags('authentication')
@Controller()
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiSuccessJson(User)
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(200)
  // @UseGuards(AuthGuard('local'))
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiSuccessJson(LoginResponse)
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  @ApiBearerAuth()
  @ApiSuccessJson(LoginResponse)
  async refreshToken(@Req() req: Request) {
    return this.authService.login(req.user);
  }
}
