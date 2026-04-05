import { UUID } from 'node:crypto';
import { ArticleStatus } from '../entities/article.entity';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status: ArticleStatus;

  @IsOptional()
  @IsUUID()
  authorId: UUID | null;

  @IsOptional()
  @IsUUID()
  categoryId: UUID | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
