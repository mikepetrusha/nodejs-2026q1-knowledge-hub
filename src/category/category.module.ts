import { Module } from '@nestjs/common';
import { ArticleModule } from '../article/article.module';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [ArticleModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
