import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 50 })
  @ApiProperty({ example: 'John' })
  firstName: string;

  @Column({ length: 50 })
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @Column({ length: 20 })
  @ApiProperty({ example: 'male', enum: ['male', 'female', 'other'] })
  gender: string;

  @Column({ length: 10 })
  @ApiProperty({ example: '1990-01-15' })
  dateOfBirth: string;

  @Column({ unique: true, length: 100 })
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @Column({ length: 15 })
  @ApiProperty({ example: '1234567890' })
  phoneNumber: string;

  @Column({ length: 100 })
  @ApiProperty({ example: 'Store A' })
  location: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
