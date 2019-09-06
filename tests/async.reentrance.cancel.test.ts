﻿import test from "ava";
import { Transaction, ReentrantCall, Cache, cacheof, all, sleep, Dbg } from "../src/z.index";
import { trace } from "./common";
import { DemoModel, DemoView, mon, output } from "./async";

const requests: Array<{ url: string, delay: number }> = [
  { url: "google.com", delay: 300 },
  { url: "microsoft.com", delay: 200 },
  { url: "nezaboodka.com", delay: 500 },
];

const expected: string[] = [
  "Url: reactronic",
  "Log: RTA",
  "[...] Url: reactronic",
  "[...] Log: RTA",
  "Url: nezaboodka.com",
  "Log: RTA, nezaboodka.com/500",
];

test("async", async t => {
  trace();
  const app = Transaction.run(() => new DemoView(new DemoModel()));
  cacheof(app.model.load).configure({reentrant: ReentrantCall.CancelPrevious});
  try {
    t.throws(() => { app.test = "testing @stateful for fields"; }, "stateful properties can only be modified inside transaction");
    await app.print(); // trigger first run
    const responses = requests.map(x => app.model.load(x.url, x.delay));
    t.is(mon.counter, 3);
    t.is(mon.workers.size, 3);
    await all(responses);
  }
  catch (error) { /* istanbul ignore next */
    output.push(error.toString()); /* istanbul ignore next */
    if (!Dbg.trace.silent) console.log(error.toString());
  }
  finally {
    t.is(mon.counter, 0);
    t.is(mon.workers.size, 0);
    await sleep(400);
    await Cache.unmount(app, app.model).whenFinished(true);
  } /* istanbul ignore next */
  if (!Dbg.trace.silent) {
    console.log("\nResults:\n");
    for (const x of output)
      console.log(x);
    console.log("\n");
  }
  const n: number = Math.max(output.length, expected.length);
  for (let i = 0; i < n; i++) { /* istanbul ignore next */
    if (!Dbg.trace.silent) console.log(`actual[${i}] = ${output[i]}, expected[${i}] = ${expected[i]}`);
    t.is(output[i], expected[i]);
  }
});
