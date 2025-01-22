import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  Param,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserAccessJwtGuard } from '../../auth/guard/user-access-jwt.guard';
import { AuthenticatedUserObject } from '../../../common/models/authenticated-user-object.model';
import { UserProfileImageService } from '../service/user-profile-image.service';
import { AuthenticatedUser } from '../../../common/decorators/authenticated-user.decorator';
import { CreateUserDevicesDto } from '../dto/create-user-devices.dto';
import { AccessoryRepository } from '../repository/accessory.repository';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { StaticObjectPathExpanderInterceptor } from '../../../common/interceptors/static-object-path-expander.interceptor';
import { UserVideosService } from '../service/user-videos.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateLoginAndPasswordDto } from '../dto/update-login-and-password.dto';
import { DeviceRepository } from '../repository/device.repository';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userProfileImagesService: UserProfileImageService,
    private readonly accessoryRepository: AccessoryRepository,
    private readonly userVideosService: UserVideosService,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  @UseGuards(UserAccessJwtGuard)
  @UseInterceptors(StaticObjectPathExpanderInterceptor)
  @Get('user/:id/bio')
  getMe(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(UserAccessJwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(), // Память для хранения файлов
      limits: { fileSize: 15 * 1024 * 1024 }, // Ограничение на размер файла 15 MB
    }),
  )
  @Post('user/upload-profile-image')
  async uploadProfileImage(
    @AuthenticatedUser() user: AuthenticatedUserObject,
    @UploadedFile() file: Express.Multer.File, // Тип для загруженного файла
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype) {
      throw new BadRequestException('File does not have mimetype');
    }

    return {
      userProfileImage: await this.userProfileImagesService.uploadAndSaveOne(
        file,
        user.userId,
        { mimeType: file.mimetype },
      ),
    };
  }

  @UseGuards(UserAccessJwtGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(), // Память для хранения файлов
      limits: { fileSize: 50 * 1024 * 1024 }, // Ограничение на размер файла 50 MB
    }),
  )
  @Post('user/upload-video')
  async uploadVideo(
    @AuthenticatedUser() user: AuthenticatedUserObject,
    @UploadedFile() file: Express.Multer.File, // Тип для загруженного файла
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype) {
      throw new BadRequestException('File does not have mimetype');
    }

    return {
      userVideo: await this.userVideosService.uploadAndSaveOne(
        file,
        user.userId,
        {
          mimeType: file.mimetype,
        },
      ),
    };
  }

  @UseGuards(UserAccessJwtGuard)
  @Post('user/mobilograph-devices')
  async saveMobilographDevices(
    @AuthenticatedUser() user: AuthenticatedUserObject,
    @Body() dto: CreateUserDevicesDto,
  ) {
    return await this.usersService.saveMobilographDevices(user.userId, dto);
  }

  @Get('accessory/list')
  async getAllAccessories() {
    const accessories = await this.accessoryRepository.getAllAccessories();
    return accessories;
  }

  @Get('device/list')
  async getAllDevice() {
    const devices = await this.deviceRepository.getAllDevices();
    return devices;
  }

  @UseGuards(UserAccessJwtGuard)
  @Patch('user/:id/update')
  updateLoginAndPassword(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateLoginAndPasswordDto,
    @AuthenticatedUser() user: AuthenticatedUserObject,
  ) {
    if (user.userId === +id) {
      throw new NotFoundException('User id is not yours');
    }
    return this.usersService.updateEmailAndPassword(+id, updateUserDto);
  }

  @UseGuards(UserAccessJwtGuard)
  @Patch('profile/:id/update')
  updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateUserDto,
  ) {
    return this.usersService.update(+id, updateProfileDto);
  }
}
