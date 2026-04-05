export type SortOrder = 'ASC' | 'DESC';

export const sortItems = <T extends object>(
  items: T[],
  sortBy: keyof T,
  order: SortOrder = 'ASC',
): T[] => {
  const mult = order === 'DESC' ? -1 : 1;
  return [...items].sort((a, b) => {
    const va = a[sortBy];
    const vb = b[sortBy];
    if (va == null && vb == null) {
      return 0;
    }
    if (va == null) {
      return 1;
    }
    if (vb == null) {
      return -1;
    }
    let cmp: number;
    if (typeof va === 'number' && typeof vb === 'number') {
      cmp = va - vb;
    } else {
      cmp = String(va).localeCompare(String(vb));
    }
    return cmp * mult;
  });
};
