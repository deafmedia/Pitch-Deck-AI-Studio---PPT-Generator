import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini AI Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "DUMMY_KEY",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Pitch Deck Generation Route
app.post("/api/generate-deck", async (req, res) => {
  try {
    const { prompt, theme = "corporate_blue", category = "General Pitch" } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Check if Gemini API key exists
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "DUMMY_KEY") {
      // Fallback rule-based deck generation when key is absent
      console.log("No GEMINI_API_KEY found, using rule-based generator fallback");
      const generatedDeck = createFallbackDeck(prompt, theme, category);
      return res.json({ deck: generatedDeck });
    }

    const systemInstruction = `
You are an elite Silicon Valley pitch deck consultant and startup advisor.
Your job is to transform a business prompt, startup idea, design brief, or raw notes into a high-converting, professional presentation pitch deck (8-12 slides).

Each slide MUST have a clear layout type: 'title', 'stats', 'pillars', 'cards', 'problem_solution', 'table', 'timeline', or 'cta'.

Return clean JSON matching the requested schema with title, subtitle, category, theme, and slides array.
    `;

    const userPrompt = `
Generate a complete, highly structured pitch deck for the following topic/brief:
"${prompt}"

Deck Category: "${category}"
Desired Theme: "${theme}"

Ensure slide layouts are varied (include title slide, stats slide, problem & solution, feature cards, competitive table or roadmap timeline, and CTA).
Include realistic data metrics, punchy bullet points, and speaker notes for each slide.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            author: { type: Type.STRING },
            category: { type: Type.STRING },
            theme: { type: Type.STRING },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  layout: { type: Type.STRING },
                  eyebrow: { type: Type.STRING },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  accentBadge: { type: Type.STRING },
                  speakerNotes: { type: Type.STRING },
                  bullets: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  stats: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        value: { type: Type.STRING },
                        label: { type: Type.STRING },
                        sublabel: { type: Type.STRING },
                      },
                      required: ["value", "label"],
                    },
                  },
                  cards: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        tag: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        highlight: { type: Type.BOOLEAN },
                      },
                      required: ["title", "description"],
                    },
                  },
                },
                required: ["id", "layout", "title"],
              },
            },
          },
          required: ["title", "subtitle", "slides"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const deckData = JSON.parse(jsonText);

    // Format IDs if missing
    if (deckData.slides && Array.isArray(deckData.slides)) {
      deckData.slides = deckData.slides.map((s: any, idx: number) => ({
        ...s,
        id: s.id || `ai-slide-${idx + 1}`,
        layout: s.layout || 'cards',
      }));
    }

    deckData.id = `deck-${Date.now()}`;
    deckData.theme = theme;

    return res.json({ deck: deckData });
  } catch (error: any) {
    console.error("Gemini Deck Generation Error:", error);
    // Fallback on error
    const fallback = createFallbackDeck(req.body.prompt || "Generated Pitch", req.body.theme || "corporate_blue", req.body.category || "Startup");
    return res.json({ deck: fallback, warning: "Used offline generator due to API response." });
  }
});

// Single Slide AI Generator / AI Rewrite Route
app.post("/api/generate-slide", async (req, res) => {
  try {
    const { prompt, currentSlide, layout = "cards" } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "DUMMY_KEY") {
      const fallbackSlide = {
        id: `slide-${Date.now()}`,
        layout: layout || "cards",
        eyebrow: "AI REWRITTEN",
        title: prompt.length > 40 ? prompt.substring(0, 38) + "..." : prompt,
        subtitle: "Refined narrative optimized for executive audience impact.",
        bullets: [
          "Delivering strong strategic alignment and operational resilience",
          "Accelerating adoption with clear value metrics and rapid ROI",
          "Scaling team execution with automated performance tracking"
        ],
        speakerNotes: "Emphasize key deliverables and strategic outcomes."
      };
      return res.json({ slide: fallbackSlide });
    }

    const systemInstruction = `You are a world-class pitch deck designer. Generate a single highly structured slide object based on the user's brief. Ensure output matches the requested layout and return valid JSON with eyebrow, title, subtitle, bullets, stats, cards, speakerNotes, and accentBadge.`;

    const userPrompt = `
Generate or rewrite a single presentation slide based on this instruction:
"${prompt}"

Target Layout: "${layout}"
${currentSlide ? `Existing Slide Title: "${currentSlide.title}"` : ""}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eyebrow: { type: Type.STRING },
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            accentBadge: { type: Type.STRING },
            speakerNotes: { type: Type.STRING },
            bullets: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            stats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  value: { type: Type.STRING },
                  label: { type: Type.STRING },
                  sublabel: { type: Type.STRING }
                },
                required: ["value", "label"]
              }
            },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tag: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  highlight: { type: Type.BOOLEAN }
                },
                required: ["title", "description"]
              }
            }
          },
          required: ["title", "subtitle"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const slideData = JSON.parse(jsonText);
    slideData.id = `slide-${Date.now()}`;
    slideData.layout = layout;

    return res.json({ slide: slideData });
  } catch (err: any) {
    console.error("Single Slide AI Generation Error:", err);
    return res.json({
      slide: {
        id: `slide-${Date.now()}`,
        layout: req.body.layout || "cards",
        eyebrow: "AI ASSIST",
        title: req.body.prompt || "New Slide",
        subtitle: "Generated with AI assistance",
        bullets: ["Point 1: Strategic priority", "Point 2: Key metric driver"]
      }
    });
  }
});

// AI Speaker Notes Generator Route
app.post("/api/generate-speaker-notes", async (req, res) => {
  try {
    const { slideTitle, slideSubtitle, bullets, layout } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "DUMMY_KEY") {
      const fallbackNotes = `• Slide Overview: ${slideTitle || "Presentation Slide"}\n• Core Message: ${slideSubtitle || "Focus on key strategic metrics."}\n• Key Talking Points:\n${(bullets || []).map((b: string) => `  - ${b}`).join("\n")}\n• Presentation Tip: Pause after stating main figures to let the audience absorb data.`;
      return res.json({ speakerNotes: fallbackNotes });
    }

    const prompt = `
Generate concise, persuasive executive speaker notes for a slide with:
Title: "${slideTitle}"
Subtitle: "${slideSubtitle || ""}"
Bullets: ${JSON.stringify(bullets || [])}
Layout: "${layout || "default"}"

Include bulleted talking points and a timing/delivery tip. Keep under 120 words.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return res.json({ speakerNotes: response.text || "" });
  } catch (err) {
    return res.json({ speakerNotes: `• Talk Track: Introduce ${req.body.slideTitle || "slide"}.\n• Reiterate key metrics and transition smoothly to the next slide.` });
  }
});

