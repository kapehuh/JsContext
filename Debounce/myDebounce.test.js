// debounce.test.js
const debounce = require("./myDebounce");

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("should not call function immediately", () => {
    const func = jest.fn();
    const debounced = debounce(func, 1000);

    debounced();
    expect(func).not.toHaveBeenCalled();
  });

  test("should call function after delay", () => {
    const func = jest.fn();
    const debounced = debounce(func, 1000);

    debounced();
    jest.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test("should cancel previous timer on subsequent calls", () => {
    const func = jest.fn();
    const debounced = debounce(func, 1000);

    debounced();
    jest.advanceTimersByTime(500);
    debounced(); // сброс таймера
    jest.advanceTimersByTime(500);
    expect(func).not.toHaveBeenCalled(); // прошло 500 после последнего, недостаточно
    jest.advanceTimersByTime(500);
    expect(func).toHaveBeenCalledTimes(1); // теперь прошло 1000
  });

  test("should pass arguments to original function", () => {
    const func = jest.fn();
    const debounced = debounce(func, 1000);

    debounced("arg1", "arg2");
    jest.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledWith("arg1", "arg2");
  });

  test("should preserve this context", () => {
    const obj = {
      value: 42,
      method: function (cb) {
        cb(this.value);
      },
    };

    const spy = jest.fn();
    const debouncedMethod = debounce(obj.method, 1000);

    debouncedMethod.call(obj, spy);
    jest.advanceTimersByTime(1000);

    expect(spy).toHaveBeenCalledWith(42);
  });

  test("should handle multiple calls with different arguments (last one wins)", () => {
    const func = jest.fn();
    const debounced = debounce(func, 1000);

    debounced("first");
    debounced("second");
    jest.advanceTimersByTime(1000);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith("second");
  });

  test("should not call function if delay is cancelled and not enough time passes", () => {
    const func = jest.fn();
    const debounced = debounce(func, 1000);

    debounced();
    jest.advanceTimersByTime(999);
    debounced(); // сброс
    jest.advanceTimersByTime(999);
    expect(func).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1); // после последнего прошло 1000
    expect(func).toHaveBeenCalledTimes(1);
  });
});
