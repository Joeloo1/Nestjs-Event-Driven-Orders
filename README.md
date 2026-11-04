# NestJS Event-Driven Order Processing System

A production-ready, event-driven microservices architecture built with NestJS, demonstrating asynchronous order processing using BullMQ queues, Redis, and the Event Emitter pattern.

## 🏗️ Architecture Overview

This application showcases a scalable order processing system where a single order creation triggers multiple independent, asynchronous workflows:

```
Order Creation → BullMQ Queues → Independent Processors
                     ↓
        ┌────────────┼────────────┐
        ↓            ↓            ↓
   Inventory    Notifications  Payment
   Processor     Processor    Processor
        ↓            ↓            ↓
   Stock        Email/SMS    Payment
   Reservation   Sending     Processing
```

### Key Features

- **Event-Driven Architecture**: Decoupled services communicate via events through BullMQ queues
- **Asynchronous Processing**: Non-blocking order processing with background job queues
- **Fault Tolerance**: Automatic retry mechanisms with exponential backoff
- **Idempotency**: Redis-backed idempotency for payment processing to prevent duplicate charges
- **Job Monitoring**: Bull Board dashboard for real-time queue monitoring
- **Audit Trail**: Comprehensive logging of all order-related events
- **Type Safety**: Full TypeScript implementation with strong typing

## 📋 Table of Contents

