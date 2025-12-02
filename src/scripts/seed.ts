import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function seed() {
  const logger = new Logger('DatabaseSeeder');
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  const users = [
    {
      firstName: 'zhang',
      lastName: 'san',
      gender: 'male',
      dateOfBirth: '1990-01-01',
      email: 'zhangsan@test.com',
      phoneNumber: '13812345678',
      location: 'store a',
    },
    {
      firstName: 'li',
      lastName: 'si',
      gender: 'male',
      dateOfBirth: '1991-01-01',
      email: 'lisi@test.com',
      phoneNumber: '13698765432',
      location: 'store b',
    },
    {
      firstName: 'wang',
      lastName: 'wu',
      gender: 'female',
      dateOfBirth: '1992-01-01',
      email: 'wangwu@test.com',
      phoneNumber: '15012348765',
      location: 'store a',
    },
    {
      firstName: 'zhao',
      lastName: 'liu',
      gender: 'male',
      dateOfBirth: '1993-01-01',
      email: 'zhaoliu@test.com',
      phoneNumber: '13511112222',
      location: 'store c',
    },
    {
      firstName: 'sun',
      lastName: 'qi',
      gender: 'female',
      dateOfBirth: '1994-01-01',
      email: 'sunqi@test.com',
      phoneNumber: '13922223333',
      location: 'store b',
    },
    {
      firstName: 'zhou',
      lastName: 'ba',
      gender: 'other',
      dateOfBirth: '1995-01-01',
      email: 'zhouba@test.com',
      phoneNumber: '15888889999',
      location: 'store a',
    },
    {
      firstName: 'wu',
      lastName: 'jiu',
      gender: 'female',
      dateOfBirth: '1996-01-01',
      email: 'wujiu@test.com',
      phoneNumber: '13666667777',
      location: 'store c',
    },
    {
      firstName: 'zheng',
      lastName: 'shi',
      gender: 'male',
      dateOfBirth: '1997-01-01',
      email: 'zhengshi@test.com',
      phoneNumber: '15199998888',
      location: 'store b',
    },
  ];

  logger.log('Seeding database...');

  for (const userData of users) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      logger.log(`Created user: ${userData.email}`);
    } else {
      logger.warn(`User already exists: ${userData.email}`);
    }
  }

  logger.log('Seeding completed!');
  await app.close();
}

seed().catch((error) => {
  const logger = new Logger('DatabaseSeeder');
  logger.error('Seeding failed:', error);
  process.exit(1);
});
