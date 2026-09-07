/**
 * Minimaler Testlaeufer.
 *
 * `@playwright/test` ist keine Abhaengigkeit dieses Projekts und CLAUDE.md
 * verbietet neue Pakete. Die Bibliothek `playwright` ist vorhanden – dieser
 * Laeufer stellt das Wenige bereit, das an `@playwright/test` fehlt:
 * Gruppierung, Zusicherungen und eine Zusammenfassung.
 */

export const BASE = process.env.BASE_URL ?? "http://localhost:3400";

const suites = [];
let current = null;

export function describe(name, fn) {
  current = { name, tests: [] };
  suites.push(current);
  fn();
  current = null;
}

export function it(name, fn) {
  if (!current) throw new Error(`it("${name}") ausserhalb von describe()`);
  current.tests.push({ name, fn });
}

class AssertionError extends Error {}

export function expect(actual) {
  const fail = (msg) => {
    throw new AssertionError(msg);
  };
  return {
    toBe(want) {
      if (actual !== want) fail(`erwartet ${JSON.stringify(want)}, tatsaechlich ${JSON.stringify(actual)}`);
    },
    toEqual(want) {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(want);
      if (a !== b) fail(`erwartet ${b}, tatsaechlich ${a}`);
    },
    toContain(part) {
      if (!String(actual).includes(part)) {
        fail(`erwartet, dass ${JSON.stringify(String(actual).slice(0, 300))} "${part}" enthaelt`);
      }
    },
    toBeGreaterThan(n) {
      if (!(actual > n)) fail(`erwartet > ${n}, tatsaechlich ${actual}`);
    },
    toBeGreaterThanOrEqual(n) {
      if (!(actual >= n)) fail(`erwartet >= ${n}, tatsaechlich ${actual}`);
    },
    toBeLessThan(n) {
      if (!(actual < n)) fail(`erwartet < ${n}, tatsaechlich ${actual}`);
    },
    toBeLessThanOrEqual(n) {
      if (!(actual <= n)) fail(`erwartet <= ${n}, tatsaechlich ${actual}`);
    },
    toBeTruthy() {
      if (!actual) fail(`erwartet wahr, tatsaechlich ${JSON.stringify(actual)}`);
    },
    toBeFalsy() {
      if (actual) fail(`erwartet falsch, tatsaechlich ${JSON.stringify(actual)}`);
    },
  };
}

/** Fuehrt alle registrierten Suiten aus. `make` liefert den Testkontext. */
export async function run(make, teardown) {
  const results = { passed: 0, failed: [], total: 0 };
  const only = process.env.ONLY;

  for (const suite of suites) {
    if (only && !suite.name.toLowerCase().includes(only.toLowerCase())) continue;
    console.log(`\n\x1b[1m${suite.name}\x1b[0m`);
    for (const test of suite.tests) {
      results.total += 1;
      const ctx = await make();
      const started = Date.now();
      try {
        await test.fn(ctx);
        results.passed += 1;
        console.log(`  \x1b[32m✓\x1b[0m ${test.name} \x1b[2m(${Date.now() - started} ms)\x1b[0m`);
      } catch (error) {
        results.failed.push({ suite: suite.name, test: test.name, error });
        console.log(`  \x1b[31m✗\x1b[0m ${test.name}`);
        console.log(`      \x1b[31m${String(error.message).split("\n").join("\n      ")}\x1b[0m`);
      } finally {
        await ctx.close?.().catch(() => {});
      }
    }
  }

  await teardown?.();

  console.log(
    `\n\x1b[1mErgebnis:\x1b[0m ${results.passed}/${results.total} grün, ` +
      `${results.failed.length} Fehlschläge`,
  );
  if (results.failed.length) {
    console.log("\n\x1b[1mFehlschläge im Einzelnen\x1b[0m");
    for (const f of results.failed) {
      console.log(`  • [${f.suite}] ${f.test}\n      ${f.error.message}`);
    }
  }
  return results;
}
