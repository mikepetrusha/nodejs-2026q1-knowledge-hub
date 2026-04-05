import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { ArticleService } from '../article/article.service';

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: ArticleService,
          useValue: { exists: jest.fn().mockReturnValue(true) },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
