import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from '../article/article.service';
import { CommentService } from '../comment/comment.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: ArticleService,
          useValue: { clearAuthorId: jest.fn() },
        },
        {
          provide: CommentService,
          useValue: { removeByAuthorId: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
