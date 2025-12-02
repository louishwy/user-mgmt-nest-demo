import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserListResponseDto, PaginationMeta } from './dto/user-response.dto';

@Injectable()
export class UserMapperService {
  toUserDto(user: User): User {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      phoneNumber: user.phoneNumber,
      location: user.location,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  toPaginatedResponse(
    users: User[],
    page: number,
    limit: number,
    totalItems: number,
  ): UserListResponseDto {
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: users.map((user) => this.toUserDto(user)),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }
}
