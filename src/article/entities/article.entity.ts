import { UUID } from 'node:crypto';

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export class Article {
  id: UUID;
  title: string;
  content: string;
  status: ArticleStatus;
  authorId: UUID | null;
  categoryId: UUID | null;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}
