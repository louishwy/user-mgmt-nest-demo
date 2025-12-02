import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsIn,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John', description: 'User first name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'User last name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional({
    example: 'male',
    enum: ['male', 'female', 'other'],
    description: 'User gender',
  })
  @IsOptional()
  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Date of birth in YYYY-MM-DD format',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateOfBirth must be in YYYY-MM-DD format',
  })
  dateOfBirth?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: '1234567890',
    description: 'User phone number',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,15}$/, {
    message: 'phoneNumber must be between 10 and 15 digits',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'Store A', description: 'User location' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  location?: string;
}
