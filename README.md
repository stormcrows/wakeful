# wakeful

[![CircleCI](https://circleci.com/gh/stormcrows/wakeful/tree/master.svg?style=svg)](https://circleci.com/gh/stormcrows/wakeful/tree/master)

Async sentry that allows a clean breakout from long await when program's state changes.

It was built for a service that slept long times between activities
and needed to be interrupted gracefully.

What it does: Async timer/sentry asserting predicate at intervals and stops/rejects with an errMsg if predicate returns false otherwise resolves with okMsg after timeMs.

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
const wakeful = require("wakeful");

let serviceRunning = true;
// we'll change the state of the service after 6s
wakeful(6000).then(() => (serviceRunning = false));

// the idea here is to stop the timeout gracefully without exceptions,
// and exit the loop of the program while it's in "sleep" mode
(async () => {
    const errMsg = "interruption!"; // custom err message
    const predicate = () => serviceRunning; // all's good until false
    const interval = 1250; // default is 1000ms
    try {
        do {
            process.stdout.write("doing stuff...");
            await wakeful(2500, { predicate, errMsg, interval });
        } while (true);
    } catch (err) {
        if (err === errMsg) {
            process.stdout.write("program terminated gracefully!");
        } else {
            process.stdout.write(err.stack);
        }
    }
})();

```
