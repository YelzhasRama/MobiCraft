import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserAccessJwtGuard extends AuthGuard('user-access-jwt') {}
