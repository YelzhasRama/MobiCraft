import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterBody } from '../bodies/register.body';
import { LoginBody } from '../bodies/login.body';
import { UserRefreshJwtGuard } from '../guard/user-refresh-jwt.guard';
import { AuthenticatedUser } from '../../../common/decorators/authenticated-user.decorator';
import { AuthenticatedUserObject } from '../../../common/models/authenticated-user-object.model';
import { VerifyEmailBody } from '../bodies/verify-email.body';
import { UserAccessJwtGuard } from '../guard/user-access-jwt.guard';
import { UpdateProfileBody } from '../bodies/update-profile.body';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterBody) {
    return this.authService.register(body);
  }

  @UseGuards(UserAccessJwtGuard)
  @Patch('/profile')
  async saveProfileOfUser(
    @Body() body: UpdateProfileBody,
    @AuthenticatedUser() user: AuthenticatedUserObject, // Получаем текущего пользователя
  ) {
    return this.authService.updateProfile(user.userId, body);
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
}
