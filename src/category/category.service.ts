import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { randomUUID, UUID } from 'node:crypto';

@Injectable()
export class CategoryService {
  private categories: Category[] = [];

  create(createCategoryDto: CreateCategoryDto) {
    const category: Category = {
      id: randomUUID(),
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    };
    this.categories.push(category);
    return category;
  }

  findAll() {
    return this.categories;
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
    this.categories = this.categories.filter((category) => category.id !== id);
  }
}
