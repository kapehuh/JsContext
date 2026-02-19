require("./myBind.js");

const greet = function (greeting, punctuation) {
  return greeting + ", " + this.name + punctuation;
};

const person = { name: "Алиса" };

test("привязка контекста и аргументов", () => {
  const greetAlice = greet.myBind(person, "Привет");
  expect(greetAlice("!")).toBe("Привет, Алиса!");
});

test("вызов без дополнительных аргументов", () => {
  const greetAlice = greet.myBind(person, "Привет", "!");
  expect(greetAlice()).toBe("Привет, Алиса!");
});
