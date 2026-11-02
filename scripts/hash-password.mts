// Usage: pnpm hash-password            (prompts, input hidden)
//        pnpm hash-password 'secret'   (non-interactive)
import { createInterface } from "node:readline";
import { Writable } from "node:stream";
import { hashPassword } from "../src/lib/auth/password";

async function prompt(): Promise<string> {
  let muted = false;
  const output = new Writable({
    write(chunk, _enc, cb) {
      if (!muted) process.stdout.write(chunk);
      cb();
    },
  });
  const rl = createInterface({ input: process.stdin, output, terminal: true });
  return new Promise((resolve) => {
    rl.question("Admin password: ", (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
    muted = true;
  });
}

const password = process.argv[2] ?? (await prompt());
if (password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}
console.log(`ADMIN_PASSWORD_HASH=${await hashPassword(password)}`);