- [Architecture Overview](#️-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Queue Management](#-queue-management)
- [Module Details](#-module-details)
- [Event Flow](#-event-flow)
- [Testing](#-testing)
- [Development](#-development)
- [Production Deployment](#-production-deployment)
- [Troubleshooting](#-troubleshooting)

## 🛠 Tech Stack

### Core Framework
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Node.js** - Runtime environment

### Queue & Event Processing
- **BullMQ** - Redis-based queue system for job processing
- **@nestjs/bullmq** - NestJS integration for BullMQ
- **@nestjs/event-emitter** - Event-driven architecture support
- **Bull Board** - Queue monitoring dashboard

### Data & Caching
- **Redis** - In-memory data store for queues and caching
- **IORedis** - Redis client for Node.js

### Validation & Transformation
- **class-validator** - Decorator-based validation
- **class-transformer** - Object transformation utilities

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

## 📁 Project Structure

```
nestjs-event-driven-orders/
├── src/
│   ├── common/                      # Shared utilities and modules
│   │   ├── decorators/              # Custom decorators
│   │   ├── filters/                 # Exception filters
│   │   ├── interceptors/            # Custom interceptors
│   │   ├── redis/                   # Redis module configuration
│   │   │   ├── redis.module.ts
│   │   │   └── redis.constant.ts
│   │   └── utils/
│   │       └── safe-listener.util.ts # Error handling for listeners
│   │
│   ├── infrastructure/              # Infrastructure-level services
│   │   └── queues/
│   │       ├── queues.module.ts    # BullMQ queue configuration
│   │       └── queues.constant.ts  # Queue name constants
│   │
│   ├── module/                      # Business domain modules
│   │   ├── orders/                 # Order management
│   │   │   ├── dto/
│   │   │   │   └── create-order.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── order.entity.ts
│   │   │   ├── events/
│   │   │   │   ├── order-created.event.ts
│   │   │   │   └── order-events.constant.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── orders.module.ts
│   │   │
│   │   ├── inventory/              # Inventory management
│   │   │   ├── inventory.processor.ts    # Stock reservation handler
│   │   │   ├── inventory.listener.ts
│   │   │   └── inventory.module.ts
│   │   │
│   │   ├── payment/                # Payment processing
│   │   │   ├── payment.processor.ts      # Payment job handler
│   │   │   ├── payment-gateway.service.ts
│   │   │   ├── idempotency.service.ts   # Duplicate prevention
│   │   │   └── payment.module.ts
│   │   │
│   │   ├── notifications/          # Notification service
│   │   │   ├── notification.processor.ts
│   │   │   ├── notifications.listener.ts
│   │   │   └── notifications.module.ts
│   │   │
│   │   └── audit/                  # Audit logging
│   │       ├── audit.processor.ts
│   │       ├── audit.listener.ts
│   │       ├── audit-log.entry.ts
│   │       └── audit.module.ts
│   │
│   ├── app.module.ts               # Root application module
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                     # Application entry point
│
├── test/                           # E2E tests
├── docker-compose.yml              # Docker services configuration
├── .env                            # Environment variables
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## ✅ Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** >= 18.x
- **pnpm** >= 8.x (or npm/yarn)
- **Redis** >= 7.x
- **Docker** & **Docker Compose** (optional, for containerized Redis)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nestjs-event-driven-orders
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env  # If .env.example exists, otherwise create .env
   ```

   Configure your `.env` file:
   ```env
   PORT=3000
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Start Redis**
   
   **Option A: Using Docker Compose (Recommended)**
   ```bash
   docker-compose up -d
   ```

   **Option B: Local Redis Installation**
   ```bash
   redis-server
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application HTTP port | `3000` |
| `REDIS_HOST` | Redis server hostname | `localhost` |
| `REDIS_PORT` | Redis server port | `6379` |

### Queue Configuration

Queues are configured in `src/infrastructure/queues/queues.module.ts` with:
- **Retry Strategy**: Exponential backoff (2s initial delay)
- **Max Attempts**: 3 retries per job
- **Job Retention**: Last 100 completed jobs kept in memory

### Redis Configuration

Redis connection is managed through `src/common/redis/redis.module.ts` and provides:
- Connection pooling
- Automatic reconnection
- Error handling

## 🚀 Running the Application

### Development Mode

```bash
# Watch mode with hot-reload
pnpm run start:dev
```

### Production Mode

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start:prod
```

### Debug Mode

```bash
pnpm run start:debug
```

The application will start on `http://localhost:3000`

### Accessing Bull Board Dashboard

Navigate to `http://localhost:3000/queues` to monitor your queues in real-time.

The dashboard provides:
- Queue statistics (completed, failed, delayed jobs)
- Job details and payloads
- Retry and remove job capabilities
- Real-time updates

## 📖 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Create Order
```http
POST /orders
Content-Type: application/json

{
  "userId": "user-123",
  "items": [
    {
      "productId": "prod-001",
      "quantity": 2,
      "unitPrice": 29.99
    },
    {
      "productId": "prod-002",
      "quantity": 1,
      "unitPrice": 49.99
    }
  ]
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "items": [...],
  "total": 109.97,
  "status": "pending",
  "createdAt": "2024-11-04T10:30:00.000Z"
}
```

#### Get All Orders
```http
GET /orders
```

**Response:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-123",
    "items": [...],
    "total": 109.97,
    "status": "pending",
    "createdAt": "2024-11-04T10:30:00.000Z"
  }
]
```

#### Get Order by ID
```http
GET /orders/:id
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "items": [...],
  "total": 109.97,
  "status": "pending",
  "createdAt": "2024-11-04T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Order 550e8400-e29b-41d4-a716-446655440000 not found",
  "error": "Not Found"
}
```

### Request Validation

Order items must include:
- `productId` (string, required)
- `quantity` (number, required, positive)
- `unitPrice` (number, required, positive)

## 🔄 Queue Management

### Queue Names

The application uses four specialized queues:

| Queue Name | Purpose | Processor |
|-----------|---------|-----------|
| `inventory_events` | Stock reservation | InventoryProcessor |
| `notification_events` | Email/SMS notifications | NotificationsProcessor |
| `payment_events` | Payment processing | PaymentsProcessor |
| `audit_events` | Audit logging | AuditProcessor |

### Job Configuration

All jobs are configured with:
```typescript
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000  // 2 seconds, then 4s, then 8s
  },
  removeOnComplete: 100,  // Keep last 100 completed jobs
  removeOnFail: false     // Keep all failed jobs for inspection
}
```

### Monitoring Queues

Access the Bull Board dashboard at `http://localhost:3000/queues` to:
- View queue health and statistics
- Inspect job payloads and errors
- Manually retry failed jobs
- Clean up old jobs
- Monitor processing times

## 🧩 Module Details

### Orders Module

**Responsibility**: Core order creation and management

**Key Components**:
- `OrdersController`: REST API endpoints
- `OrdersService`: Business logic for order creation
- `CreateOrderDto`: Request validation
- `Order` entity: Order data structure

**Event Publishing**: When an order is created, it publishes `order.created` event to three queues simultaneously.

### Inventory Module

**Responsibility**: Stock reservation and inventory management

**Features**:
- Asynchronous stock reservation
- Simulated 15-second processing delay (for testing)
- Automatic retry on failure
- Detailed logging of reserved items

**Processor Logic**:
```typescript
// Reserves stock for each item in the order
// Logs reservation status
// Handles failures with automatic retries
```

### Payment Module

**Responsibility**: Payment processing with idempotency guarantees

**Key Components**:
- `PaymentGatewayService`: Payment provider integration
- `IdempotencyService`: Redis-backed duplicate prevention
- `PaymentsProcessor`: Job processing logic

**Idempotency Strategy**:
- Each order gets a unique idempotency key: `payment:{orderId}`
- Key is reserved before payment processing
- TTL: 24 hours
- Prevents duplicate charges on retries

**Flow**:
1. Check if payment already processed (idempotency key exists)
2. Reserve idempotency key
3. Process payment through gateway
4. On failure: release key to allow retry
5. On success: keep key to prevent duplicates

### Notifications Module

**Responsibility**: Customer communication

**Features**:
- Email/SMS notification queuing
- Order confirmation messages
- User-specific notifications
- Retry logic for delivery failures

### Audit Module

**Responsibility**: System-wide audit trail

**Features**:
- Logs all order-related events
- Structured audit entries
- Searchable audit trail
- Compliance and debugging support

### Redis Module

**Responsibility**: Centralized Redis connection management

**Features**:
- Singleton Redis client
- Connection pooling
- Error handling and reconnection
- Shared across modules

## 🔀 Event Flow

### Order Creation Flow

```
1. Client POST /orders
   ↓
2. OrdersService.create()
   ↓
3. Order stored in memory
   ↓
4. OrderCreatedEvent published to 3 queues in parallel
   ├─→ inventory_events queue
   ├─→ notification_events queue  
   └─→ payment_events queue
   ↓
5. Response returned immediately to client
   ↓
6. Background Processing (async)
   ├─→ InventoryProcessor: Reserve stock
   ├─→ NotificationsProcessor: Send email
   └─→ PaymentsProcessor: Charge payment (with idempotency)
   ↓
7. AuditProcessor logs all events
```

### Error Handling & Retries

Each processor has built-in retry logic:

**Attempt 1**: Immediate processing
- Delay: 0s
- Backoff: 0s

**Attempt 2**: First retry
- Delay: 2s
- Backoff: Exponential

**Attempt 3**: Second retry
- Delay: 4s
- Backoff: Exponential

**Attempt 4**: Final retry
- Delay: 8s
- After this: Job moves to failed state

Failed jobs are retained for manual inspection and retry via Bull Board.

## 🧪 Testing

### Unit Tests

```bash
pnpm run test
```

### E2E Tests

```bash
pnpm run test:e2e
```

### Test Coverage

```bash
pnpm run test:cov
```

### Watch Mode

```bash
pnpm run test:watch
```

## 🛠 Development

### Code Formatting

```bash
# Format code
pnpm run format

# Lint code
pnpm run lint
```

### Development Best Practices

1. **Adding New Events**:
   - Define event class in `events/` folder
   - Add event name to constants
   - Create processor in target module
   - Register queue in module

2. **Creating New Processors**:
   ```typescript
   @Processor(QUEUE_NAMES.YOUR_QUEUE)
   export class YourProcessor extends WorkerHost {
     async process(job: Job<YourEventType>): Promise<void> {
       // Processing logic
     }
   }
   ```

3. **Adding Idempotency**:
   ```typescript
   const key = `operation:${uniqueId}`;
   const isNew = await this.idempotencyService.reserve(key, ttl);
   if (!isNew) return; // Skip duplicate
   // Process...
   ```

### Environment-Specific Configuration

Create environment-specific files:
- `.env.development`
- `.env.production`
- `.env.test`

## 🚢 Production Deployment

### Build for Production

```bash
pnpm run build
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production Redis instance
- [ ] Set up Redis persistence (AOF/RDB)
- [ ] Configure proper logging (e.g., Winston, Pino)
- [ ] Set up monitoring (Datadog, New Relic, etc.)
- [ ] Configure rate limiting
- [ ] Enable CORS properly
- [ ] Set up SSL/TLS
- [ ] Configure health checks
- [ ] Set up horizontal scaling for workers

### Docker Deployment

```dockerfile
# Example Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN pnpm install --prod

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
```

### Scaling Considerations

**Horizontal Scaling**:
- Run multiple application instances
- All instances share the same Redis instance
- BullMQ handles job distribution automatically
- No code changes required

**Redis High Availability**:
- Use Redis Sentinel for automatic failover
- Consider Redis Cluster for horizontal scaling
- Set up Redis replication

**Queue Workers**:
- Can separate API servers from queue workers
- Dedicated worker instances for heavy processing
- Configure concurrency per worker

## 🐛 Troubleshooting

### Common Issues

**1. Redis Connection Failed**

```bash
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution**:
- Verify Redis is running: `redis-cli ping`
- Check `REDIS_HOST` and `REDIS_PORT` in `.env`
- Ensure Docker container is running: `docker ps`

**2. Jobs Stuck in Queue**

**Solution**:
- Check Bull Board dashboard for errors
- Verify processors are registered correctly
- Check Redis memory limits
- Review application logs

**3. Duplicate Payments**

**Solution**:
- Verify IdempotencyService is working
- Check Redis connectivity
- Review idempotency key TTL
- Inspect payment processor logs

**4. Port Already in Use**

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or change PORT in .env
```

### Debugging Tips

**Enable Debug Logging**:
```typescript
// In main.ts
app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
```

**Inspect Queue State**:
```bash
# Redis CLI
redis-cli

# List all keys
KEYS bull:*

# Inspect specific job
HGETALL bull:payment_events:1
```

**Monitor Redis Memory**:
```bash
redis-cli INFO memory
```

## 📚 Additional Resources

### NestJS
- [Official Documentation](https://docs.nestjs.com)
- [NestJS Discord](https://discord.gg/G7Qnnhy)

### BullMQ
- [BullMQ Documentation](https://docs.bullmq.io)
- [Bull Board](https://github.com/felixmosh/bull-board)

### Redis
- [Redis Documentation](https://redis.io/docs)
- [IORedis Documentation](https://github.com/redis/ioredis)

## 📝 License

This project is licensed under UNLICENSED - see the LICENSE file for details.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🌟 Acknowledgments

- NestJS team for the amazing framework
- BullMQ team for robust queue processing
- Redis team for blazing-fast data storage

---

**Built with ❤️ using NestJS and TypeScript**
