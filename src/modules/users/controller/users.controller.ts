import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserAccessJwtGuard } from '../../auth/guard/user-access-jwt.guard';
import { AuthenticatedUserObject } from '../../../common/models/authenticated-user-object.model';
import { FastifyRequest } from 'fastify';
import { UserProfileImageService } from '../service/user-profile-image.service';
import { AuthenticatedUser } from '../../../common/decorators/authenticated-user.decorator';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userProfileImagesService: UserProfileImageService,
  ) {}

  @UseGuards(UserAccessJwtGuard)
  @Get('me')
  getMe(@AuthenticatedUser() user: AuthenticatedUserObject) {
    return this.usersService.findOne(user.userId);
  }

  @UseGuards(UserAccessJwtGuard)
  @Post('/upload-profile-image')
  async uploadProfileImage(
    @AuthenticatedUser() user: AuthenticatedUserObject,
    @Request() request: FastifyRequest,
  ) {
    const data = await request.file();

    return {
      userProfileImage: await this.userProfileImagesService.uploadAndSaveOne(
        data,
        user.userId,
        {
          mimeType: data.mimetype,
        },
      ),
    };
  }
}
