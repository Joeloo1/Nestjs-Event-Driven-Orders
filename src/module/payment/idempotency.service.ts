import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/common/redis/redis.constant';

@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async reserve(key: string, ttlSecond: number): Promise<boolean> {
    const result = await this.redis.set(key, '1', 'EX', ttlSecond, 'NX');
    return result === 'OK';
  }

  async release(key: string): Promise<void> {
    await this.redis.del(key);
    this.logger.debug(`Release idempotency key: ${key}`);
  }
}
