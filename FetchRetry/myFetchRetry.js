// fetchRetry.js
async function fetchRetry(url, retries, delay) {
  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url);

      // Считаем успешным только ответ с HTTP-статусом 2xx
      if (response.ok) {
        return response;
      }

      // Если статус не 2xx, запоминаем ошибку и повторяем попытку
      lastError = new Error(`HTTP error ${response.status}`);
    } catch (error) {
      // Сетевая ошибка (fetch выбросил исключение)
      lastError = error;
    }

    // Если это была не последняя попытка, ждём перед следующей
    if (attempt < retries - 1) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Все попытки исчерпаны — выбрасываем последнюю ошибку
  throw lastError;
}

module.exports = fetchRetry;
