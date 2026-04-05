import { Exclude } from 'class-transformer';
import { UUID } from 'node:crypto';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}
export class User {
  id: UUID;
  login: string;

  @Exclude()
  password: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}
