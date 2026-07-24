import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type {StringValue} from 'ms';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { 
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as StringValue,
       },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
