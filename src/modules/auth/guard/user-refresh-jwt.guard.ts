import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserRefreshJwtGuard extends AuthGuard('user-refresh-jwt') {}
