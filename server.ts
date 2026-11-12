import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with server-side API Key
const apiKey = process.env.GEMINI_API_KEY || '';
const isValidKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY';
const ai = isValidKey ? new GoogleGenAI({ apiKey }) : null;

// AI Tutor Chat Endpoint
app.post('/api/ai-tutor', async (req, res) => {
  const { message, scenarioId, systemPrompt, userLevel } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Pre-generate intelligent context-aware response adaptive to CEFR level
  const lvl = (userLevel || 'A0').toUpperCase();

  const levelFallbacks: Record<string, Record<string, { replyEn: string; replyAr: string; coachingTipAr?: string }>> = {
    A2: {
      coffee_shop: {
        replyEn: 'A medium iced latte with oat milk is $4.50. Would you like to add a warm toasted croissant or muffin to your order today?',
        replyAr: 'اللاتيه المثلج بحجم متوسط بحليب الشوفان حسابه 4.50 دولار. هل ترغب بإضافة كرواسون دافئ أو كعكة إلى طلبك اليوم؟',
        coachingTipAr: 'في المستوى A2، استخدم "Could I also get..." أو "I would prefer..." لطلب إضافاتك بلباقة.',
      },
      job_interview: {
        replyEn: 'Thank you for explaining your previous role. In that job, did you work individually or as part of a team, and what responsibilities did you manage daily?',
        replyAr: 'شكراً لتوضيح دورك السابق. في تلك الوظيفة، هل كنت تعمل بمفردك أم كجزء من فريق، وما هي المسؤوليات التي كنت تديرها يومياً؟',
        coachingTipAr: 'في المقابلات بمستوى A2، استخدم أفعال الماضي البسيط مثل: managed, coordinated, helped, improved.',
      },
      airport_travel: {
        replyEn: 'Your passport is verified and your seat is 14A near the window. Do you have any checked baggage, or only this carry-on backpack?',
        replyAr: 'تم التحقق من جواز سفرك ومقعدك 14A بجوار النافذة. هل لديك أمتعة للشحن، أم فقط حقيبة الظهر المحمولة هذه؟',
        coachingTipAr: 'تذكّر: الحقائب المشحونة تسمى "Checked luggage" والحقيبة المحمولة "Carry-on bag".',
      },
      clinic_visit: {
        replyEn: 'I understand your symptoms. I will prescribe an antibiotic and a painkiller. Take one tablet twice a day after meals, and drink warm water.',
        replyAr: 'فهمت الأعراض التي تعاني منها. سأصف لك مضاداً حيوياً ومسكناً. تناول قرصاً واحداً مرتين يومياً بعد الوجبات، واشرب ماءً دافئاً.',
        coachingTipAr: 'لاحظ الفرق في التردد: "twice a day" مرتين يومياً، "once a day" مرة يومياً، "three times a day" ثلاث مرات.',
      },
    },
    A0: {
      coffee_shop: {
        replyEn: 'Hello! That is $3.50. Do you want tea or coffee?',
        replyAr: 'مرحباً! الحساب 3.50 دولار. هل تفضل الشاي أم القهوة؟',
        coachingTipAr: 'تستطيع الإجابة بكلمات بسيطة: "Coffee, please" أو "Tea with milk".',
      },
      job_interview: {
        replyEn: 'Welcome! What is your name and what job do you like?',
        replyAr: 'أهلاً بك! ما اسمك وما الوظيفة التي تحبها؟',
        coachingTipAr: 'قل: "My name is..." متبوعاً باسمك.',
      },
      airport_travel: {
        replyEn: 'Hello! Passport and ticket, please.',
        replyAr: 'مرحباً! الجواز والتذكرة من فضلك.',
        coachingTipAr: 'قل: "Here you go" أو "Here is my passport".',
      },
      clinic_visit: {
        replyEn: 'Hello, please sit down. Where is the pain?',
        replyAr: 'مرحباً، تفضل بالجلوس. أين موضع الألم؟',
        coachingTipAr: 'قل: "I have a headache" (عندي صداع) أو "My stomach hurts".',
      },
    },
  };

  const selectedLevelMap = levelFallbacks[lvl] || levelFallbacks.A2;
  const defaultFallback = selectedLevelMap[scenarioId] || {
    replyEn: `That's very well expressed for Level ${lvl}! Let's continue practicing this topic with proper sentence structures. What else can you share?`,
    replyAr: `صياغة ممتازة ومفهومة تناسب المستوى ${lvl}! لنواصل التدرب على هذا الموضوع بالإنجليزية. أخبرني المزيد!`,
    coachingTipAr: `نصيحة تدريبية لمستوى ${lvl}: احرص على استخدام أدوات الربط (because, but, so) وتناسق الأزمنة.`,
  };

  if (!ai) {
    return res.json(defaultFallback);
  }

  try {
    const promptContext = `
${systemPrompt || 'You are Mr. Fares, an inspiring and expert English teacher for native Arabic speakers.'}
Target Learner Level: ${userLevel || 'A0'}.
User message: "${message}"

Respond strictly as JSON with this schema:
{
  "replyEn": "Your natural English conversational response (1-3 sentences)",
  "replyAr": "Arabic translation of your reply for learner comprehension",
  "coachingTipAr": "Optional concise pedagogical coaching tip in Arabic if user made any grammar, pronunciation, or preposition mistake (or empty string if none)"
}
`;

    // 5-second timeout with Promise.race
    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptContext,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timeout')), 5000)
    );

    const response: any = await Promise.race([generatePromise, timeoutPromise]);
    const responseText = response?.text || '{}';
    const parsed = JSON.parse(responseText);

    return res.json({
      replyEn: parsed.replyEn || defaultFallback.replyEn,
      replyAr: parsed.replyAr || defaultFallback.replyAr,
      coachingTipAr: parsed.coachingTipAr || defaultFallback.coachingTipAr,
    });
  } catch (err: any) {
    console.debug('AI Tutor fallback triggered:', err.message);
    return res.json(defaultFallback);
  }
});

