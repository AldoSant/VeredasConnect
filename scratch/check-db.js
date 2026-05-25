const { drizzle } = require("drizzle-orm/better-sqlite3");
const Database = require("better-sqlite3");
const sqlite = new Database("local.db");
const _db = drizzle(sqlite);

async function main() {
	const profiles = sqlite.prepare("SELECT * FROM profiles").all();
	console.log("Profiles:", JSON.stringify(profiles, null, 2));

	const links = sqlite.prepare("SELECT * FROM link_items").all();
	console.log("Links:", JSON.stringify(links, null, 2));
}

main();
