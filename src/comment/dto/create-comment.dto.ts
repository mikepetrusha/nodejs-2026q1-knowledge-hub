import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'node:crypto';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  articleId: UUID;

  @IsOptional()
  @IsUUID()
  authorId: UUID | null;
}
