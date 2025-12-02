import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapperService } from './user-mapper.service';
import { UserListResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mapperService: UserMapperService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating new user with email: ${createUserDto.email}`);
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      this.logger.warn(
        `Failed to create user: email ${createUserDto.email} already exists`,
      );
      throw new ConflictException(
        `User with email ${createUserDto.email} already exists`,
      );
    }
    // Create user follow DTO first and then save
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User created successfully with ID: ${savedUser.id}`);
    return this.mapperService.toUserDto(savedUser);
  }

  /**
   * Get all users with pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 5,
  ): Promise<UserListResponseDto> {
    this.logger.log(`Fetching users: Page: ${page}, Limit: ${limit}`);
    const skip = (page - 1) * limit;
    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: { id: 'ASC' },
    });
    return this.mapperService.toPaginatedResponse(data, page, limit, total);
  }

  /**
   * Get user by ID
   */
  async findOne(id: number): Promise<User> {
    this.logger.log(`Fetching user with ID: ${id}`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapperService.toUserDto(user);
  }

  /**
   * Update user by ID
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`Update failed: User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Check if email is unique
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        this.logger.warn(
          `Update failed: email ${updateUserDto.email} already exists`,
        );
        throw new ConflictException(
          `User with email ${updateUserDto.email} already exists`,
        );
      }
    }
    // Update user
    Object.assign(user, updateUserDto);
    const savedUser = await this.userRepository.save(user);
    this.logger.log(`User with ID ${id} updated successfully`);
    return this.mapperService.toUserDto(savedUser);
  }

  /**
   * Delete user by ID
   */
  async remove(id: number): Promise<void> {
    this.logger.log(`Deleting user with ID: ${id}`);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`Delete failed: User with ID ${id} not found`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Delete user
    await this.userRepository.remove(user);
    this.logger.log(`User with ID ${id} deleted successfully`);
  }
}
