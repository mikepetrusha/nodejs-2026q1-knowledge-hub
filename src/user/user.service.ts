import { randomUUID, UUID } from 'node:crypto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ArticleService } from '../article/article.service';
import { CommentService } from '../comment/comment.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
import { PaginatedUserQueryDto } from './dto/paginated-user-query.dto';
import { paginateArray } from '../common/utils/paginate';
import { sortItems } from '../common/utils/sort';

@Injectable()
export class UserService {
  private users: User[] = [];

  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      role: createUserDto.role || UserRole.VIEWER,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(user);
    return plainToInstance(User, user);
  }

  findAll() {
    return plainToInstance(User, this.users);
  }

  findAllPaginated(query: PaginatedUserQueryDto) {
    const ordered = query.sortBy
      ? sortItems(this.users, query.sortBy, query.order ?? 'ASC')
      : this.users;
    const { data, total, page, limit } = paginateArray(
      ordered,
      query.page,
      query.limit,
    );
    return {
      total,
      page,
      limit,
      data: plainToInstance(User, data),
    };
  }

  findOne(id: UUID) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(User, user);
  }

  update(id: UUID, updateUserDto: UpdatePasswordDto) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = updateUserDto.newPassword;
    user.updatedAt = Date.now();
    return plainToInstance(User, user);
  }

  remove(id: UUID) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.articleService.clearAuthorId(id);
    this.commentService.removeByAuthorId(id);
    this.users = this.users.filter((user) => user.id !== id);
  }
}
