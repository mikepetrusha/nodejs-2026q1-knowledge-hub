export interface PaginatedResult<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const paginateArray = <T>(
  items: T[],
  page?: number,
  limit?: number,
): PaginatedResult<T> => {
  const resolvedPage = Math.max(1, page ?? DEFAULT_PAGE);
  const resolvedLimit = Math.min(
    MAX_LIMIT,
    Math.max(1, limit ?? DEFAULT_LIMIT),
  );
  const total = items.length;
  const start = (resolvedPage - 1) * resolvedLimit;
  const data = items.slice(start, start + resolvedLimit);

  return {
    total,
    page: resolvedPage,
    limit: resolvedLimit,
    data,
  };
};
