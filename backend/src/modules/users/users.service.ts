import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['properties'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['properties'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { auth0Id },
      relations: ['properties'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['properties'],
    });
  }

  async findOrCreateFromAuth0(auth0User: any): Promise<User> {
    console.log('🔍 Auth0 User Data:', JSON.stringify(auth0User, null, 2));
    
    let user = await this.findByAuth0Id(auth0User.userId);

    if (!user) {
      // Create new user from Auth0 data
      const email = auth0User.email || `${auth0User.userId.replace('|', '_')}@placeholder.com`;
      const fullName = auth0User.name || 'Unknown User';
      
      const createUserDto: CreateUserDto = {
        email: email,
        firstName: fullName.split(' ')[0] || 'Unknown',
        lastName: fullName.split(' ').slice(1).join(' ') || 'User',
        auth0Id: auth0User.userId,
        role: 'owner',
      };

      console.log('🔍 Creating user with data:', JSON.stringify(createUserDto, null, 2));
      user = await this.create(createUserDto);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}