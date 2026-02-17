const ForceConstructor = require("./ForceConstructor");

describe("ForceConstructor", () => {
  test("вызов с new создаёт объект с правильными свойствами", () => {
    const obj = new ForceConstructor("John", 30, "NY");
    expect(obj.name).toBe("John");
    expect(obj.age).toBe(30);
    expect(obj.city).toBe("NY");
    expect(obj instanceof ForceConstructor).toBe(true);
  });

  test("вызов без new тоже создаёт объект с правильными свойствами", () => {
    const obj = ForceConstructor("John", 30, "NY");
    expect(obj.name).toBe("John");
    expect(obj.age).toBe(30);
    expect(obj.city).toBe("NY");
    expect(obj instanceof ForceConstructor).toBe(true);
  });

  test("при неполном наборе аргументов отсутствующие свойства остаются undefined", () => {
    const obj = ForceConstructor("John");
    expect(obj.name).toBe("John");
    expect(obj.age).toBeUndefined();
    expect(obj.city).toBeUndefined();
  });

  test("лишние аргументы игнорируются (не создают свойств)", () => {
    const obj = ForceConstructor("John", 30, "NY", "extra");
    expect(obj.name).toBe("John");
    expect(obj.age).toBe(30);
    expect(obj.city).toBe("NY");
    expect(obj.extra).toBeUndefined();
  });

  test("getParamNames возвращает правильные имена параметров", () => {
    const paramNames = ForceConstructor.getParamNames();
    expect(paramNames).toEqual(["name", "age", "city"]);
  });

  test("созданный объект имеет правильную цепочку прототипов", () => {
    const obj = ForceConstructor("John");
    expect(Object.getPrototypeOf(obj)).toBe(ForceConstructor.prototype);
  });
});
