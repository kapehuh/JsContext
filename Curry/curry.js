//PR
// function curry(fn) {
//   const arity = fn.length;
//   if (arity === 0) return fn;

//   function curried(prevArgs) {
//     return function (arg) {
//       const args = prevArgs.concat(arg);
//       if (args.length === arity) {
//         return fn.apply(this, args);
//       }
//       return curried(args);
//     };
//   }
//   return curried([]);
// }

// module.exports = curry;
