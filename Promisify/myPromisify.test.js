// promisify.test.js
const promisify = require("./myPromisify"); // путь к вашей функции

describe("promisify", () => {
  // Простая синхронная функция с колбэком (успех)
  test("should resolve with result when callback succeeds", async () => {
    const add = (a, b, cb) => cb(null, a + b);
    const promisifiedAdd = promisify(add);

    await expect(promisifiedAdd(2, 3)).resolves.toBe(5);
  });

  // Синхронная функция с ошибкой
  test("should reject with error when callback fails", async () => {
    const fail = (a, b, cb) => cb("something went wrong");
    const promisifiedFail = promisify(fail);

    await expect(promisifiedFail(2, 3)).rejects.toBe("something went wrong");
  });

  // Асинхронная функция (setTimeout)
  test("should work with async functions", async () => {
    const asyncAdd = (a, b, cb) => {
      setTimeout(() => cb(null, a + b), 10);
    };
    const promisifiedAsyncAdd = promisify(asyncAdd);

    await expect(promisifiedAsyncAdd(2, 3)).resolves.toBe(5);
  });

  // Асинхронная функция с ошибкой
  test("should reject with error from async function", async () => {
    const asyncFail = (a, b, cb) => {
      setTimeout(() => cb("async error"), 10);
    };
    const promisifiedAsyncFail = promisify(asyncFail);

    await expect(promisifiedAsyncFail(2, 3)).rejects.toBe("async error");
  });

  // Передача всех аргументов, включая дополнительные, кроме колбэка
  test("should pass all arguments except callback to original function", async () => {
    const fn = jest.fn((a, b, c, cb) => cb(null, a + b + c));
    const promisifiedFn = promisify(fn);

    await promisifiedFn(1, 2, 3);

    // Проверяем, что функция вызвана с правильными аргументами (колбэк добавляется последним)
    expect(fn).toHaveBeenCalledWith(1, 2, 3, expect.any(Function));
  });

  // Контекст (this) сохраняется
  test("should preserve this context", async () => {
    const obj = {
      multiplier: 10,
      multiply(a, b, cb) {
        cb(null, (a + b) * this.multiplier);
      },
    };

    // Привязываем метод к объекту через promisify
    const promisifiedMultiply = promisify(obj.multiply).bind(obj);

    await expect(promisifiedMultiply(2, 3)).resolves.toBe(50);
  });

  // Обработка null/undefined как отсутствия ошибки
  test("should treat null and undefined as no error", async () => {
    const fnNull = (cb) => cb(null, "result");
    const fnUndefined = (cb) => cb(undefined, "result");

    const promisifiedNull = promisify(fnNull);
    const promisifiedUndefined = promisify(fnUndefined);

    await expect(promisifiedNull()).resolves.toBe("result");
    await expect(promisifiedUndefined()).resolves.toBe("result");
  });

  // Колбэк вызывается с несколькими аргументами после ошибки (например, error, result1, result2)
  test("should resolve with only the first result argument (others ignored)", async () => {
    const multiResult = (cb) => cb(null, 42, "extra", true);
    const promisifiedMulti = promisify(multiResult);

    await expect(promisifiedMulti()).resolves.toBe(42);
  });

  // Если колбэк никогда не вызывается, промис остаётся в ожидании (но тест должен проверить, что промис не резолвится и не реджектится в течение таймаута)
  test("should return a pending promise if callback is never called", () => {
    const neverCall = (cb) => {
      /* ничего не делаем */
    };
    const promisifiedNever = promisify(neverCall);

    const promise = promisifiedNever();
    // Проверяем, что промис не завершился ни успехом, ни ошибкой быстро
    // Используем специальный матчёр или таймеры Jest
    let resolved = false;
    let rejected = false;
    promise
      .then(() => {
        resolved = true;
      })
      .catch(() => {
        rejected = true;
      });

    // Даём немного времени, чтобы убедиться, что ничего не произошло
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(resolved).toBe(false);
        expect(rejected).toBe(false);
        resolve();
      }, 50);
    });
  });

  // Функция может принимать переменное число аргументов (rest)
  test("should handle functions with rest parameters", async () => {
    const sumAll = (...args) => {
      const cb = args.pop(); // последний аргумент - колбэк
      const total = args.reduce((acc, val) => acc + val, 0);
      cb(null, total);
    };
    const promisifiedSumAll = promisify(sumAll);

    await expect(promisifiedSumAll(1, 2, 3, 4)).resolves.toBe(10);
  });

  // Проверка, что возвращается именно промис
  test("should return a promise", () => {
    const fn = (cb) => cb(null, 123);
    const promisified = promisify(fn);
    const result = promisified();
    expect(result).toBeInstanceOf(Promise);
  });
});
