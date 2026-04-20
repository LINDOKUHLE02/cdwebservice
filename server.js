const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

function toTitleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function extractBusinessName(prompt) {
  const cleaned = prompt.replace(/[^a-zA-Z0-9\s&-]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return "Your Business";
  }

  const phrase = cleaned.split(" ").slice(0, 3).join(" ");
  return toTitleCase(phrase) || "Your Business";
}

function pickTheme(prompt) {
  const normalized = prompt.toLowerCase();

  if (/(restaurant|food|chef|cafe|coffee|bakery)/.test(normalized)) {
    return {
      hero: "Serve memorable experiences with a beautiful digital presence",
      style: "Warm editorial style with premium food photography focus",
      sections: ["Home", "Menu Highlights", "Events", "Reservations", "Contact"],
      accent: "#ff8a3d",
      accentSoft: "#ffd0a8",
    };
  }

  if (/(law|attorney|legal|consulting|finance|accounting)/.test(normalized)) {
    return {
      hero: "Build trust with a clear and professional online presence",
      style: "Minimal executive style with confidence-led typography",
      sections: ["Home", "Services", "Industries", "Case Results", "Contact"],
      accent: "#6cc2ff",
      accentSoft: "#cbeaff",
    };
  }

  if (/(fitness|gym|wellness|health|clinic|medical)/.test(normalized)) {
    return {
      hero: "Help more people with a high-converting digital front door",
      style: "Clean wellness style with energetic accents and simple flows",
      sections: ["Home", "Programs", "Results", "Pricing", "Contact"],
      accent: "#52e3c2",
      accentSoft: "#b9fff0",
    };
  }

  return {
    hero: "Launch a reliable website that turns visitors into customers",
    style: "Modern cyber-clean style with strong calls to action",
    sections: ["Home", "Services", "About", "Testimonials", "Contact"],
    accent: "#00d9ff",
    accentSoft: "#b8f4ff",
  };
}

function buildPreviewSite(prompt) {
  const brief = (prompt || "").trim() || "Modern business website";
  const businessName = extractBusinessName(brief);
  const theme = pickTheme(brief);

  const html = `
    <header class="site-header">
      <div class="brand">${businessName}</div>
      <a class="cta" href="#contact">Get Started</a>
    </header>
    <section class="hero">
      <div>
        <p class="eyebrow">AI Website Concept</p>
        <h1>${theme.hero}</h1>
        <p class="copy">Built from your brief: "${brief}"</p>
        <a class="primary-btn" href="#contact">Book a Call</a>
      </div>
    </section>
    <section class="section-grid">
      ${theme.sections
        .map(
          (section) => `
        <article class="card">
          <h2>${section}</h2>
          <p>Placeholder content for the ${section.toLowerCase()} section in your generated concept.</p>
        </article>
      `,
        )
        .join("")}
    </section>
    <section id="contact" class="contact">
      <h2>Ready to Build?</h2>
      <p>Use this concept as a launchpad. We can design and build the full production version for you.</p>
      <a class="primary-btn" href="#">Contact Team</a>
    </section>
  `;

  const css = `
    :root {
      --bg: #070d17;
      --surface: #101a2a;
      --text: #eaf4ff;
      --muted: #b6c6dd;
      --accent: ${theme.accent};
      --accent-soft: ${theme.accentSoft};
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      color: var(--text);
      background:
        radial-gradient(circle at 14% 18%, rgba(0,217,255,0.16), transparent 32%),
        radial-gradient(circle at 84% 22%, rgba(123,47,247,0.18), transparent 36%),
        linear-gradient(180deg, #060d16 0%, var(--bg) 100%);
      font-family: "Segoe UI", system-ui, sans-serif;
      line-height: 1.5;
    }

    .site-header {
      max-width: 980px;
      margin: 0 auto;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      font-weight: 700;
      letter-spacing: 0.03em;
      color: var(--accent-soft);
    }

    .hero,
    .section-grid,
    .contact {
      max-width: 980px;
      margin: 0 auto;
      padding: 1rem;
    }

    .hero {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    .eyebrow {
      color: var(--accent-soft);
      margin: 0 0 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      font-size: 0.74rem;
    }

    h1 {
      margin: 0;
      font-size: clamp(1.8rem, 4vw, 2.8rem);
      line-height: 1.15;
      max-width: 18ch;
      text-shadow: 0 0 14px rgba(0, 217, 255, 0.22);
    }

    .copy {
      margin: 0.9rem 0 1.2rem;
      color: var(--muted);
      max-width: 56ch;
    }

    .section-grid {
      display: grid;
      gap: 0.9rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .card,
    .contact {
      background: rgba(16, 26, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 1rem;
      backdrop-filter: blur(8px);
    }

    h2 {
      margin: 0 0 0.45rem;
      font-size: 1.06rem;
    }

    .card p,
    .contact p {
      margin: 0;
      color: var(--muted);
      font-size: 0.95rem;
    }

    .primary-btn,
    .cta {
      display: inline-block;
      text-decoration: none;
      background: linear-gradient(120deg, var(--accent), #ff7a18);
      color: #041018;
      border-radius: 10px;
      padding: 0.62rem 0.92rem;
      font-weight: 700;
      box-shadow: 0 8px 22px rgba(0, 217, 255, 0.22);
    }

    .contact {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .contact .primary-btn {
      margin-top: 0.9rem;
    }

    @media (max-width: 720px) {
      .section-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  const js = `
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.animate(
        [
          { opacity: 0, transform: 'translateY(14px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: 360,
          delay: index * 70,
          fill: 'forwards',
          easing: 'ease-out'
        }
      );
    });
  `;

  return {
    name: `${businessName} Website Concept`,
    hero: theme.hero,
    tagline: brief,
    sections: theme.sections,
    style: theme.style,
    preview: {
      html,
      css,
      js,
    },
  };
}

app.post("/api/generate", (req, res) => {
  const { prompt } = req.body;

  res.json(buildPreviewSite(prompt));
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
