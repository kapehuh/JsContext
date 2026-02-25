//PR
// function ForceConstructor(name, age, city) {
//   if (!(this instanceof ForceConstructor)) {
//     return new ForceConstructor(...arguments);
//   }

//   const paramNames = ForceConstructor.getParamNames();
//   for (let i = 0; i < arguments.length; i++) {
//     const paramName = paramNames[i];
//     if (paramName) {
//       this[paramName] = arguments[i];
//     }
//   }
// }

// // метод для извлечения имён параметров из строки функции
// ForceConstructor.getParamNames = function () {
//   const fnStr = ForceConstructor.toString();
//   // Регулярное выражение для поиска параметров между скобками
//   const argsMatch = fnStr.match(/^function\s*[^(]*\(\s*([^)]*)\)/m);
//   if (!argsMatch) return [];
//   const argsString = argsMatch[1];
//   // Разделяем по запятой, удаляем пробелы, фильтруем пустые строки
//   return argsString
//     .split(",")
//     .map((arg) => arg.trim())
//     .filter((arg) => arg);
// };

// module.exports = ForceConstructor;
