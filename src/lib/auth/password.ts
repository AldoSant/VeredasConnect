import crypto from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(crypto.scrypt);
const KEY_LENGTH = 64;
const HASH_PREFIX = "scrypt";

export async function hashPassword(password: string) {
	const salt = crypto.randomBytes(16).toString("hex");
	const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
	return `${HASH_PREFIX}$${salt}$${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string | null | undefined) {
	if (!storedHash) return false;

	const [prefix, salt, hash] = storedHash.split("$");
	if (prefix !== HASH_PREFIX || !salt || !hash) return false;
	if (hash.length !== KEY_LENGTH * 2 || !/^[0-9a-f]+$/i.test(hash)) return false;

	const expected = Buffer.from(hash, "hex");
	if (expected.length !== KEY_LENGTH) return false;

	const actual = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

	return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}
