/**
 * SFTPGo teilt sich die Datenbank mit der App und legt seine Tabellen ggf. vor
 * dem ersten `prisma migrate deploy` an. Prisma wertet eine nicht-leere DB ohne
 * Migrationstabelle als "nicht gebaselined" (P3005). Eine leere Migrationstabelle
 * vorab anzulegen entspricht exakt dem Zustand "0 Migrationen angewendet" und
 * laesst `migrate deploy` normal laufen.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" VARCHAR(36) PRIMARY KEY NOT NULL,
      "checksum" VARCHAR(64) NOT NULL,
      "finished_at" TIMESTAMPTZ,
      "migration_name" VARCHAR(255) NOT NULL,
      "logs" TEXT,
      "rolled_back_at" TIMESTAMPTZ,
      "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    );
  `);
} finally {
  await prisma.$disconnect();
}