// AI Slide Translator Route (Multi-Language & ISL Sign Language Gloss)
app.post("/api/translate-slide", async (req, res) => {
  try {
    const { slide, targetLanguage } = req.body;

    if (!slide || !targetLanguage) {
      return res.status(400).json({ error: "Slide and targetLanguage are required" });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "DUMMY_KEY") {
      // Offline mock translation label append
      const translated = { ...slide };
      translated.title = `${slide.title} [${targetLanguage.toUpperCase()}]`;
      translated.subtitle = slide.subtitle ? `${slide.subtitle} (${targetLanguage})` : undefined;
      return res.json({ slide: translated });
    }

    const systemInstruction = `You are a translation expert in executive business presentations and accessibility gloss (including Indian Sign Language ISL gloss structure). Translate the provided slide content into "${targetLanguage}". Return valid JSON matching the original slide structure.`;

    const userPrompt = `
Translate this slide object into ${targetLanguage}:
${JSON.stringify(slide)}

Keep structural layout and IDs intact. Only translate text content (title, subtitle, eyebrow, bullets, stats labels, card titles/descriptions, speakerNotes).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const translatedSlide = JSON.parse(response.text || "{}");
    return res.json({ slide: { ...slide, ...translatedSlide } });
  } catch (err) {
    console.error("Translation Error:", err);
    return res.status(500).json({ error: "Translation failed" });
  }
});

// AI Deck Pitch Health Score & Analytics Route
app.post("/api/deck-analytics", async (req, res) => {
  try {
    const { deck } = req.body;

    if (!deck || !deck.slides) {
      return res.status(400).json({ error: "Deck is required" });
    }

    const slideCount = deck.slides.length;
    let score = 85;
    const feedback: string[] = [];

    if (slideCount < 6) {
      score -= 10;
      feedback.push("Deck is concise. Consider adding competitive matrix or traction metrics.");
    } else if (slideCount > 15) {
      score -= 8;
      feedback.push("Deck is long (15+ slides). For investor pitches, aim for 10-12 core slides.");
    } else {
      feedback.push("Optimal slide length (8-12 slides) for investor attention span.");
    }

    const hasStats = deck.slides.some((s: any) => s.layout === "stats" || (s.stats && s.stats.length > 0));
    if (!hasStats) {
      score -= 10;
      feedback.push("Missing dedicated Traction/Stats slide. Add quantified metrics or market TAM.");
    } else {
      feedback.push("Includes strong quantified market & traction metrics.");
    }

    const hasProblemSolution = deck.slides.some((s: any) => s.layout === "problem_solution" || s.layout === "pillars");
    if (hasProblemSolution) {
      feedback.push("Clear problem-solution or core pillars definition.");
    } else {
      score -= 5;
      feedback.push("Consider highlighting a dedicated Problem / Solution slide early in the deck.");
    }

    const hasNotes = deck.slides.filter((s: any) => s.speakerNotes && s.speakerNotes.trim().length > 10).length;
    const notesRatio = Math.round((hasNotes / slideCount) * 100);

    return res.json({
      score: Math.max(50, Math.min(99, score)),
      grade: score >= 90 ? "A+" : score >= 80 ? "A" : "B+",
      slideCount,
      speakerNotesCoverage: `${notesRatio}%`,
      clarityScore: 92,
      designDensity: "Balanced",
      feedback,
      recommendations: [
        "Use 1-tap AI Speaker Notes to ensure presenter readiness across all slides",
        "Export native PPTX to verify formatting before investor meeting"
      ]
    });
  } catch (err) {
    return res.status(500).json({ error: "Analytics calculation failed" });
  }
});

// Fallback Rule-based Pitch Deck Builder
function createFallbackDeck(promptText: string, theme: string, category: string) {
  const title = promptText.length > 50 ? promptText.substring(0, 48) + "..." : promptText;
  return {
    id: `deck-${Date.now()}`,
    title: title || "Custom Generated Pitch Deck",
    subtitle: "AI-Powered Executive Pitch Deck & Strategic Overview",
    author: "Pitch Deck Studio",
    category: category || "Business Presentation",
    theme: theme || "corporate_blue",
    slides: [
      {
        id: "gen-1",
        layout: "title",
        eyebrow: "STRATEGIC OVERVIEW",
        title: title,
        subtitle: "A modern, high-impact business strategy designed for growth and market leadership.",
        bullets: [
          "Delivering disruptive value to enterprise & consumer markets",
          "Accelerating adoption with resilient technology architecture",
          "Scalable business model with high unit economics margin",
          "Targeting market leadership with rapid release cadence"
        ],
        speakerNotes: "Introduce the core proposal and state why now is the right time for this product.",
        accentBadge: "COVER"
      },
      {
        id: "gen-2",
        layout: "stats",
        eyebrow: "MARKET METRICS",
        title: "Key Performance & Market Traction",
        subtitle: "Quantifiable indicators driving momentum across target verticals.",
        stats: [
          { value: "$42M", label: "Target Market Opportunity", sublabel: "Addressable market size" },
          { value: "3.4x", label: "YoY Growth Rate", sublabel: "Sustained revenue expansion" },
          { value: "88%", label: "Customer Retention", sublabel: "High product stickiness" },
          { value: "< 30 Days", label: "Time to Value", sublabel: "Rapid onboarding experience" }
        ],
        bullets: [
          "Strong demand signals across pilot customer cohorts",
          "Defensible product features with low customer acquisition cost"
        ],
        speakerNotes: "Focus on the strong numbers and retention metrics.",
        accentBadge: "TRACTION"
      },
      {
        id: "gen-3",
        layout: "pillars",
        eyebrow: "CORE PILLARS",
        title: "Value Proposition & Strategic Pillars",
        subtitle: "Four fundamental advantages underpinning our technology and brand.",
        cards: [
          { tag: "PILLAR 1", title: "Automated Intelligence", description: "Streamlining complex workflows with smart context recognition.", highlight: true },
          { tag: "PILLAR 2", title: "Enterprise Security", description: "Bank-grade encryption, role-based access, and complete audit trails.", highlight: false },
          { tag: "PILLAR 3", title: "Seamless Integration", description: "Plug-and-play connectors with minimal developer friction.", highlight: true },
          { tag: "PILLAR 4", title: "Predictive Analytics", description: "Real-time decision dashboards with actionable data insights.", highlight: false }
        ],
        speakerNotes: "Highlight Pillar 1 and Pillar 3 as primary customer magnets.",
        accentBadge: "VALUE PILLARS"
      },
      {
        id: "gen-4",
        layout: "cta",
        eyebrow: "NEXT STEPS",
        title: "Growth Execution & Next Steps",
        subtitle: "Ready for deployment, investor discussions, and immediate execution.",
        bullets: [
          "Download complete native PowerPoint presentation (.pptx)",
          "Share deck URL or export print-ready PDF documentation",
          "Schedule strategic alignment session with founding team"
        ],
        speakerNotes: "Conclude presentation with action items and contact details.",
        accentBadge: "THE ASK"
      }
    ]
  };
}

// Start Server & Integrate Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
