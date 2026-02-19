// serialProcess.js
function serialProcess(array, processor) {
  const results = [];
  let chain = Promise.resolve();

  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    const index = i;

    chain = chain
      .then(() => {
        return new Promise((resolve) => {
          processor(el, index, array, resolve);
        });
      })
      .then((result) => {
        results.push(result);
      });
  }

  return chain.then(() => results);
}

module.exports = serialProcess;
