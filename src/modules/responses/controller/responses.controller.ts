import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ResponsesService } from '../service/responses.service';
import { CreateResponseDto } from '../dto/create-responses.dto';
import { UpdateResponseDto } from '../dto/update-responses.dto';
import { UserAccessJwtGuard } from '../../auth/guard/user-access-jwt.guard';
import { AuthenticatedUser } from '../../../common/decorators/authenticated-user.decorator';
import { AuthenticatedUserObject } from '../../../common/models/authenticated-user-object.model';

@Controller('')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @UseGuards(UserAccessJwtGuard)
  @Post('request/create')
  create(
    @Body() createResponseDto: CreateResponseDto,
    @AuthenticatedUser() user: AuthenticatedUserObject,
  ) {
    createResponseDto.mobilographId = user.userId;
    return this.responsesService.create(createResponseDto);
  }

  @UseGuards(UserAccessJwtGuard)
  @Get()
  findAll() {
    return this.responsesService.findAll();
  }

  @UseGuards(UserAccessJwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsesService.findOne(+id);
  }

  @UseGuards(UserAccessJwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResponseDto: UpdateResponseDto,
  ) {
    return this.responsesService.update(+id, updateResponseDto);
  }

  @UseGuards(UserAccessJwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsesService.remove(+id);
  }
}
