import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// Format: scrypt:N:r:p:<salt base64url>:<hash base64url>
// (":" rather than "$" so .env variable expansion leaves it alone)

const KEYLEN = 64;

function derive(password: string, salt: Buffer, opts: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password, salt, KEYLEN, { ...opts, maxmem: 64 * 1024 * 1024 }, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  );
}

export async function hashPassword(password: string) {
  const N = 16384, r = 8, p = 1;
  const salt = randomBytes(16);
  const key = await derive(password, salt, { N, r, p });
  return ["scrypt", N, r, p, salt.toString("base64url"), key.toString("base64url")].join(":");
}

export async function verifyPassword(password: string, stored: string) {
  const [algo, N, r, p, salt, hash] = stored.split(":");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const key = await derive(password, Buffer.from(salt, "base64url"), {
    N: Number(N),
    r: Number(r),
    p: Number(p),
  });
  return key.length === expected.length && timingSafeEqual(key, expected);
}
