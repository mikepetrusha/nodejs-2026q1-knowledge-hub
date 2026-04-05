import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleService } from '../article/article.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { randomUUID, UUID } from 'node:crypto';
import { FindCategoryDto } from './dto/find-category.dto';
import { paginateArray } from '../common/utils/paginate';
import { sortItems } from '../common/utils/sort';

@Injectable()
export class CategoryService {
  private categories: Category[] = [];

  constructor(private readonly articleService: ArticleService) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category: Category = {
      id: randomUUID(),
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    };
    this.categories.push(category);
    return category;
  }

  findAll(query: FindCategoryDto) {
    const ordered = query.sortBy
      ? sortItems(this.categories, query.sortBy, query.order ?? 'ASC')
      : this.categories;
    return paginateArray(ordered, query.page, query.limit);
  }

  findOne(id: UUID) {
    const category = this.categories.find((category) => category.id === id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  update(id: UUID, updateCategoryDto: UpdateCategoryDto) {
    const category = this.categories.find((category) => category.id === id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    Object.assign(category, updateCategoryDto);
    return category;
  }

  remove(id: UUID) {
    const category = this.categories.find((category) => category.id === id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    this.articleService.clearCategoryId(id);
    this.categories = this.categories.filter((category) => category.id !== id);
  }
}
