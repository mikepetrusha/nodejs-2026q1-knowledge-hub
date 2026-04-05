import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindUserDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['id', 'login', 'role', 'createdAt', 'updatedAt'])
  sortBy?: 'id' | 'login' | 'role' | 'createdAt' | 'updatedAt';
}
