import { Module } from '@nestjs/common';
import { ArticleModule } from '../article/article.module';
import { CommentModule } from '../comment/comment.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [ArticleModule, CommentModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
