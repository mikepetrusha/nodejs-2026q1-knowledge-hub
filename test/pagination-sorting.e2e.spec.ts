import { StatusCodes } from 'http-status-codes';
import { request } from './lib';
import {
  getTokenAndUserId,
  shouldAuthorizationBeTested,
  removeTokenUser,
} from './utils';
import {
  articlesRoutes,
  commentsRoutes,
  usersRoutes,
} from './endpoints';

const baseArticle = {
  content: 'Pagination e2e body',
  status: 'draft' as const,
  authorId: null,
  categoryId: null,
};

describe('Pagination and sorting (e2e)', () => {
  const unauthorizedRequest = request;
  const commonHeaders: Record<string, string> = { Accept: 'application/json' };
  let mockUserId: string | undefined;

  beforeAll(async () => {
    if (shouldAuthorizationBeTested) {
      const result = await getTokenAndUserId(unauthorizedRequest);
      commonHeaders['Authorization'] = result.token;
      mockUserId = result.mockUserId;
    }
  });

  afterAll(async () => {
    if (mockUserId) {
      await removeTokenUser(unauthorizedRequest, mockUserId, commonHeaders);
    }
    if (commonHeaders['Authorization']) {
      delete commonHeaders['Authorization'];
    }
  });

  describe('GET /article/paginated', () => {
    const tag = `e2e-pag-articles-${Date.now()}`;
    const titles = [
      'Pag-Beta-Article',
      'Pag-Alpha-Article',
      'Pag-Gamma-Article',
    ];
    let createdIds: string[];

    beforeAll(async () => {
      createdIds = [];
      for (const title of titles) {
        const res = await unauthorizedRequest
          .post(articlesRoutes.create)
          .set(commonHeaders)
          .send({ ...baseArticle, title, tags: [tag] });
        expect(res.status).toBe(StatusCodes.CREATED);
        createdIds.push(res.body.id);
      }
    });

    afterAll(async () => {
      for (const id of createdIds) {
        await unauthorizedRequest
          .delete(articlesRoutes.delete(id))
          .set(commonHeaders);
      }
    });

    it('returns a paginated envelope with totals matching the filter', async () => {
      const response = await unauthorizedRequest
        .get(articlesRoutes.getPaginated)
        .query({ tag })
        .set(commonHeaders);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toMatchObject({
        total: 3,
        page: 1,
        limit: 10,
      });
      expect(response.body.data).toHaveLength(3);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('honors limit and page for the same filtered set', async () => {
      const first = await unauthorizedRequest
        .get(articlesRoutes.getPaginated)
        .query({ tag, limit: 2, page: 1 })
        .set(commonHeaders);
      expect(first.status).toBe(StatusCodes.OK);
      expect(first.body.data).toHaveLength(2);
      expect(first.body.total).toBe(3);

      const second = await unauthorizedRequest
        .get(articlesRoutes.getPaginated)
        .query({ tag, limit: 2, page: 2 })
        .set(commonHeaders);
      expect(second.status).toBe(StatusCodes.OK);
      expect(second.body.data).toHaveLength(1);
      expect(second.body.total).toBe(3);

      const idsPage1 = new Set(
        first.body.data.map((a: { id: string }) => a.id),
      );
      for (const row of second.body.data) {
        expect(idsPage1.has(row.id)).toBe(false);
      }
    });

    it('sorts by title ascending and descending', async () => {
      const asc = await unauthorizedRequest
        .get(articlesRoutes.getPaginated)
        .query({ tag, sortBy: 'title', order: 'ASC' })
        .set(commonHeaders);
      expect(asc.status).toBe(StatusCodes.OK);
      const ascTitles = asc.body.data.map((a: { title: string }) => a.title);
      expect(ascTitles).toEqual(
        [...ascTitles].sort((a, b) => a.localeCompare(b)),
      );

      const desc = await unauthorizedRequest
        .get(articlesRoutes.getPaginated)
        .query({ tag, sortBy: 'title', order: 'DESC' })
        .set(commonHeaders);
      expect(desc.status).toBe(StatusCodes.OK);
      const descTitles = desc.body.data.map((a: { title: string }) => a.title);
      expect(descTitles).toEqual(
        [...descTitles].sort((a, b) => b.localeCompare(a)),
      );
    });

    it('rejects invalid pagination and sort parameters', async () => {
      const badPage = await unauthorizedRequest
        .get(articlesRoutes.getPaginated)
        .query({ tag, page: 0 })
        .set(commonHeaders);
      expect(badPage.status).toBe(StatusCodes.BAD_REQUEST);

      const badSort = await unauthorizedRequest
        .get(articlesRoutes.getPaginated)
        .query({ tag, sortBy: 'not-a-field' })
        .set(commonHeaders);
      expect(badSort.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('GET /comment/paginated', () => {
    const tag = `e2e-pag-comments-${Date.now()}`;
    let articleId: string;

    beforeAll(async () => {
      const articleRes = await unauthorizedRequest
        .post(articlesRoutes.create)
        .set(commonHeaders)
        .send({
          ...baseArticle,
          title: 'Pag-Comment-Host',
          tags: [tag],
        });
      expect(articleRes.status).toBe(StatusCodes.CREATED);
      articleId = articleRes.body.id;

      const contents = ['ccc-comment', 'aaa-comment', 'bbb-comment'];
      for (const content of contents) {
        const res = await unauthorizedRequest
          .post(commentsRoutes.create)
          .set(commonHeaders)
          .send({ content, articleId, authorId: null });
        expect(res.status).toBe(StatusCodes.CREATED);
      }
    });

    afterAll(async () => {
      await unauthorizedRequest
        .delete(articlesRoutes.delete(articleId))
        .set(commonHeaders);
    });

    it('paginates and sorts comments for an article by content', async () => {
      const response = await unauthorizedRequest
        .get(commentsRoutes.getPaginated)
        .query({
          articleId,
          sortBy: 'content',
          order: 'ASC',
          limit: 2,
          page: 1,
        })
        .set(commonHeaders);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.total).toBe(3);
      expect(response.body.data).toHaveLength(2);
      expect(
        response.body.data[0].content < response.body.data[1].content,
      ).toBe(true);

      const page2 = await unauthorizedRequest
        .get(commentsRoutes.getPaginated)
        .query({
          articleId,
          sortBy: 'content',
          order: 'ASC',
          limit: 2,
          page: 2,
        })
        .set(commonHeaders);
      expect(page2.status).toBe(StatusCodes.OK);
      expect(page2.body.data).toHaveLength(1);
      expect(page2.body.data[0].content).toBe('ccc-comment');
    });
  });

  describe('GET /user/paginated', () => {
    const suffix = `${Date.now()}`;
    const loginA = `pag_sort_a_${suffix}`;
    const loginZ = `pag_sort_z_${suffix}`;
    const password = 'TEST_PASSWORD';
    let userIdA: string;
    let userIdZ: string;

    beforeAll(async () => {
      const resA = await unauthorizedRequest
        .post(usersRoutes.create)
        .set(commonHeaders)
        .send({ login: loginA, password });
      const resZ = await unauthorizedRequest
        .post(usersRoutes.create)
        .set(commonHeaders)
        .send({ login: loginZ, password });
      expect(resA.status).toBe(StatusCodes.CREATED);
      expect(resZ.status).toBe(StatusCodes.CREATED);
      userIdA = resA.body.id;
      userIdZ = resZ.body.id;
    });

    afterAll(async () => {
      await unauthorizedRequest
        .delete(usersRoutes.delete(userIdA))
        .set(commonHeaders);
      await unauthorizedRequest
        .delete(usersRoutes.delete(userIdZ))
        .set(commonHeaders);
    });

    it('returns paginated users without passwords and rejects over-max limit', async () => {
      const ok = await unauthorizedRequest
        .get(usersRoutes.getPaginated)
        .query({ limit: 10, page: 1 })
        .set(commonHeaders);
      expect(ok.status).toBe(StatusCodes.OK);
      expect(ok.body).toMatchObject({
        total: expect.any(Number),
        page: 1,
        limit: 10,
      });
      expect(Array.isArray(ok.body.data)).toBe(true);
      for (const row of ok.body.data) {
        expect(row).not.toHaveProperty('password');
      }

      const badLimit = await unauthorizedRequest
        .get(usersRoutes.getPaginated)
        .query({ limit: 101 })
        .set(commonHeaders);
      expect(badLimit.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('orders users by login when sortBy is set', async () => {
      const response = await unauthorizedRequest
        .get(usersRoutes.getPaginated)
        .query({ sortBy: 'login', order: 'ASC', limit: 100, page: 1 })
        .set(commonHeaders);

      expect(response.status).toBe(StatusCodes.OK);
      const logins = response.body.data.map((u: { login: string }) => u.login);
      const idxA = logins.indexOf(loginA);
      const idxZ = logins.indexOf(loginZ);
      expect(idxA).toBeGreaterThanOrEqual(0);
      expect(idxZ).toBeGreaterThanOrEqual(0);
      expect(idxA).toBeLessThan(idxZ);
    });
  });
});
