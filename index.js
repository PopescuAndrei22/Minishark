const getOperation = require("./build/Release/operations");

let result;

console.log("Result of C++ function:");
result = getOperation(2, 7);
console.log(result);
