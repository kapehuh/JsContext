//PR
// user.test.js
// const User = require("./user");

// describe("User chain", () => {
//   let user;
//   let consoleSpy;

//   beforeEach(() => {
//     user = new User();
//     consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
//   });

//   afterEach(() => {
//     consoleSpy.mockRestore();
//   });

//   test("askName with no argument should set default name", () => {
//     user.askName();
//     expect(user.name).toBe("Boris");
//   });

//   test("askAge with no argument should set default age", () => {
//     user.askAge();
//     expect(user.age).toBe(31);
//   });

//   test("showAgeInConsole should log age and return this", () => {
//     const result = user.askAge().showAge();
//     expect(consoleSpy).toHaveBeenCalledWith("Возраст: 31");
//     expect(result).toBe(user);
//   });

//   test("showNameInAlert should log name and return this", () => {
//     const result = user.askName().showName();
//     expect(consoleSpy).toHaveBeenCalledWith("Имя: Boris");
//     expect(result).toBe(user);
//   });

//   test("full chain should work", () => {
//     user.askName().askAge().showAge().showName();
//     expect(user.name).toBe("Boris");
//     expect(user.age).toBe(31);
//     expect(consoleSpy).toHaveBeenCalledTimes(2);
//     expect(consoleSpy).toHaveBeenCalledWith("Возраст: 31");
//     expect(consoleSpy).toHaveBeenCalledWith("Имя: Boris");
//   });
// });
