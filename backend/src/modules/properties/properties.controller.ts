import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, type CurrentUserType } from '../../common/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    // Get the current user from the database
    const user = await this.usersService.findOrCreateFromAuth0(currentUser);
    
    // Set the owner to the current authenticated user
    const propertyData = {
      ...createPropertyDto,
      ownerId: user.id,
    };
    
    return this.propertiesService.create(propertyData);
  }

  @Get()
  async findAll(
    @CurrentUser() currentUser: CurrentUserType,
    @Query('ownerId') ownerId?: string,
  ) {
    // Get the current user from the database
    const user = await this.usersService.findOrCreateFromAuth0(currentUser);
    
    // Only return properties owned by the current user
    return this.propertiesService.findByOwner(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Get(':id/bookings')
  async getPropertyBookings(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);
    return property.bookings;
  }

  @Get(':id/work-orders')
  async getPropertyWorkOrders(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);
    return property.workOrders;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }
}