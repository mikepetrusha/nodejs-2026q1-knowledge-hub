import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ArticleService } from '../article/article.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { randomUUID, UUID } from 'node:crypto';
import { Comment } from './entities/comment.entity';
import { FindCommentDto } from './dto/find-comment.dto';
import { PaginatedFindCommentDto } from './dto/paginated-find-comment.dto';
import { paginateArray } from '../common/utils/paginate';
import { sortItems } from '../common/utils/sort';

@Injectable()
export class CommentService {
  private comments: Comment[] = [];

  constructor(
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    if (!this.articleService.exists(createCommentDto.articleId)) {
      throw new UnprocessableEntityException('Article not found');
    }
    const comment: Comment = {
      id: randomUUID(),
      content: createCommentDto.content,
      articleId: createCommentDto.articleId,
      authorId: createCommentDto.authorId,
      createdAt: Date.now(),
    };
    this.comments.push(comment);
    return comment;
  }

  findAll(query: FindCommentDto) {
    return this.comments.filter(
      (comment) => comment.articleId === query.articleId,
    );
  }

  findAllPaginated(query: PaginatedFindCommentDto) {
    const filtered = this.comments.filter(
      (comment) => comment.articleId === query.articleId,
    );
    const ordered = query.sortBy
      ? sortItems(filtered, query.sortBy, query.order ?? 'ASC')
      : filtered;
    return paginateArray(ordered, query.page, query.limit);
  }

  findOne(id: UUID) {
    const comment = this.comments.find((comment) => comment.id === id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  remove(id: UUID) {
    const comment = this.comments.find((comment) => comment.id === id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    this.comments = this.comments.filter((comment) => comment.id !== id);
  }

  removeByArticleId(articleId: UUID) {
    this.comments = this.comments.filter(
      (comment) => comment.articleId !== articleId,
    );
  }

  removeByAuthorId(authorId: UUID) {
    this.comments = this.comments.filter(
      (comment) => comment.authorId !== authorId,
    );
  }
}
