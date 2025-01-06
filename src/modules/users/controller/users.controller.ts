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

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userProfileImagesService: UserProfileImageService,
  ) {}

  @UseGuards(UserAccessJwtGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(UserAccessJwtGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(UserAccessJwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(UserAccessJwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(UserAccessJwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
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
