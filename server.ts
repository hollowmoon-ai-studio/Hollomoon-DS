import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy Gemini client helper
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Hollowmoon Digital Studio API',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // AURA AI Concierge Server Endpoint
  app.post('/api/concierge', async (req, res) => {
    try {
      const { prompt, lang = 'en', profile = {} } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      const client = getGeminiClient();

      // If GEMINI_API_KEY is available, use gemini-3.8-flash
      if (client) {
        const systemInstruction = `You are AURA, the Senior Business Development Director & Solutions Architect at Hollowmoon Digital Studio (headquartered in Panama City).
Hollowmoon specializes in modernizing mid-to-enterprise service organizations (Logistics, Health, Finance, Legal, Commerce) by deploying custom high-velocity digital flagships (Hollowmoon OS), autonomous AI reasoning pipelines, and eliminating expensive per-seat SaaS tool sprawl.
All projects include 100% intellectual property (source code) handover, sub-600ms latency guarantees, and Panama Zero-Trust compliance.

Tasks:
1. Respond in ${lang === 'es' ? 'Spanish (Español profesional y elegante)' : 'English (clear, authoritative, consultative)'}.
2. Provide strategic guidance across Customer Support (CS), Customer Experience (CX), Conversion Rate Optimization (CRO), and Strategic Sales.
3. Keep the response concise, executive, high-impact (2 to 4 punchy sentences or bullet points).
4. Emphasize quantifiable business outcomes (capital saved, latency eliminated, conversion yield).`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || '';

        // Classify category
        const lower = prompt.toLowerCase();
        let category: 'cs' | 'cx' | 'cro' | 'sales' = 'sales';
        if (lower.includes('cro') || lower.includes('conversion') || lower.includes('tasa') || lower.includes('friction')) {
          category = 'cro';
        } else if (lower.includes('tech') || lower.includes('stack') || lower.includes('architect') || lower.includes('os')) {
          category = 'cx';
        } else if (lower.includes('panama') || lower.includes('compliance') || lower.includes('soc2') || lower.includes('support')) {
          category = 'cs';
        }

        res.json({
          reply,
          category,
          suggestedPills:
            lang === 'es'
              ? ['⚡ Diagnóstico Rápido de CRO', '🎯 Arquitectura del Sistema', '📅 Reservar Sesión de Estrategia']
              : ['⚡ Instant CRO Audit', '🎯 System Architecture', '📅 Reserve Strategy Slot'],
          leadUpdate: {
            qualificationScore: Math.min(96, (profile.qualificationScore || 60) + 10),
            status: 'qualified',
          },
        });
        return;
      }

      // Fallback response when GEMINI_API_KEY is not configured
      const isEs = lang === 'es';
      res.json({
        reply: isEs
          ? `Saludos ejecutivos. He analizado su consulta respecto a "${prompt}". En Hollowmoon Studio estructuramos buques insignia digitales de alto rendimiento con agentes de IA autónomos. Le recomiendo revisar el desglose de CRO y la arquitectura propuesta en el panel derecho para cuantificar el impacto en su operación.`
          : `Executive greetings. I have evaluated your strategic inquiry regarding "${prompt}". At Hollowmoon Studio, we replace legacy software drag with custom high-speed flagships powered by autonomous AI. I encourage you to inspect the live CRO diagnostic and system architecture on the right cockpit to quantify your potential operational recovery.`,
        category: 'sales',
        suggestedPills: isEs
          ? ['⚡ Diagnóstico Rápido de CRO', '🎯 Recomendar Arquitectura', '📅 Reservar Sesión de Estrategia']
          : ['⚡ Instant CRO Audit', '🎯 Recommend System Stack', '📅 Reserve Strategy Slot'],
        leadUpdate: {
          qualificationScore: Math.min(92, (profile.qualificationScore || 60) + 8),
          status: 'qualified',
        },
      });
    } catch (error: any) {
      console.error('Error in /api/concierge:', error);
      res.status(500).json({
        error: 'Failed to process concierge request',
        details: error?.message || 'Unknown server error',
      });
    }
  });

  // Vite Middleware for development vs Static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hollowmoon Digital Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
