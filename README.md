# wakeful

[![CircleCI](https://circleci.com/gh/stormcrows/wakeful/tree/master.svg?style=svg)](https://circleci.com/gh/stormcrows/wakeful/tree/master)

Async timer/sentry asserting predicate at intervals and stops/rejects with an errMsg if predicate returns false otherwise resolves with okMsg after timeMs.

It was built for a service that slept long times between activities
and needed to be interrupted gracefully.

### arguments

wakeful uses these default arguments:

- timeMs = 0,

- options: { 
    predicate: () => true, 
    interval: 1000, 
    okMsg: "ok", 
    errMsg: "err"
  }

**timeMs** = 0 -> means that wakeful will resolve immedietaly,<br />
  * you can use *Infinity* value if you'd like it to work forever<br />

**predicate** -> function that returns boolean; it can check an external condition<br />
**interval** -> how often wakeful should check the predicate, default: 1000ms<br />
**errMsg** -> message to be triggered on reject(errMsg),<br />
**okMsg** -> message to be triggered on resolve(okMsg)<br />
<br />
wakeful supports Browser, Node.js & AMD.


## USAGE

Refer to **index.spec.js** for Node.js/jest async tests

```javascript
const wakeful = require("./index");

let serviceRunning = true;
const stopService = () => (serviceRunning = false);

wakeful(5000).then(stopService);

wakeful(Infinity, {
  predicate: () => serviceRunning,
  okMsg: "slept through infinity!",
  errMsg: "interruption!",
  interval: 1000
})
  .then(ok => process.stdout.write(ok))
  .catch(err => process.stderr.write(err));

// this program will output "interruption!" after 5s
```
