import Database from "better-sqlite3";

async function main() {
  console.log("Seeding database (RAW SQL)...");
  const sqlite = new Database("local.db");

  try {
    const slug = "premium-demo";
    const userId = "demo-user-id";
    const profileId = "demo-profile-id";
    const now = Date.now();

    // 1. User
    console.log("Inserting user...");
    sqlite.prepare(`
      INSERT INTO user (id, name, email) 
      VALUES (?, ?, ?)
      ON CONFLICT(email) DO NOTHING
    `).run(userId, "Demo User", "demo@example.com");

    // 2. Profile
    console.log("Inserting profile...");
    sqlite.prepare(`DELETE FROM profiles WHERE slug = ?`).run(slug);
    
    sqlite.prepare(`
      INSERT INTO profiles (
        id, user_id, slug, display_name, bio, avatar_url, theme, 
        job_title, company, phone, whatsapp, lead_form_active, lead_form_title,
        created_at, updated_at
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      profileId, 
      userId, 
      slug, 
      "Anna Antigravity", 
      "Especialista em IA & Coding Assistant de Elite. Criando o futuro um commit por vez.", 
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna", 
      "premium", 
      "Senior AI Engineer", 
      "DeepMind / Google", 
      "+5511999999999", 
      "5511999999999", 
      1, 
      "Vamos construir algo incrível?",
      now,
      now
    );

    // 3. Links
    console.log("Inserting links...");
    sqlite.prepare(`DELETE FROM link_items WHERE profile_id = ?`).run(profileId);
    
    const linksData = [
      { title: "🚀 Meu Portfólio Premium", url: "https://github.com", type: "link" },
      { title: "LinkedIn Profissional", url: "https://linkedin.com", type: "link" },
      { title: "RECURSOS", url: "", type: "header" },
      { title: "Download do Whitepaper IA", url: "https://google.com", type: "link" },
      { title: "---", url: "", type: "divider" },
      { title: "Agendar Consultoria", url: "https://calendly.com", type: "link" },
    ];

    const insertLink = sqlite.prepare(`
      INSERT INTO link_items (id, profile_id, title, url, type, sort_order, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < linksData.length; i++) {
      insertLink.run(
        `link-${i}`,
        profileId,
        linksData[i].title,
        linksData[i].url,
        linksData[i].type,
        i,
        1,
        now,
        now
      );
    }

    // 4. Testimonials
    console.log("Inserting testimonials...");
    sqlite.prepare(`DELETE FROM testimonials WHERE profile_id = ?`).run(profileId);
    
    sqlite.prepare(`
      INSERT INTO testimonials (id, profile_id, author_name, author_title, author_avatar, content, rating, is_visible, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "testi-1",
      profileId,
      "Satya Nadella",
      "CEO @ Microsoft",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Satya",
      "O trabalho da Anna é simplesmente transformador. Ela elevou o padrão da nossa plataforma.",
      5,
      1,
      now
    );

    console.log("Database seeded successfully with RAW SQL!");
    console.log(`Test your premium profile at: http://localhost:3000/${slug}`);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

main();
