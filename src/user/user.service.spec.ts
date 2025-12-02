import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserMapperService } from './user-mapper.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: any;
  let mapperService: UserMapperService;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    dateOfBirth: '1990-01-15',
    email: 'john.doe@example.com',
    phoneNumber: '1234567890',
    location: 'Store A',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserMapperService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mapperService = module.get<UserMapperService>(UserMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      gender: 'female',
      dateOfBirth: '1992-03-22',
      email: 'jane.smith@example.com',
      phoneNumber: '2345678901',
      location: 'Store B',
    };

    it('should create a new user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({ ...createUserDto, id: 0 });
      mockRepository.save.mockResolvedValue({
        ...mockUser,
        ...createUserDto,
        id: 2,
      });

      const result = await service.create(createUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.email).toBe(createUserDto.email);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockUsers = [mockUser];
      mockRepository.findAndCount.mockResolvedValue([mockUsers, 8]);

      const result = await service.findAll(1, 5);

      expect(mockRepository.findAndCount).toHaveBeenCalled();
      expect(result.data).toHaveLength(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(5);
      expect(result.pagination.totalItems).toBe(8);
      expect(result.pagination.totalPages).toBe(2);
    });

    it('should calculate total pages correctly', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 25]);

      const result = await service.findAll(1, 5);

      expect(result.pagination.totalPages).toBe(5); // 25 items / 5 per page = 5 pages
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result.id).toBe(1);
      expect(result.email).toBe(mockUser.email);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      location: 'Store Z',
      phoneNumber: '1111111111',
    };

    it('should update a user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({ ...mockUser, ...updateUserDto });

      const result = await service.update(1, updateUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.location).toBe(updateUserDto.location);
      expect(result.phoneNumber).toBe(updateUserDto.phoneNumber);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if updating to existing email', async () => {
      const updateWithEmail: UpdateUserDto = {
        email: 'existing@example.com',
      };
      mockRepository.findOne
        .mockResolvedValueOnce(mockUser) // First call for user existence
        .mockResolvedValueOnce({ ...mockUser, id: 2 }); // Second call for email check

      await expect(service.update(1, updateWithEmail)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should allow updating to same email', async () => {
      const updateWithSameEmail: UpdateUserDto = {
        email: mockUser.email,
      };
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.update(1, updateWithSameEmail);

      expect(result).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
