/**
 * Lightweight test doubles for unit-testing controllers in isolation, without a
 * real database or Express runtime.
 *
 * `makeQuery` returns a Mongoose-Query-like object that is both chainable
 * (sort/select/limit/skip/populate/lean all return the same object) and
 * awaitable (it is a thenable resolving to `result`). This lets controller code
 * such as `await Model.find(filter).sort({ createdAt: -1 })` work against a
 * plain mock.
 *
 * `mockReq` / `mockRes` are minimal Express request/response doubles capturing
 * the calls controllers make (status/json/render/redirect/...).
 */

function makeQuery(result) {
  const query = {
    sort: jest.fn(() => query),
    select: jest.fn(() => query),
    limit: jest.fn(() => query),
    skip: jest.fn(() => query),
    populate: jest.fn(() => query),
    lean: jest.fn(() => query),
    exec: jest.fn(() => Promise.resolve(result)),
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
    catch: (cb) => Promise.resolve(result).catch(cb),
    finally: (cb) => Promise.resolve(result).finally(cb),
  };
  return query;
}

function mockRes() {
  const res = {};
  res.statusCode = 200;
  res.headersSent = false;
  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = jest.fn(() => res);
  res.send = jest.fn(() => res);
  res.render = jest.fn(() => res);
  res.redirect = jest.fn(() => res);
  res.setHeader = jest.fn(() => res);
  res.set = jest.fn(() => res);
  res.cookie = jest.fn(() => res);
  res.sendFile = jest.fn(() => res);
  res.locals = {};
  return res;
}

function mockReq(overrides = {}) {
  return {
    body: {},
    params: {},
    query: {},
    session: {},
    cookies: {},
    headers: {},
    protocol: "http",
    originalUrl: "/",
    path: "/",
    get: jest.fn(() => ""),
    ...overrides,
  };
}

module.exports = { makeQuery, mockReq, mockRes };
