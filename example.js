const wakeful = require("./index");

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
