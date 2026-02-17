const curry = require("./curry");

describe("curry", () => {
  test("curry sum2", () => {
    const sum2 = (x, y) => x + y;
    const curriedSum = curry(sum2);
    expect(curriedSum(1)(2)).toBe(3);
  });

  test("curry sum4", () => {
    const sum4 = (a, b, c, d) => a + b + c + d;
    const curriedSum = curry(sum4);
    expect(curriedSum(2)(3)(4)(5)).toBe(14);
  });

  test("curry returns functions until enough args", () => {
    const sum3 = (a, b, c) => a + b + c;
    const curried = curry(sum3);
    const step1 = curried(1);
    expect(typeof step1).toBe("function");
    const step2 = step1(2);
    expect(typeof step2).toBe("function");
    const result = step2(3);
    expect(result).toBe(6);
  });

  test("curry works with context", () => {
    function greet(greeting, name) {
      return `${greeting}, ${name}! My age is ${this.age}`;
    }
    const obj = { age: 30 };
    const curriedGreet = curry(greet);
    const result = curriedGreet("Hello").call(obj, "Alice");
    expect(result).toBe("Hello, Alice! My age is 30");
  });

  test("curry with function of zero arguments", () => {
    const fn = () => 42;
    const curried = curry(fn);
    expect(curried()).toBe(42);
    expect(curried(123)).toBe(42); // лишний арг игнорируется
  });

  test("curry with function that has default parameters (length is 1)", () => {
    const fn = (x, y = 10) => x + y;
    expect(fn.length).toBe(1);
    const curried = curry(fn);
    expect(curried(5)).toBe(15);
    expect(() => curried(5)(20)).toThrow();
  });

  test("curry with multiple arguments at once (first call gets more than one)", () => {
    const sum2 = (x, y) => x + y;
    const curried = curry(sum2);
    const step = curried(1, 2); // берётся только первый аргумент
    expect(typeof step).toBe("function");
    expect(step(2)).toBe(3);
  });
});
