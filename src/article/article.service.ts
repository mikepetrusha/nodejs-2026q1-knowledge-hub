import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { randomUUID, UUID } from 'node:crypto';
import { FindArticleDto } from './dto/find-article.dto';

@Injectable()
export class ArticleService {
  private articles: Article[] = [];

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
    return this.articles.filter((article) => {
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
    this.articles = this.articles.filter((article) => article.id !== id);
  }
}
