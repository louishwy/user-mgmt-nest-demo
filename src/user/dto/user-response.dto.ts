import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class PaginationMeta {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 5 })
  limit: number;

  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 20 })
  totalPages: number;
}

export class UserListResponseDto {
  @ApiProperty({ type: [User] })
  data: User[];

  @ApiProperty({ type: PaginationMeta })
  pagination: PaginationMeta;
}
