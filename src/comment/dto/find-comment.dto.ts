import { IsIn, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { UUID } from 'node:crypto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindCommentDto extends PaginationQueryDto {
  @IsUUID()
  @IsNotEmpty()
  articleId: UUID;

  @IsOptional()
  @IsIn(['id', 'content', 'articleId', 'authorId', 'createdAt'])
  sortBy?: 'id' | 'content' | 'articleId' | 'authorId' | 'createdAt';
}
