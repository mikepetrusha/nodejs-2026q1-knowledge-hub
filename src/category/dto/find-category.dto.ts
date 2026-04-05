import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindCategoryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['id', 'name', 'description'])
  sortBy?: 'id' | 'name' | 'description';
}
