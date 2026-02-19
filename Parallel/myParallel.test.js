// myParallel.test.js
const Parallel = require("./myParallel");

describe("Parallel", () => {
  // Базовый пример из условия
  test("should execute tasks in parallel and preserve order", (done) => {
    const runner = new Parallel(2);
    const resultsOrder = [];

    runner
      .job((done) => {
        setTimeout(() => {
          resultsOrder.push("A");
          done("A");
        }, 100);
      })
      .job((done) => {
        setTimeout(() => {
          resultsOrder.push("B");
          done("B");
        }, 50);
      })
      .job((done) => {
        setTimeout(() => {
          resultsOrder.push("C");
          done("C");
        }, 10);
      })
      .done((results) => {
        expect(results).toEqual(["A", "B", "C"]);
        // Проверяем, что задачи действительно выполнялись параллельно:
        // A запущена первой, B – второй, C – после завершения B
        expect(resultsOrder).toEqual(["B", "C", "A"]); // порядок завершения не важен, но интересно
        done();
      });
  });

  // Пустой список задач
  test("should handle no tasks (async empty result)", (done) => {
    const runner = new Parallel(2);
    let called = false;

    runner.done((results) => {
      called = true;
      expect(results).toEqual([]);
      done();
    });

    // Проверяем, что колбэк вызван асинхронно (не сразу)
    expect(called).toBe(false);
  });

  // Одна задача
  test("should handle single task", (done) => {
    const runner = new Parallel(2);
    runner
      .job((done) => setTimeout(() => done("only"), 10))
      .done((results) => {
        expect(results).toEqual(["only"]);
        done();
      });
  });

  // Порядок результатов не зависит от времени выполнения
  test("should return results in the order tasks were added", (done) => {
    const runner = new Parallel(3);
    runner
      .job((done) => setTimeout(() => done("first"), 200))
      .job((done) => setTimeout(() => done("second"), 100))
      .job((done) => setTimeout(() => done("third"), 50))
      .done((results) => {
        expect(results).toEqual(["first", "second", "third"]);
        done();
      });
  });

  // Ограничение параллельности (concurrency)
  test("should respect concurrency limit", (done) => {
    const runner = new Parallel(2);
    let running = 0;
    let maxRunning = 0;

    const createTask = (delay, result) => (cb) => {
      running++;
      if (running > maxRunning) maxRunning = running;

      setTimeout(() => {
        running--;
        cb(result);
      }, delay);
    };

    runner
      .job(createTask(100, "A"))
      .job(createTask(100, "B"))
      .job(createTask(100, "C"))
      .job(createTask(100, "D"))
      .done((results) => {
        expect(results).toEqual(["A", "B", "C", "D"]);
        expect(maxRunning).toBeLessThanOrEqual(2);
        done();
      });
  });

  // Без ограничения параллельности (concurrency не указан)
  test("should have no concurrency limit when argument omitted", (done) => {
    const runner = new Parallel(); // без числа
    let running = 0;
    let maxRunning = 0;

    const createTask = (delay, result) => (cb) => {
      running++;
      if (running > maxRunning) maxRunning = running;

      setTimeout(() => {
        running--;
        cb(result);
      }, delay);
    };

    runner
      .job(createTask(50, "A"))
      .job(createTask(50, "B"))
      .job(createTask(50, "C"))
      .done((results) => {
        expect(results).toEqual(["A", "B", "C"]);
        expect(maxRunning).toBe(3); // все три одновременно
        done();
      });
  });

  // Синхронные задачи
  test("should handle synchronous tasks", (done) => {
    const runner = new Parallel(2);
    runner
      .job((done) => done("A"))
      .job((done) => done("B"))
      .job((done) => done("C"))
      .done((results) => {
        expect(results).toEqual(["A", "B", "C"]);
        done();
      });
  });

  // Чейнинг
  test("should support chaining", () => {
    const runner = new Parallel(2);
    const returned = runner.job(() => {}).job(() => {});
    expect(returned).toBe(runner);
  });

  // Когда задач меньше, чем лимит параллельности
  test("should work when tasks count is less than concurrency", (done) => {
    const runner = new Parallel(5);
    runner
      .job((done) => setTimeout(() => done(1), 30))
      .job((done) => setTimeout(() => done(2), 20))
      .done((results) => {
        expect(results).toEqual([1, 2]);
        done();
      });
  });

  // Проверка, что done не вызывается преждевременно
  test("should not call done before all tasks complete", (done) => {
    const runner = new Parallel(2);
    let doneCalled = false;

    runner
      .job((done) => setTimeout(() => done("X"), 50))
      .job((done) => setTimeout(() => done("Y"), 50))
      .done((results) => {
        doneCalled = true;
        expect(results).toEqual(["X", "Y"]);
        done();
      });

    setTimeout(() => {
      expect(doneCalled).toBe(false);
    }, 30);
  });
});
