import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ArticleStatus } from '../entities/article.entity';

export class FindArticleDto {
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}
