import { Logger } from '@nestjs/common';

const logger = new Logger('EventListenerErrors');

export const safeListener = async (
  listenerName: string,
  eventName: string,
  fn: () => Promise<void> | void,
): Promise<void> => {
  try {
    await fn();
  } catch (error) {
    logger.error(
      `[${listenerName}] Error handling event "${eventName}": ${
        error instanceof Error ? error.message : String(error)
      }`,
      error instanceof Error ? error.stack : undefined,
    );
  }
};
