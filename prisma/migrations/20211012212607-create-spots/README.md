# Migration `20211012212607-create-spots`

This migration has been generated by nyan9 at 10/12/2021, 5:26:07 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "spots" (
"id" SERIAL,
    "user_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "appetizer" TEXT NOT NULL,
    "entree" TEXT NOT NULL,
    "drink" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
)

CREATE INDEX "spots.userId" ON "spots"("user_id")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20211012212607-create-spots
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,28 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Spot {
+  id Int @id @default(autoincrement())
+  userId String @map(name: "user_id")
+  address String
+  latitude Float
+  longitude Float
+  appetizer String
+  entree String
+  drink String
+  image String
+  createdAt DateTime @default(now()) @map(name: "created_at")
+  updatedAt DateTime @default(now()) @map(name: "updated_at")
+
+  @@index([userId], name: "spots.userId")
+  @@map(name: "spots")
+}
```


