//PR
function User() {
  this.name = "";
  this.age = null;
}

User.prototype.askName = function () {
  this.name = "Boris";
  return this; // возвращаем объект для цепочки
};

User.prototype.askAge = function () {
  this.age = 31;
  return this;
};

User.prototype.showAge = function () {
  console.log("Возраст: " + this.age);
  return this;
};

User.prototype.showName = function () {
  console.log("Имя: " + this.name);
  return this;
};

module.exports = User;
