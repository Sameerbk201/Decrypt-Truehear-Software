/**
 * createSpinner — ultra-light “spinner” that never uses TTY escape codes,
 * so it is safe inside pkg snapshots.  It only prints plain lines.
 *
 * Usage patterns supported
 * ------------------------
 *   // pattern A
 *   const sp = createSpinner('Decrypting...').start();
 *   // ...work...
 *   sp.succeed('Done');
 *
 *   // pattern B
 *   const sp = createSpinner('Working...');
 *   sp.start();              // start later
 *   // ...work...
 *   sp.fail('Oops');
 */
export function createSpinner(text = "") {
  let started = false;
  let ended = false;

  /** prints the initial message once */
  function start(msg = text) {
    if (started || ended) return api;
    console.log(msg);
    started = true;
    return api;
  }

  /** prints a ✔️  line */
  function succeed(msg = "Done") {
    if (ended) return api;
    console.log(`✔️  ${msg}`);
    ended = true;
    return api;
  }

  /** prints a ❌ line */
  function fail(msg = "Failed") {
    if (ended) return api;
    console.log(`❌ ${msg}`);
    ended = true;
    return api;
  }

  /** silently mark spinner ended */
  function stop() {
    ended = true;
    return api;
  }

  const api = { start, succeed, fail, stop };
  return api; // caller decides when to .start()
}
