import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentService } from '../comment/comment.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { randomUUID, UUID } from 'node:crypto';
import { FindArticleDto } from './dto/find-article.dto';
import { paginateArray } from '../common/utils/paginate';
import { sortItems } from '../common/utils/sort';

@Injectable()
export class ArticleService {
  private articles: Article[] = [];

  constructor(
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    const article: Article = {
      id: randomUUID(),
      title: createArticleDto.title,
      content: createArticleDto.content,
      status: createArticleDto.status,
      authorId: createArticleDto.authorId,
      categoryId: createArticleDto.categoryId,
      tags: createArticleDto.tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.articles.push(article);
    return article;
  }

  findAll(query: FindArticleDto) {
    const filtered = this.articles.filter((article) => {
      if (query.status && article.status !== query.status) {
        return false;
      }
      if (query.categoryId && article.categoryId !== query.categoryId) {
        return false;
      }
      if (query.tag && !article.tags.includes(query.tag)) {
        return false;
      }
      return true;
    });
    const ordered = query.sortBy
      ? sortItems(filtered, query.sortBy, query.order ?? 'ASC')
      : filtered;
    return paginateArray(ordered, query.page, query.limit);
  }

  exists(id: UUID): boolean {
    return this.articles.some((article) => article.id === id);
  }

  clearAuthorId(authorId: UUID) {
    const now = Date.now();
    for (const article of this.articles) {
      if (article.authorId === authorId) {
        article.authorId = null;
        article.updatedAt = now;
      }
    }
  }

  clearCategoryId(categoryId: UUID) {
    const now = Date.now();
    for (const article of this.articles) {
      if (article.categoryId === categoryId) {
        article.categoryId = null;
        article.updatedAt = now;
      }
    }
  }

  findOne(id: UUID) {
    const article = this.articles.find((article) => article.id === id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  update(id: UUID, updateArticleDto: UpdateArticleDto) {
    const article = this.articles.find((article) => article.id === id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    Object.assign(article, updateArticleDto);
    article.updatedAt = Date.now();
    return article;
  }

  remove(id: UUID) {
    const article = this.articles.find((article) => article.id === id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    this.commentService.removeByArticleId(id);
    this.articles = this.articles.filter((article) => article.id !== id);
  }
}
