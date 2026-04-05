import { IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from 'node:crypto';

export class FindCommentDto {
  @IsUUID()
  @IsNotEmpty()
  articleId: UUID;
}
