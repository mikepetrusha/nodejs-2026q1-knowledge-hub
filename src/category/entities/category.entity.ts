import { UUID } from 'node:crypto';

export class Category {
  id: UUID;
  name: string;
  description: string;
}
