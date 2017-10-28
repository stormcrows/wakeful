const wakeful = require("./index");

const random = (min, max) =>
  Math.floor(Math.random() * (max - min - 1)) + min + 1;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

test("should resolve immedietaly if no timeMs provided", () => {
  expect.assertions(1);
  wakeful().then(ok => expect(ok).toBe("ok"));
});

test("should resolve immedietaly when timeMs is negative", () => {
  expect.assertions(1);
  wakeful(-4321).then(ok => expect(ok).toBe("ok"));
});

test("should resolve the promise with default ok message", done => {
  expect.assertions(1);
  const timeMs = random(2000, 5000);
  wakeful(timeMs).then(ok => {
    expect(ok).toBe("ok");
    done();
  });
  jest.runAllTimers();
});

test("should resolve the promise with provided ok message", done => {
  expect.assertions(1);
  const timeMs = random(2000, 5000);
  wakeful(timeMs, { okMsg: "OK!!!" }).then(ok => {
    expect(ok).toBe("OK!!!");
    done();
  });
  jest.runAllTimers();
});

test("should reject the promise with default err message", done => {
  expect.assertions(1);
  const timeMs = random(2000, 5000);
  wakeful(timeMs, { predicate: () => false }).catch(err => {
    expect(err).toBe("err");
    done();
  });
  jest.runAllTimers();
});

test("should reject the promise with provided err message", done => {
  expect.assertions(1);
  const timeMs = random(2000, 5000);
  wakeful(timeMs, { predicate: () => false, errMsg: "ERROR!!!" }).catch(err => {
    expect(err).toBe("ERROR!!!");
    done();
  });
  jest.runAllTimers();
});

test("should reject the promise when predicate turns false", done => {
  expect.assertions(1);
  let counter = 99999;
  const predicate = () => counter-- > 0;
  wakeful(Infinity, {
    predicate,
    errMsg: "INFINITY!!!",
    interval: 1
  }).catch(err => {
    expect(err).toBe("INFINITY!!!");
    done();
  });
  jest.runAllTimers();
});

test("should call predicate at different interval", () => {
  expect.assertions(1);
  const timeMs = 11000;
  const predicate = jest.fn(() => true);

  wakeful(timeMs, { predicate, interval: 100 });
  jest.runAllTimers();

  expect(predicate).toHaveBeenCalledTimes(110);
});
