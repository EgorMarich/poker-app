import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  name = 'InitialMigration1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('user', 'admin')
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "username" character varying,
        "password" character varying NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'user',
        "isActive" boolean NOT NULL DEFAULT true,
        "avatarUrl" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Subscriptions
    await queryRunner.query(`
      CREATE TYPE "subscription_plan_enum" AS ENUM ('free', 'basic', 'pro', 'unlimited')
    `);
    await queryRunner.query(`
      CREATE TYPE "subscription_status_enum" AS ENUM ('active', 'expired', 'cancelled', 'pending')
    `);

    await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "plan" "subscription_plan_enum" NOT NULL DEFAULT 'free',
        "status" "subscription_status_enum" NOT NULL DEFAULT 'active',
        "maxRanges" integer NOT NULL DEFAULT 3,
        "dailyAiQuota" integer NOT NULL DEFAULT 5,
        "monthlyAiQuota" integer NOT NULL DEFAULT 50,
        "dailyAiUsed" integer NOT NULL DEFAULT 0,
        "monthlyAiUsed" integer NOT NULL DEFAULT 0,
        "dailyResetAt" TIMESTAMP,
        "monthlyResetAt" TIMESTAMP,
        "startsAt" TIMESTAMP,
        "expiresAt" TIMESTAMP,
        "externalSubscriptionId" character varying,
        "lastPaymentId" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_subscriptions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_subscriptions_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Ranges
    await queryRunner.query(`
      CREATE TYPE "position_enum" AS ENUM ('UTG', 'UTG+1', 'UTG+2', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB')
    `);
    await queryRunner.query(`
      CREATE TYPE "action_type_enum" AS ENUM ('raise', 'call', 'fold', '3bet', 'open')
    `);

    await queryRunner.query(`
      CREATE TABLE "ranges" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "position" "position_enum",
        "actionType" "action_type_enum",
        "matrix" jsonb NOT NULL DEFAULT '{}',
        "tags" text[] NOT NULL DEFAULT '{}',
        "isPublic" boolean NOT NULL DEFAULT false,
        "isTemplate" boolean NOT NULL DEFAULT false,
        "comboCount" double precision NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ranges" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ranges_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Sessions
    await queryRunner.query(`
      CREATE TYPE "game_type_enum" AS ENUM ('NLH', 'PLO', 'PLO5', 'MTT', 'SNG', 'CASH')
    `);
    await queryRunner.query(`
      CREATE TYPE "session_status_enum" AS ENUM ('active', 'completed', 'abandoned')
    `);

    await queryRunner.query(`
      CREATE TABLE "sessions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "gameType" "game_type_enum" NOT NULL DEFAULT 'CASH',
        "status" "session_status_enum" NOT NULL DEFAULT 'active',
        "smallBlind" numeric(10,2) NOT NULL DEFAULT 0,
        "bigBlind" numeric(10,2) NOT NULL DEFAULT 0,
        "buyIn" numeric(10,2) NOT NULL DEFAULT 0,
        "cashOut" numeric(10,2) NOT NULL DEFAULT 0,
        "startedAt" TIMESTAMP,
        "endedAt" TIMESTAMP,
        "venue" character varying,
        "handNotes" jsonb NOT NULL DEFAULT '[]',
        "generalNotes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sessions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_sessions_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Query logs
    await queryRunner.query(`
      CREATE TYPE "query_status_enum" AS ENUM ('success', 'error', 'quota_exceeded')
    `);

    await queryRunner.query(`
      CREATE TABLE "query_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "prompt" text NOT NULL,
        "context" jsonb,
        "response" text,
        "status" "query_status_enum" NOT NULL DEFAULT 'success',
        "promptTokens" integer NOT NULL DEFAULT 0,
        "completionTokens" integer NOT NULL DEFAULT 0,
        "latencyMs" integer,
        "model" character varying,
        "errorMessage" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_query_logs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_query_logs_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Payments
    await queryRunner.query(`
      CREATE TYPE "payment_status_enum" AS ENUM ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')
    `);
    await queryRunner.query(`
      CREATE TYPE "payment_provider_enum" AS ENUM ('yookassa', 'stripe')
    `);

    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid,
        "provider" "payment_provider_enum" NOT NULL DEFAULT 'yookassa',
        "externalId" character varying NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        "currency" character varying NOT NULL DEFAULT 'RUB',
        "status" "payment_status_enum" NOT NULL DEFAULT 'pending',
        "plan" "subscription_plan_enum" NOT NULL,
        "durationMonths" integer NOT NULL DEFAULT 1,
        "rawPayload" jsonb,
        "description" character varying,
        "paidAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_payments_externalId" UNIQUE ("externalId"),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id"),
        CONSTRAINT "FK_payments_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Indexes for performance
    await queryRunner.query(`CREATE INDEX "IDX_ranges_userId" ON "ranges" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_sessions_userId" ON "sessions" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_query_logs_userId" ON "query_logs" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_query_logs_createdAt" ON "query_logs" ("createdAt")`);
    await queryRunner.query(`CREATE INDEX "IDX_payments_userId" ON "payments" ("userId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "query_logs"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "ranges"`);
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "payment_provider_enum"`);
    await queryRunner.query(`DROP TYPE "payment_status_enum"`);
    await queryRunner.query(`DROP TYPE "query_status_enum"`);
    await queryRunner.query(`DROP TYPE "session_status_enum"`);
    await queryRunner.query(`DROP TYPE "game_type_enum"`);
    await queryRunner.query(`DROP TYPE "action_type_enum"`);
    await queryRunner.query(`DROP TYPE "position_enum"`);
    await queryRunner.query(`DROP TYPE "subscription_status_enum"`);
    await queryRunner.query(`DROP TYPE "subscription_plan_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}