import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Redirect,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterBody } from '../bodies/register.body';
import { LoginBody } from '../bodies/login.body';
import { UserRefreshJwtGuard } from '../guard/user-refresh-jwt.guard';
import { AuthenticatedUser } from '../../../common/decorators/authenticated-user.decorator';
import { AuthenticatedUserObject } from '../../../common/models/authenticated-user-object.model';
import { VerifyEmailBody } from '../bodies/verify-email.body';
import { UserAccessJwtGuard } from '../guard/user-access-jwt.guard';
import { StaticObjectPathExpanderInterceptor } from '../../../common/interceptors/static-object-path-expander.interceptor';
import { UsersService } from '../../users/service/users.service';
import { CreateUserDto } from '../../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(UserAccessJwtGuard)
  @UseInterceptors(StaticObjectPathExpanderInterceptor)
  @Get('me')
  getMe(@AuthenticatedUser() user: AuthenticatedUserObject) {
    return this.usersService.findOne(user.userId);
  }

  @Post('register')
  register(@Body() body: RegisterBody) {
    return this.authService.register(body);
  }

  @UseGuards(UserAccessJwtGuard)
  @Patch('/profile')
  async saveProfileOfUser(
    @Body() body: CreateUserDto,
    @AuthenticatedUser() user: AuthenticatedUserObject, // Получаем текущего пользователя
  ) {
    return this.usersService.update(user.userId, body);
  }

  @Post('login')
  async login(@Body() body: LoginBody) {
    return this.authService.login(body);
  }

  @UseGuards(UserRefreshJwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@AuthenticatedUser() user: AuthenticatedUserObject) {
    return this.authService.logout(user.userId);
  }

  @UseGuards(UserRefreshJwtGuard)
  @Post('refresh-tokens')
  refreshTokens(@AuthenticatedUser() user: AuthenticatedUserObject) {
    const { refreshToken, userId } = user;

    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(UserAccessJwtGuard)
  @Post('send-code')
  generateAndSendEmailVerificationCode(
    @AuthenticatedUser() user: AuthenticatedUserObject,
  ) {
    return this.authService.generateAndSendEmailVerificationCode(user.userId);
  }

  @UseGuards(UserAccessJwtGuard)
  @Post('verify-email')
  verifyEmail(
    @AuthenticatedUser() user: AuthenticatedUserObject,
    @Body() body: VerifyEmailBody,
  ) {
    return this.authService.verifyEmail({
      userId: user.userId,
      code: body.code,
    });
  }

  // @Post('instagram-login')
  // @Redirect() // NestJS автоматически выполняет редирект
  // async getInstagramLoginUrl() {
  //   const instagramLoginUrl = await this.authService.loginWithInstagram();
  //   return { url: instagramLoginUrl }; // Указываем URL для редиректа
  // }
  //
  // @Post('instagram/callback')
  // async handleInstagramCallback(@Query('code') code: string) {
  //   console.log(code);
  //   if (!code) {
  //     throw new BadRequestException('Authorization code is missing');
  //   }
  //
  //   // Обрабатываем callback и возвращаем токен или ошибку
  //   return await this.authService.handleInstagramCallback(code);
  // }
  //
  // @Get('instagram/user')
  // async getInstagramUser(@Query('accessToken') accessToken: string) {
  //   console.log(accessToken);
  //   if (!accessToken) {
  //     throw new BadRequestException('Access token is required');
  //   }
  //
  //   return await this.authService.getInstagramUser(accessToken);
  // }

  // TikTok

  @Get('tiktok-login')
  async getTiktokLoginUrl() {
    const tiktokLoginUrl = await this.authService.loginWithTiktok();
    return tiktokLoginUrl; // Возвращаем URL для авторизации
  }

  // Callback после авторизации
  @Get('tiktok/callback')
  async handleTiktokCallback(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    if (!code) {
      throw new BadRequestException('Authorization code is missing');
    }
    const tokens = await this.authService.handleTiktokCallback(code, state);

    // TODO: надо что-то сделать с токенами, скорее всего передать фронту каким-то образом или записать в базу
    console.log(tokens);
    return tokens;
  }

  // Получение данных пользователя TikTok
  @Get('tiktok/user')
  async getTiktokUser(@Query('accessToken') accessToken: string) {
    if (!accessToken) {
      throw new BadRequestException('Access token is required');
    }

    const user = await this.authService.getTiktokUser(accessToken);
    return user;
  }
}
