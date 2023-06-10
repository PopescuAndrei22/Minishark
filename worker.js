const { parentPort, workerData } = require('worker_threads');
const getPcapData = require("./NAPI/build/Release/operations");

const index = workerData.index;
const indexInterface = workerData.indexInterface;

function checkDivisibility() {
  let i = 0;
  while (true) {
    if (i % 10000000 === 0) {
      let result = getPcapData.OperationsLiveCapture(parseInt(indexInterface));
      parentPort.postMessage(result);
    }
    i++;
  }
}

checkDivisibility();