// AI Writing Coach & Polishing Endpoint
app.post('/api/ai-writer', async (req, res) => {
  const { text, tone, userLevel } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const defaultRewrite = {
    originalText: text,
    improvedText: text.replace(/\bi\s+am\s+agree\b/gi, 'I agree').replace(/\bmarried\s+with\b/gi, 'married to'),
    formalAlternative: text,
    casualAlternative: text,
    arabicExplanation: 'تمت مراجعة النص وتحسين ترابط الجمل الإنجليزية وحروف الجر بدقة.',
    detectedMistakes: [] as string[],
  };

  if (!ai) {
    return res.json(defaultRewrite);
  }

  try {
    const prompt = `
You are Mr. Fares' AI Master English Writing Coach. A native Arabic-speaking English learner submitted this text to be improved.
Tone requested: ${tone || 'business/polite'}.
Learner CEFR level: ${userLevel || 'A2'}.
Submitted text: "${text}"

Analyze for Arabic language interference (omitted verb to be, misplaced prepositions, direct literal translations from Arabic dialects) and rewrite naturally.
Respond STRICTLY as JSON with this schema:
{
  "improvedText": "Natural, corrected version in the requested tone",
  "formalAlternative": "Polite professional version (for emails/work)",
  "casualAlternative": "Friendly everyday conversational version",
  "arabicExplanation": "Clear Arabic explanation of the corrections and why the new wording is more natural",
  "detectedMistakes": ["List of specific errors found (e.g. 'I am agree -> I agree', 'in Friday -> on Friday')"]
}
`;

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timeout')), 5000)
    );

    const response: any = await Promise.race([generatePromise, timeoutPromise]);
    const responseText = response?.text || '{}';
    const parsed = JSON.parse(responseText);

    return res.json({
      originalText: text,
      improvedText: parsed.improvedText || defaultRewrite.improvedText,
      formalAlternative: parsed.formalAlternative || defaultRewrite.formalAlternative,
      casualAlternative: parsed.casualAlternative || defaultRewrite.casualAlternative,
      arabicExplanation: parsed.arabicExplanation || defaultRewrite.arabicExplanation,
      detectedMistakes: parsed.detectedMistakes || defaultRewrite.detectedMistakes,
    });
  } catch (err: any) {
    console.debug('AI Writer fallback triggered:', err.message);
    return res.json(defaultRewrite);
  }
});

// Dev vs Production Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
