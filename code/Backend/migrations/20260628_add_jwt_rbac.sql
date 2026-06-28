DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_auth_users_role') THEN
    CREATE TYPE enum_auth_users_role AS ENUM ('ADMIN', 'DIRECTOR', 'MANAGER', 'TEACHER', 'STUDENT');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_roles_name') THEN
    CREATE TYPE enum_roles_name AS ENUM ('ADMIN', 'DIRECTOR', 'MANAGER', 'TEACHER', 'STUDENT');
  END IF;
END $$;

ALTER TYPE enum_auth_users_role ADD VALUE IF NOT EXISTS 'TEACHER';
ALTER TYPE enum_auth_users_role ADD VALUE IF NOT EXISTS 'STUDENT';
ALTER TYPE enum_roles_name ADD VALUE IF NOT EXISTS 'TEACHER';
ALTER TYPE enum_roles_name ADD VALUE IF NOT EXISTS 'STUDENT';

ALTER TABLE auth_users
ADD COLUMN IF NOT EXISTS role enum_auth_users_role NOT NULL DEFAULT 'MANAGER';

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name enum_roles_name NOT NULL UNIQUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accesses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  resource VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_accesses (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  "accessId" INTEGER NOT NULL REFERENCES accesses(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE ("userId", "accessId")
);

CREATE UNIQUE INDEX IF NOT EXISTS user_accesses_user_id_access_id_unique
ON user_accesses ("userId", "accessId");

INSERT INTO roles (name, "createdAt", "updatedAt")
VALUES
  ('ADMIN', NOW(), NOW()),
  ('DIRECTOR', NOW(), NOW()),
  ('MANAGER', NOW(), NOW()),
  ('TEACHER', NOW(), NOW()),
  ('STUDENT', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

INSERT INTO accesses (name, resource, action, "createdAt", "updatedAt")
VALUES
  ('dashboard:view', 'dashboard', 'view', NOW(), NOW()),
  ('dashboard:create', 'dashboard', 'create', NOW(), NOW()),
  ('dashboard:update', 'dashboard', 'update', NOW(), NOW()),
  ('dashboard:delete', 'dashboard', 'delete', NOW(), NOW()),
  ('dashboard:archive', 'dashboard', 'archive', NOW(), NOW()),
  ('dashboard:approve', 'dashboard', 'approve', NOW(), NOW()),
  ('students:view', 'students', 'view', NOW(), NOW()),
  ('students:create', 'students', 'create', NOW(), NOW()),
  ('students:update', 'students', 'update', NOW(), NOW()),
  ('students:delete', 'students', 'delete', NOW(), NOW()),
  ('students:archive', 'students', 'archive', NOW(), NOW()),
  ('students:approve', 'students', 'approve', NOW(), NOW()),
  ('teachers:view', 'teachers', 'view', NOW(), NOW()),
  ('teachers:create', 'teachers', 'create', NOW(), NOW()),
  ('teachers:update', 'teachers', 'update', NOW(), NOW()),
  ('teachers:delete', 'teachers', 'delete', NOW(), NOW()),
  ('teachers:archive', 'teachers', 'archive', NOW(), NOW()),
  ('teachers:approve', 'teachers', 'approve', NOW(), NOW()),
  ('courses:view', 'courses', 'view', NOW(), NOW()),
  ('courses:create', 'courses', 'create', NOW(), NOW()),
  ('courses:update', 'courses', 'update', NOW(), NOW()),
  ('courses:delete', 'courses', 'delete', NOW(), NOW()),
  ('courses:archive', 'courses', 'archive', NOW(), NOW()),
  ('courses:approve', 'courses', 'approve', NOW(), NOW()),
  ('groups:view', 'groups', 'view', NOW(), NOW()),
  ('groups:create', 'groups', 'create', NOW(), NOW()),
  ('groups:update', 'groups', 'update', NOW(), NOW()),
  ('groups:delete', 'groups', 'delete', NOW(), NOW()),
  ('groups:archive', 'groups', 'archive', NOW(), NOW()),
  ('groups:approve', 'groups', 'approve', NOW(), NOW()),
  ('payments:view', 'payments', 'view', NOW(), NOW()),
  ('payments:create', 'payments', 'create', NOW(), NOW()),
  ('payments:update', 'payments', 'update', NOW(), NOW()),
  ('payments:delete', 'payments', 'delete', NOW(), NOW()),
  ('payments:archive', 'payments', 'archive', NOW(), NOW()),
  ('payments:approve', 'payments', 'approve', NOW(), NOW()),
  ('rooms:view', 'rooms', 'view', NOW(), NOW()),
  ('rooms:create', 'rooms', 'create', NOW(), NOW()),
  ('rooms:update', 'rooms', 'update', NOW(), NOW()),
  ('rooms:delete', 'rooms', 'delete', NOW(), NOW()),
  ('rooms:archive', 'rooms', 'archive', NOW(), NOW()),
  ('rooms:approve', 'rooms', 'approve', NOW(), NOW()),
  ('settings:view', 'settings', 'view', NOW(), NOW()),
  ('settings:create', 'settings', 'create', NOW(), NOW()),
  ('settings:update', 'settings', 'update', NOW(), NOW()),
  ('settings:delete', 'settings', 'delete', NOW(), NOW()),
  ('settings:archive', 'settings', 'archive', NOW(), NOW()),
  ('settings:approve', 'settings', 'approve', NOW(), NOW()),
  ('auth-users:view', 'auth-users', 'view', NOW(), NOW()),
  ('auth-users:create', 'auth-users', 'create', NOW(), NOW()),
  ('auth-users:update', 'auth-users', 'update', NOW(), NOW()),
  ('auth-users:delete', 'auth-users', 'delete', NOW(), NOW()),
  ('auth-users:archive', 'auth-users', 'archive', NOW(), NOW()),
  ('auth-users:approve', 'auth-users', 'approve', NOW(), NOW()),
  ('permissions:view', 'permissions', 'view', NOW(), NOW()),
  ('permissions:create', 'permissions', 'create', NOW(), NOW()),
  ('permissions:update', 'permissions', 'update', NOW(), NOW()),
  ('permissions:delete', 'permissions', 'delete', NOW(), NOW()),
  ('permissions:archive', 'permissions', 'archive', NOW(), NOW()),
  ('permissions:approve', 'permissions', 'approve', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;
