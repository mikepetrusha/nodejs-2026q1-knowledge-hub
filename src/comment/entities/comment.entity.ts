import { UUID } from 'node:crypto';

export class Comment {
  id: UUID;
  content: string;
  articleId: UUID;
  authorId: UUID | null;
  createdAt: number;
}
