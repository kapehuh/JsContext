// serialProcess.test.js
const serialProcess = require("./mySerialProcess");

describe("serialProcess", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("should process elements sequentially (one after another)", async () => {
    const order = [];
    const processor = (el, index, list, done) => {
      order.push(`start ${el}`);
      setTimeout(() => {
        order.push(`end ${el}`);
        done(el * 2);
      }, el * 10);
    };

    const promise = serialProcess([3, 1, 2], processor);

    // Ждём микротаск, чтобы первый then выполнился
    await Promise.resolve();
    expect(order).toEqual(["start 3"]);

    // Прошло 30 мс: завершается первый элемент и запускается второй
    await jest.advanceTimersByTimeAsync(30);
    expect(order).toEqual(["start 3", "end 3", "start 1"]);

    // Прошло ещё 10 мс: завершается второй и запускается третий
    await jest.advanceTimersByTimeAsync(10);
    expect(order).toEqual(["start 3", "end 3", "start 1", "end 1", "start 2"]);

    // Прошло ещё 20 мс: завершается третий
    await jest.advanceTimersByTimeAsync(20);
    expect(order).toEqual([
      "start 3",
      "end 3",
      "start 1",
      "end 1",
      "start 2",
      "end 2",
    ]);

    const results = await promise;
    expect(results).toEqual([6, 2, 4]);
  });

  test("should return results in correct order", async () => {
    const processor = (el, index, list, done) => {
      setTimeout(() => done(el * 10), 5);
    };

    const promise = serialProcess([1, 2, 3, 4, 5], processor);

    // Все задачи выполнятся через 5 мс * 5 = 25 мс
    await jest.advanceTimersByTimeAsync(25);
    const results = await promise;
    expect(results).toEqual([10, 20, 30, 40, 50]);
  });

  test("should handle empty array", async () => {
    const processor = jest.fn();
    const results = await serialProcess([], processor);
    expect(results).toEqual([]);
    expect(processor).not.toHaveBeenCalled();
  });

  test("should pass correct arguments to processor", async () => {
    const processor = jest.fn((el, index, list, done) => {
      done(el);
    });

    const list = ["a", "b", "c"];
    await serialProcess(list, processor); // дожидаемся полного завершения

    expect(processor).toHaveBeenCalledTimes(3);
    expect(processor).toHaveBeenNthCalledWith(
      1,
      "a",
      0,
      list,
      expect.any(Function),
    );
    expect(processor).toHaveBeenNthCalledWith(
      2,
      "b",
      1,
      list,
      expect.any(Function),
    );
    expect(processor).toHaveBeenNthCalledWith(
      3,
      "c",
      2,
      list,
      expect.any(Function),
    );
  });

  test("should work with synchronous processor", async () => {
    const processor = (el, index, list, done) => {
      done(el * 2);
    };

    const results = await serialProcess([1, 2, 3], processor);
    expect(results).toEqual([2, 4, 6]);
  });

  test("should handle async processor with different delays", async () => {
    const order = [];
    const processor = (el, index, list, done) => {
      order.push(`process ${el}`);
      // Задержки: для 5 — 0 мс, для 4 — 4 мс, для 3 — 8 мс
      const delay = 20 - el * 4;
      setTimeout(() => {
        order.push(`done ${el}`);
        done(el);
      }, delay);
    };

    const promise = serialProcess([5, 4, 3], processor);

    // Ждём микротаск, чтобы первый then выполнился
    await Promise.resolve();
    // Обрабатываем нулевой таймер первого элемента
    await jest.advanceTimersByTimeAsync(0);
    expect(order).toEqual(["process 5", "done 5", "process 4"]);

    // Прошло 4 мс: завершается второй и запускается третий
    await jest.advanceTimersByTimeAsync(4);
    expect(order).toEqual([
      "process 5",
      "done 5",
      "process 4",
      "done 4",
      "process 3",
    ]);

    // Прошло ещё 8 мс: завершается третий
    await jest.advanceTimersByTimeAsync(8);
    expect(order).toEqual([
      "process 5",
      "done 5",
      "process 4",
      "done 4",
      "process 3",
      "done 3",
    ]);

    const results = await promise;
    expect(results).toEqual([5, 4, 3]);
  });
});
