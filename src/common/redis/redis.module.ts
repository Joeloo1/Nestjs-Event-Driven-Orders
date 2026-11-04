import { Global, Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constant';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Redis({
          host: config.get<string>('REDIS_HOST', 'loalhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
