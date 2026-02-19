Function.prototype.myBind = function (context) {
  // исходная функция
  var fn = this;

  // аргументы при вызове myBind кроме context
  var outerArgs = Array.prototype.slice.call(arguments, 1);

  return function () {
    var innerArgs = Array.prototype.slice.call(arguments);
    var allArgs = outerArgs.concat(innerArgs);
    return fn.apply(context, allArgs);
  };
};
