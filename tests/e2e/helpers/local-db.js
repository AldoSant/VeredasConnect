#!/usr/bin/env node
const crypto = require("node:crypto");
const Database = require("better-sqlite3");

const db = new Database("local.db");
const [command, slug, ...args] = process.argv.slice(2);

function profileBySlug(profileSlug) {
	const profile = db.prepare("SELECT * FROM profiles WHERE slug = ?").get(profileSlug);
	if (!profile) {
		console.error(`Profile not found for slug: ${profileSlug}`);
		process.exit(1);
	}
	return profile;
}

if (command === "update-profile") {
	const [displayName, bio, avatarUrl] = args;
	profileBySlug(slug);
	db.prepare(`
    UPDATE profiles
    SET display_name = ?, bio = ?, avatar_url = ?, updated_at = ?
    WHERE slug = ?
  `).run(displayName ?? "", bio ?? "", avatarUrl ?? "", Date.now(), slug);
	process.exit(0);
}

if (command === "seed-links") {
	const profile = profileBySlug(slug);
	const now = Date.now();
	const items = [
		{ type: "link", title: "My YouTube Channel", url: "https://youtube.com/@test", sortOrder: 0 },
		{ type: "header", title: "Social Media", url: "", sortOrder: 1 },
		{ type: "divider", title: "", url: "", sortOrder: 2 },
		{ type: "link", title: "My Twitter", url: "https://twitter.com/test", sortOrder: 3 },
	];

	const insert = db.prepare(`
    INSERT INTO link_items (
      id, profile_id, type, title, url, sort_order, is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

	const tx = db.transaction(() => {
		db.prepare("DELETE FROM link_items WHERE profile_id = ?").run(profile.id);
		for (const item of items) {
			insert.run(
				crypto.randomUUID(),
				profile.id,
				item.type,
				item.title,
				item.url,
				item.sortOrder,
				now,
				now,
			);
		}
	});
	tx();
	process.exit(0);
}

console.error(
	"Usage: local-db.js update-profile <slug> <displayName> <bio> <avatarUrl> | seed-links <slug>",
);
process.exit(1);
