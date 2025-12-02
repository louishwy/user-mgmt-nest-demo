import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    example: 'male',
    enum: ['male', 'female', 'other'],
    description: 'User gender',
  })
  @IsString()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Date of birth in YYYY-MM-DD format',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateOfBirth must be in YYYY-MM-DD format',
  })
  dateOfBirth: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '1234567890',
    description: 'User phone number',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,15}$/, {
    message: 'phoneNumber must be between 10 and 15 digits',
  })
  phoneNumber: string;

  @ApiProperty({ example: 'Store A', description: 'User location' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  location: string;
}
