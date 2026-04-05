import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  ParseUUIDPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UUID } from 'node:crypto';
import { FindCommentDto } from './dto/find-comment.dto';
import { PaginatedFindCommentDto } from './dto/paginated-find-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll(@Query() findCommentDto: FindCommentDto) {
    return this.commentService.findAll(findCommentDto);
  }

  @Get('paginated')
  findAllPaginated(@Query() query: PaginatedFindCommentDto) {
    return this.commentService.findAllPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.commentService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.commentService.remove(id);
  }
}
