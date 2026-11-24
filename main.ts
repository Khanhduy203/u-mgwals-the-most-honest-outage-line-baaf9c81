import * as fs from "fs";
import * as path from "path";

// The Most Honest Outage Line — make.fun bounty
// u-mgwals-the-most-honest-outage-line-baaf9c81
//
// Candidates drafted and scored on honesty, status-page voice,
// admitted uncertainty, and tight wording:
//   A (154 chars, CHOSEN): "All of our servers are down, including this
//     status page's backend, so I can't check what's broken yet — I'll
//     update here as soon as I can verify anything."
//     Honesty 9/10, voice 9/10, uncertainty 9/10, tightness 8/10.
//     Strongest: it names the full scope (all servers), admits the
//     status page itself is degraded, and promises an update only
//     once something is actually verified.
//   B (153 chars): "Every server is down right now and I can't reach our
//     monitoring either, so I don't know what failed yet — I'm checking
//     by hand and will post what I find."
//     Honesty 8/10, voice 8/10, uncertainty 9/10, tightness 8/10.
//     "Checking by hand" is vivid, but "every server" reads less like
//     a formal status page than A's "all of our servers".
//   C (153 chars): "All systems are down, including the tools I'd use to
//     diagnose them, so I can't tell you the cause yet — I'll update
//     this page when I know something real."
//     Honesty 8/10, voice 8/10, uncertainty 8/10, tightness 8/10.
//     Punchy ending, but "something real" is vaguer than A's
//     verifiable-update promise, and it never says what is down.

const ENTRY =
  "All of our servers are down, including this status page's backend, so I can't check what's broken yet — I'll update here as soon as I can verify anything.";

const MAX_CHARS = 160;

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir || outDir.trim() === "") {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set or empty");
  }
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (ENTRY.length > MAX_CHARS) {
    throw new Error(
      `entry is ${ENTRY.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (ENTRY !== ENTRY.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "entry.txt");
  fs.writeFileSync(outPath, ENTRY + "\n", "utf8");
  // Read-back check: the file on disk must be exactly the entry plus one
  // trailing newline — a partial or corrupted write must fail loudly
  // instead of silently grading as a wrong entry.
  const written = fs.readFileSync(outPath, "utf8");
  if (written !== ENTRY + "\n") {
    throw new Error(
      `entry.txt verification failed: expected ${ENTRY.length + 1} bytes, got ${written.length}`,
    );
  }
  console.log(ENTRY);
}

main();
