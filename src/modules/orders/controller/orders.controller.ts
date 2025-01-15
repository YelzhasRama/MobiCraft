import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { UserAccessJwtGuard } from '../../auth/guard/user-access-jwt.guard';
import { GetAllOrdersQuery } from '../query/get-all-orders.query';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(UserAccessJwtGuard)
  @Post('/client/order/create')
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('/mobi/order/list')
  async findAll(@Query() query: GetAllOrdersQuery) {
    const [orders, total] = await this.ordersService.findAll(query);
    return {
      orders,
      meta: {
        total,
        page: query.page,
        perPage: query.perPage,
      },
    };
  }

  @UseGuards(UserAccessJwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @UseGuards(UserAccessJwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @UseGuards(UserAccessJwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
