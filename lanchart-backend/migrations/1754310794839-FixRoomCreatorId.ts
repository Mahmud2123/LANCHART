import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRoomCreatorId1754310794839 implements MigrationInterface {
    name = 'FixRoomCreatorId1754310794839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rooms" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "category" varchar NOT NULL, "memberCount" integer NOT NULL DEFAULT (0), "isActive" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "creatorId" integer)`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "roomId" integer)`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "bio" varchar, "status" varchar NOT NULL DEFAULT ('Available'), "avatar" varchar, "isOnline" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_rooms" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "category" varchar NOT NULL, "memberCount" integer NOT NULL DEFAULT (0), "isActive" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "creatorId" integer, CONSTRAINT "FK_ffe6d736746b7177435e97a0fe9" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_rooms"("id", "name", "description", "category", "memberCount", "isActive", "createdAt", "updatedAt", "creatorId") SELECT "id", "name", "description", "category", "memberCount", "isActive", "createdAt", "updatedAt", "creatorId" FROM "rooms"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
        await queryRunner.query(`ALTER TABLE "temporary_rooms" RENAME TO "rooms"`);
        await queryRunner.query(`CREATE TABLE "temporary_messages" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "roomId" integer, CONSTRAINT "FK_4838cd4fc48a6ff2d4aa01aa646" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_aaa8a6effc7bd20a1172d3a3bc8" FOREIGN KEY ("roomId") REFERENCES "rooms" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_messages"("id", "content", "timestamp", "userId", "roomId") SELECT "id", "content", "timestamp", "userId", "roomId" FROM "messages"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`ALTER TABLE "temporary_messages" RENAME TO "messages"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" RENAME TO "temporary_messages"`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "timestamp" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, "roomId" integer)`);
        await queryRunner.query(`INSERT INTO "messages"("id", "content", "timestamp", "userId", "roomId") SELECT "id", "content", "timestamp", "userId", "roomId" FROM "temporary_messages"`);
        await queryRunner.query(`DROP TABLE "temporary_messages"`);
        await queryRunner.query(`ALTER TABLE "rooms" RENAME TO "temporary_rooms"`);
        await queryRunner.query(`CREATE TABLE "rooms" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "category" varchar NOT NULL, "memberCount" integer NOT NULL DEFAULT (0), "isActive" boolean NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "creatorId" integer)`);
        await queryRunner.query(`INSERT INTO "rooms"("id", "name", "description", "category", "memberCount", "isActive", "createdAt", "updatedAt", "creatorId") SELECT "id", "name", "description", "category", "memberCount", "isActive", "createdAt", "updatedAt", "creatorId" FROM "temporary_rooms"`);
        await queryRunner.query(`DROP TABLE "temporary_rooms"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
    }

}
