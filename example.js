const wakeful = require("./index");

let serviceRunning = true;
const stopService = () => (serviceRunning = false);

wakeful(10000).then(stopService);

wakeful(Infinity, {
  predicate: () => serviceRunning,
  okMsg: "sleptWell!",
  errMsg: "interruption!",
  interval: 1000
})
  .then(ok => process.stdout.write(ok))
  .catch(err => process.stderr.write(err));
