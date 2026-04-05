import { IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from 'node:crypto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindCommentDto extends PaginationQueryDto {
  @IsUUID()
  @IsNotEmpty()
  articleId: UUID;
}
