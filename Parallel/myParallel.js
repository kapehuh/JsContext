// Parallel.js
class Parallel {
  constructor(concurrency = Infinity) {
    this.concurrency = concurrency;
    this.tasks = [];
    this.results = [];
    this.running = 0;
    this.completed = 0;
    this.nextIndex = 0;
    this.callback = null;
    this.finished = false; // флаг, предотвращающий повторный вызов callback
  }

  job(fn) {
    this.tasks.push(fn);
    return this;
  }

  done(cb) {
    this.callback = cb;
    this.results = new Array(this.tasks.length);
    this.finished = false;

    // Если задач нет – вызываем колбэк асинхронно с пустым массивом
    if (this.tasks.length === 0) {
      setTimeout(() => {
        if (!this.finished) {
          this.finished = true;
          this.callback([]);
        }
      }, 0);
      return;
    }

    // Запускаем первые задачи, не превышая лимит параллельности
    const initialCount = Math.min(this.concurrency, this.tasks.length);
    for (let i = 0; i < initialCount; i++) {
      this.#runNext();
    }
  }

  #runNext() {
    // Если уже завершили выполнение – ничего не делаем
    if (this.finished) return;

    // Все задачи выполнены – вызываем финальный колбэк (только один раз)
    if (this.completed === this.tasks.length) {
      this.finished = true;
      this.callback(this.results);
      return;
    }

    // Запускаем новые задачи, пока есть свободные слоты и не закончились ожидающие задачи
    while (
      this.running < this.concurrency &&
      this.nextIndex < this.tasks.length &&
      !this.finished
    ) {
      const index = this.nextIndex++;
      const task = this.tasks[index];

      this.running++;

      task((result) => {
        this.results[index] = result;
        this.running--;
        this.completed++;

        // После завершения задачи пытаемся запустить следующую
        this.#runNext();
      });
    }
  }
}

module.exports = Parallel;
