import { IsEnum, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { ArticleStatus } from '../entities/article.entity';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindArticleDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsIn([
    'id',
    'title',
    'status',
    'authorId',
    'categoryId',
    'createdAt',
    'updatedAt',
  ])
  sortBy?:
    | 'id'
    | 'title'
    | 'status'
    | 'authorId'
    | 'categoryId'
    | 'createdAt'
    | 'updatedAt';
}
