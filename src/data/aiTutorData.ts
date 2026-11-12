import { AiScenario, CEFRLevel } from '../types';

export interface MotherTongueRule {
  pattern: RegExp;
  errorTypeAr: string;
  correctedText: string;
  explanationAr: string;
  motherTongueInfluence: string;
  quickQuiz?: {
    questionAr: string;
    options: string[];
    correctIndex: number;
  };
}

export const MOTHER_TONGUE_RULES: MotherTongueRule[] = [
  {
    pattern: /\b(?:i\s+am|i'm)\s+agree\b/i,
    errorTypeAr: 'فعل الكينونة الزائد مع agree',
    correctedText: 'I agree',
    explanationAr: 'الفعل agree فعل صريح ولا يسبقه am. نقول I agree وليس I am agree.',
    motherTongueInfluence: 'في العربية الجملة الاسمية (أنا أوافق) تبدأ بضمير بلا فعل، فيُترجم أنا إلى I am.',
    quickQuiz: {
      questionAr: 'اختر الصيغة الصحيحة لقول "أنا أتفق معك":',
      options: ['I agree with you.', 'I am agree with you.', 'I agreeing with you.'],
      correctIndex: 0,
    },
  },
  {
    pattern: /\b(?:i|he|she|we|they)\s+have\s+\d+\s+years\b/i,
    errorTypeAr: 'استخدام have بدل be مع العمر',
    correctedText: 'I am ... years old',
    explanationAr: 'العمر في الإنجليزية يُذكر بفعل الكينونة (am / is / are) وليس فعل الملكية have.',
    motherTongueInfluence: 'في العربية نقول (عندي 25 سنة) أو (لدي)، فيظن المتعلم أنها have.',
    quickQuiz: {
      questionAr: 'اختر الطريقة الإنجليزية الصحيحة للتعبير عن العمر:',
      options: ['She is 25 years old.', 'She has 25 years.', 'She have 25 years old.'],
      correctIndex: 0,
    },
  },
  {
    pattern: /\bdidn't\s+(went|saw|ate|had|came|bought|wrote|took)\b/i,
    errorTypeAr: 'استخدام صيغة الماضي بعد didn\'t',
    correctedText: "didn't + المصدر (go, see, eat...)",
    explanationAr: "الأداة didn't تعبر عن الماضي بالفعل، لذا يعود الفعل بعدها لمصدره المجرد (Base Form).",
    motherTongueInfluence: 'في العربية نقول (ما ذهبَ) فنكرر صيغة الماضي ذهنياً.',
    quickQuiz: {
      questionAr: 'اختر النفي الصحيح في الماضي:',
      options: ["He didn't go to work yesterday.", "He didn't went to work yesterday."],
      correctIndex: 0,
    },
  },
  {
    pattern: /\bmarried\s+with\b/i,
    errorTypeAr: 'حرف الجر مع married',
    correctedText: 'married to',
    explanationAr: 'في الإنجليزية نقول married to شخص ما، ولا نستخدم with.',
    motherTongueInfluence: 'في العربية نقول "متزوج مع/من فلانه"، فنترجمها حرفياً إلى with.',
    quickQuiz: {
      questionAr: 'اختر حرف الجر الصحيح:',
      options: ['He is married to Sarah.', 'He is married with Sarah.'],
      correctIndex: 0,
    },
  },
  {
    pattern: /\b(?:open|close)\s+the\s+(?:light|lamp|tv|computer)\b/i,
    errorTypeAr: 'ترجمة فتح/إغلاق الأجهزة والكهرباء',
    correctedText: 'turn on / turn off',
    explanationAr: 'الأجهزة الكهربائية والأنوار تستخدم turn on / turn off أو switch on / off، وكلمة open مخصصة للأبواب والنوافذ والكتب.',
    motherTongueInfluence: 'في الدارجة العربية نقول (افتح النور / سكّر التلفزيون).',
  },
  {
    pattern: /\blisten\s+(?:the\s+)?(?:music|radio|teacher|podcast)\b/i,
    errorTypeAr: 'إغفال حرف الجر to بعد listen',
    correctedText: 'listen to',
    explanationAr: 'الفعل listen يحتاج دائماً إلى حرف الجر to عند الاستماع لشيء محدد.',
    motherTongueInfluence: 'في العربية نقول (استمع الموسيقا) كفعل متعدٍ مباشرة.',
  },
  {
    pattern: /\b(?:i\s+am|he\s+is|she\s+is)\s+(?:doctor|engineer|teacher|student)\b/i,
    errorTypeAr: 'إغفال أداة النكرة a / an قبل المهن',
    correctedText: 'a / an + المهنة',
    explanationAr: 'في الإنجليزية كل اسم مهنة مفرد معدود يجب أن يسبق بـ a أو an: I am a teacher.',
    motherTongueInfluence: 'في العربية نقول مباشرة: "أنا مهندس" دون أدوات نكرة.',
  },
  {
    pattern: /\bin\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    errorTypeAr: 'حرف الجر مع أيام الأسبوع (on وليس in)',
    correctedText: 'on + اليوم',
    explanationAr: 'مع أيام الأسبوع نستخدم حرف الجر on حصراً (on Friday, on Monday)، بينما in تستخدم للشهور والسنوات.',
    motherTongueInfluence: 'في العربية نقول (في يوم الجمعة) فنترجم "في" تلقائياً إلى in.',
    quickQuiz: {
      questionAr: 'اختر حرف الجر السليم مع يوم الأحد:',
      options: ['I will meet you on Sunday.', 'I will meet you in Sunday.'],
      correctIndex: 0,
    },
  },
  {
    pattern: /\bmore\s+(?:cheap|fast|easy|big|small|tall|short|hard)\b/i,
    errorTypeAr: 'المقارنة الخاطئة للصفات القصيرة (more + صفة قصيرة)',
    correctedText: 'إضافة -er للصفة (cheaper, faster, easier)',
    explanationAr: 'الصفات ذات المقطع الواحد مثل cheap, fast نزيد لها er (cheaper than, faster than) ولا نضع more.',
    motherTongueInfluence: 'في العربية نستخدم كلمة (أكثر) مثل "أكثر سرعة / أكثر رخصاً".',
    quickQuiz: {
      questionAr: 'اختر الصيغة السليمة للمقارنة بين وسيلتي نقل:',
      options: ['This train is faster than the bus.', 'This train is more fast than the bus.'],
      correctIndex: 0,
    },
  },
  {
    pattern: /\bgo\s+to\s+home\b/i,
    errorTypeAr: 'إضافة to قبل كلمة home',
    correctedText: 'go home',
    explanationAr: 'كلمة home ظرف مكان عند الحركة فلا يسبقها حرف الجر to: نقول go home مباشرة.',
    motherTongueInfluence: 'في العربية نقول "أذهب إلى البيت" بحرف جر صريح.',
  },
  {
    pattern: /\bwait\s+(?:him|her|them|me|you)\b/i,
    errorTypeAr: 'إغفال حرف الجر for مع الفعل wait',
    correctedText: 'wait for',
    explanationAr: 'الفعل wait يحتاج دائماً إلى حرف الجر for عند انتظار شخص أو شيء: Please wait for me.',
    motherTongueInfluence: 'في العربية الفعل (انتظر) متعدٍ بنفسه: "انتظرني" دون حرف جر.',
  },
];

export const AI_SCENARIOS: AiScenario[] = [
  {
    id: 'free_chat',
    titleAr: 'محادثة حرة ومفتوحة',
    descAr: 'تحدث مع مستر فارس في أي موضوع بالإنجليزية وتلقّ تصويباً فورياً لطيفاً',
    icon: 'MessageCircle',
    initialMessageEn: "Hello! I am Mr. Fares, your personal English coach. How are you feeling today? Tell me what you did or what you want to practice!",
    initialMessageAr: 'أهلاً بك! أنا مستر فارس، مدربك الخاص. كيف حالك اليوم؟ أخبرني عما فعلته اليوم أو ما ترغب بالتدرب عليه!',
    systemPrompt: `You are Mr. Fares (مستر فارس), an enthusiastic, warm, culturally attuned Master English Instructor who specializes in teaching native Arabic speakers. 
Your tone is encouraging, polite, concise, and pedagogical.
Speak natural, clear English suited to the user's level.
If the learner makes a grammar, preposition, or pronunciation mistake typical for Arabic speakers (like "I am agree", "married with", omitting "to be", confusing P and B), gently provide:
1. A warm conversational reply in natural English.
2. A short Arabic coaching note explaining the mistake, the Arabic interference reason, and the correct natural alternative.
Keep responses concise (2-4 sentences in English, 1-2 lines in Arabic if correcting).`,
    sampleReplies: [
      "Hello Mr. Fares! Today was a busy day at work.",
      "I want to practice speaking about my hobbies.",
      "Can you help me improve my vocabulary?",
    ],
    levelVariants: {
      A0: {
        initialMessageEn: "Hello! I am Mr. Fares. I am happy to meet you! How are you today? You can say: I am fine, thank you.",
        initialMessageAr: "مرحباً! أنا مستر فارس. سعيد بلقائك! كيف حالك اليوم؟ يمكنك الرد بقول: I am fine, thank you.",
        descAr: 'محادثة تمهيدية مبسطة بالألفاظ الأساسية والتحيات اليومية للمبتدئ تماماً (A0)',
        sampleReplies: [
          "Hello Mr. Fares! I am fine.",
          "My name is Ahmed.",
          "I want to learn English.",
        ],
      },
      A1: {
        initialMessageEn: "Hello! Welcome back to practice. What did you do today? Tell me one simple activity you enjoyed!",
        initialMessageAr: "مرحباً! أهلاً بك مجدداً. ماذا فعلت اليوم؟ أخبرني بنشاط بسيط استمتعت به!",
        descAr: 'تدريب على المضارع البسيط والأنشطة اليومية والأسئلة الشائعة (A1)',
        sampleReplies: [
          "I worked today and drank hot coffee.",
          "I like watching English videos with subtitles.",
          "Today the weather was sunny and warm.",
        ],
      },
      A2: {
        initialMessageEn: "Welcome to Level A2 coaching! Let's practice connecting our ideas with past simple, plans, and reasons. What did you do last weekend, or what are your plans for tomorrow?",
        initialMessageAr: "أهلاً بك في تدريب المستوى A2! لنتدرب على ربط الجمل بالماضي البسيط والتخطيط للمستقبل والأسباب. ماذا فعلت في عطلة نهاية الأسبوع، أو ما خططك للغد؟",
        descAr: 'تدريب المستوى A2: الماضي البسيط، المقارنات، حروف الجر الزمنية، والخطط بـ going to',
        sampleReplies: [
          "Last weekend, I traveled to Alexandria by train with my family.",
          "I didn't go to the office yesterday because I worked from home.",
          "Tomorrow I am going to buy a new laptop for my studies.",
        ],
      },
      B1: {
        initialMessageEn: "Great to see you at Level B1! Today let's discuss your career goals, personal experiences, and opinions. Have you ever faced a major challenge at work or university that changed your mindset?",
        initialMessageAr: "رائع أن أراك في المستوى B1! لنتناقش اليوم حول أهدافك المهنية، تجاربك الشخصية، وآرائك. هل واجهت تحدياً كبيراً غيّر نظرتك للأمور؟",
        descAr: 'تدريب المستوى B1: المضارع التام، جمل الشرط، والتعبير عن الآراء ووجهات النظر',
        sampleReplies: [
          "Yes, I have been working in my field for three years and learned a lot.",
          "If I had more free time, I would definitely read more books.",
          "In my opinion, consistent daily practice is the real key to fluency.",
        ],
      },
      B2: {
        initialMessageEn: "Welcome to advanced Level B2 coaching! We'll refine your nuance, idioms, and discourse cohesion. What is your stance on remote work versus office culture in terms of productivity and mental well-being?",
        initialMessageAr: "أهلاً بك في تدريب المستوى B2 المتقدم! سنصقل دقة التعبير والمصطلحات والترابط البلاغي. ما رأيك في العمل عن بعد مقارنة بالعمل المكتبي؟",
        descAr: 'تدريب المستوى B2: النقاشات المعمقة، التعبيرات الاصطلاحية، ووزن الحجج المنطقية',
        sampleReplies: [
          "While remote work offers flexibility, it can occasionally blur work-life boundaries.",
          "From a managerial perspective, cultivating team culture requires intentional communication.",
          "I believe hybrid models provide the most sustainable balance for modern organizations.",
        ],
      },
    },
  },
  {
    id: 'coffee_shop',
    titleAr: 'طلب قهوة ومأكولات في مقهى',
    descAr: 'تمثيل دور طلب المشروب، الحجم، نوع الحليب، والدفع في مقهى عالمي',
    icon: 'Coffee',
    initialMessageEn: "Hi there! Welcome to Coffee Central. What can I get started for you today?",
    initialMessageAr: 'مرحباً! أهلاً بك في مقهى كوفي سنترال. ماذا تحب أن أطلب لك اليوم؟',
    systemPrompt: `You are the friendly barista at an artisanal international coffee shop named Coffee Central.
Engage the user in a realistic ordering roleplay: ask about coffee size (small, medium, large), iced or hot, milk preferences (oat, almond, whole), and food pastries.
Correct any unnatural English or Arabic transfer habits gently with an Arabic tip.`,
    sampleReplies: [
      "I would like a medium iced latte with oat milk, please.",
      "Do you have fresh croissants today?",
      "How much is a cappuccino and a bottle of water?",
    ],
    levelVariants: {
      A0: {
        initialMessageEn: "Hello! Welcome to the coffee shop. Do you want tea or coffee?",
        initialMessageAr: "مرحباً! أهلاً بك في المقهى. هل تفضل الشاي أم القهوة؟",
        sampleReplies: [
          "Coffee with milk, please.",
          "Tea with sugar, please.",
          "How much is this?",
        ],
      },
      A1: {
        initialMessageEn: "Hi there! What can I get for you today? We have hot drinks, cold juices, and fresh donuts.",
        initialMessageAr: "مرحباً! ماذا أطلب لك اليوم؟ لدينا مشروبات ساخنة وعصائر باردة ودونات طازجة.",
        sampleReplies: [
          "Can I have a small cappuccino, please?",
          "Do you have chocolate donuts today?",
          "Can I pay with credit card?",
        ],
      },
      A2: {
        initialMessageEn: "Good morning! What drink can I prepare for you today? Which size would you like, and would you prefer oat milk, almond milk, or regular whole milk? We also have warm toasted croissants.",
        initialMessageAr: "صباح الخير! أي مشروب أجهزه لك اليوم؟ ما الحجم الذي تفضله، وهل تفضل حليب الشوفان أم اللوز أم الحليب العادي؟ لدينا أيضاً كرواسون دافئ محمص.",
        sampleReplies: [
          "I would like a medium iced latte with oat milk and a little vanilla, please.",
          "Could you warm up a butter croissant for me as well?",
          "This coffee is sweeter than the one I had yesterday! How much is it?",
        ],
      },
      B1: {
        initialMessageEn: "Welcome back! Are you going with your customary flat white today, or would you like to sample our single-origin Ethiopian pour-over? It features lovely notes of bergamot and jasmine.",
        initialMessageAr: "أهلاً بك مجدداً! هل ستطلب فلات وايت المعتاد، أم ترغب بتجربة قهوة التقطير الإثيوبية الفاخرة؟ تتميز بنكهات البرغموت والياسمين.",
        sampleReplies: [
          "I'd love to try the Ethiopian pour-over! Could you ensure it's brewed slightly less acidic?",
          "I usually lean towards dark roasts, but I'm eager to expand my palate.",
          "Do you roast these beans in-house or source them from a specialty roastery?",
        ],
      },
    },
  },
  {
    id: 'job_interview',
    titleAr: 'مقابلة عمل مهنية بالإنجليزية',
    descAr: 'محاكاة مقابلة توظيف: التعريف بالخبرات، نقاط القوة، والمشاريع السابقة',
    icon: 'Briefcase',
    initialMessageEn: "Welcome! Thank you for coming in today. To start, could you please introduce yourself and walk me through your professional background?",
    initialMessageAr: 'أهلاً بك! شكراً لحضورك المقابلة اليوم. كبداية، هل يمكنك التفضل بالتعريف بنفسك وسرد خلفيتك المهنية باختصار؟',
    systemPrompt: `You are an executive hiring manager conducting a professional, respectful job interview in English.
Ask realistic interview questions one by one.
Guide the user to sound confident, articulate, and natural in business English.
If they make mistakes with past tenses, present perfect, or prepositions, provide a subtle Arabic refinement tip.`,
    sampleReplies: [
      "Sure! I have over four years of experience in project management.",
      "My greatest strength is solving complex problems under tight deadlines.",
      "I led a cross-functional team to launch a digital transformation project.",
    ],
    levelVariants: {
      A0: {
        initialMessageEn: "Welcome! Nice to meet you. What is your name and what job do you want?",
        initialMessageAr: "أهلاً بك! تشرفت بلقائك. ما اسمك وما الوظيفة التي تبحث عنها؟",
        sampleReplies: [
          "My name is Ali. I want to work here.",
          "I am a software engineer.",
          "I like your company very much.",
        ],
      },
      A1: {
        initialMessageEn: "Hello, welcome! Please tell me about your job experience and your daily work routine.",
        initialMessageAr: "مرحباً، أهلاً بك! أخبرني من فضلك عن خبرتك الوظيفية وروتينك اليومي في العمل.",
        sampleReplies: [
          "I have two years of experience in customer service.",
          "Every day, I answer emails and talk to clients on the phone.",
          "I am very organized and punctual.",
        ],
      },
      A2: {
        initialMessageEn: "Thank you for coming in today. Could you please describe your previous job, what responsibilities you handled, and why you decided to apply for this new role?",
        initialMessageAr: "شكراً لحضورك اليوم. هل يمكنك وصف وظيفتك السابقة، والمسؤوليات التي كنت تديرها، ولماذا قررت التقديم لهذه الوظيفة الجديدة؟",
        sampleReplies: [
          "In my previous job, I managed daily client accounts and prepared weekly sales reports.",
          "Last year, I helped my team improve our response time by twenty percent.",
          "I decided to apply here because your company offers stronger career growth opportunities.",
        ],
      },
      B1: {
        initialMessageEn: "Good afternoon. Could you walk me through a complex scenario where a project was falling behind schedule, and how you intervened to deliver results on time?",
        initialMessageAr: "مساء الخير. هل يمكنك سرد موقف معقد تأخر فيه جدول مشروع ما، وكيف تدخلت لإنجازه في الموعد المحدد؟",
        sampleReplies: [
          "When our primary vendor missed their deadline, I quickly negotiated with a local backup supplier.",
          "I reprioritized the critical path deliverables and held daily ten-minute standup syncs.",
          "As a result, we launched on schedule and exceeded our client satisfaction benchmark.",
        ],
      },
    },
  },
  {
    id: 'airport_travel',
    titleAr: 'في المطار وحجز الفندق',
    descAr: 'تسجيل الدخول في المطار، الجوازات، والتعامل مع الفندق والمواصلات',
    icon: 'Plane',
    initialMessageEn: "Good afternoon, sir/madam. May I see your passport and flight confirmation code, please?",
    initialMessageAr: 'مساء الخير. هل يمكنني رؤية جواز سفرك ورمز تأكيد الرحلة من فضلك؟',
    systemPrompt: `You are an airline check-in officer and airport immigration officer.
Roleplay airport scenarios: luggage check, window vs aisle seat, boarding gate, immigration questions ("Purpose of your visit?").
Correct Arabic speaker travel phrasing traps.`,
    sampleReplies: [
      "Here is my passport and boarding pass.",
      "I would prefer a window seat, please.",
      "I have one piece of check-in luggage and a carry-on bag.",
    ],
    levelVariants: {
      A0: {
        initialMessageEn: "Hello! Passport and ticket, please. Where are you going?",
        initialMessageAr: "مرحباً! جواز السفر والتذكرة من فضلك. إلى أين تسافر؟",
        sampleReplies: [
          "Here is my passport. I fly to London.",
          "Window seat, please.",
          "Where is gate 4?",
        ],
      },
      A1: {
        initialMessageEn: "Good afternoon! Where is your flight heading today? Do you have any bags to check in?",
        initialMessageAr: "مساء الخير! إلى أين تتجه رحلتك اليوم؟ هل لديك حقائب لشحنها؟",
        sampleReplies: [
          "I am flying to Dubai. I have one suitcase.",
          "Could I have a window seat, please?",
          "What time does boarding start?",
        ],
      },
      A2: {
        initialMessageEn: "Good afternoon! Where is your final destination today? How many bags do you wish to check in, and would you like an aisle seat or a window seat near the front of the aircraft?",
        initialMessageAr: "مساء الخير! ما هي وجهتك النهائية اليوم؟ كم حقيبة تود شحنها، وهل تفضل مقعداً بجانب الممر أم النافذة في مقدمة الطائرة؟",
        sampleReplies: [
          "I am flying to Frankfurt with one checked bag and one carry-on backpack.",
          "Could you please seat me in an aisle seat so I can move easily?",
          "Is the flight on time, and which security checkpoint should I go through?",
        ],
      },
      B1: {
        initialMessageEn: "Welcome to International Check-in. I notice your itinerary includes a 90-minute layover in Amsterdam. Would you like your baggage checked all the way through to Toronto?",
        initialMessageAr: "أهلاً بك في تسجيل السفر الدولي. ألاحظ أن خط سيرك يتضمن ترانزيت لمدة 90 دقيقة في أمستردام. هل تفضل شحن حقائبك مباشرة إلى تورونتو؟",
        sampleReplies: [
          "Yes please, check them straight through to Toronto so I don't have to re-claim them.",
          "In case of a gate delay, is there automated rebooking via your airline app?",
          "Could you verify if my frequent flyer miles have been credited to this booking?",
        ],
      },
    },
  },
  {
    id: 'clinic_visit',
    titleAr: 'في عيادة الطبيب والصيدلية',
    descAr: 'وصف الأعراض الطبية، الألم، وتلقي تعليمات العلاج والجرعات بالإنجليزية',
    icon: 'Activity',
    initialMessageEn: "Hello, please take a seat. What seems to be the problem today? Where is the pain?",
    initialMessageAr: 'أهلاً بك، تفضل بالجلوس. ما المشكلة التي تعاني منها اليوم؟ وأين موضع الألم؟',
    systemPrompt: `You are a caring doctor at an international clinic.
Help the patient describe symptoms (headache, sore throat, fever, nausea, sprained ankle).
Teach accurate medical vocabulary (e.g. difference between pain, ache, hurt, prescribe, dosage).`,
    sampleReplies: [
      "I have had a severe headache and fever since yesterday.",
      "My throat hurts when I swallow food.",
      "Do I need a prescription for this medicine?",
    ],
    levelVariants: {
      A0: {
        initialMessageEn: "Hello, sit down please. Where is the pain? Headache or stomach pain?",
        initialMessageAr: "مرحباً، تفضل بالجلوس. أين الألم؟ صداع في الرأس أم ألم في المعدة؟",
        sampleReplies: [
          "I have a headache.",
          "My stomach hurts.",
          "I need medicine, please.",
        ],
      },
      A1: {
        initialMessageEn: "Hello! What is hurting you today? Do you have a fever, cough, or sore throat?",
        initialMessageAr: "مرحباً! ما الذي يؤلمك اليوم؟ هل تشعر بحمى أم سعال أم احتقان بالحلق؟",
        sampleReplies: [
          "I have a sore throat and fever since yesterday.",
          "I feel dizzy when I stand up.",
          "How many times a day should I take this pill?",
        ],
      },
      A2: {
        initialMessageEn: "Hello, please take a seat. How long have you been feeling unwell, and have you taken any over-the-counter painkillers or cough syrup before coming in?",
        initialMessageAr: "مرحباً، تفضل بالجلوس. منذ متى وأنت تشعر بالتعب، وهل تناولت أي مسكنات عادية أو شراب للسعال قبل الحضور إلينا؟",
        sampleReplies: [
          "I started feeling unwell two days ago, and I took two paracetamol pills this morning.",
          "My throat hurts severely when I swallow, and I have had a dry cough since Tuesday.",
          "Do I need a doctor's prescription for this antibiotic, or is it available over the counter?",
        ],
      },
      B1: {
        initialMessageEn: "Good morning. I've been reviewing your medical history. Could you describe the severity of these symptoms and whether they fluctuate throughout the day?",
        initialMessageAr: "صباح الخير. لقد راجعت سجلك الطبي. هل يمكنك وصف شدة هذه الأعراض وما إذا كانت تتفاوت وتتقلب على مدار اليوم؟",
        sampleReplies: [
          "The stiffness in my lower back tends to be much worse upon waking up in the morning.",
          "Are there any notable side effects, such as drowsiness or gastrointestinal upset?",
          "Should I schedule a follow-up consultation if the symptoms don't subside after a week?",
        ],
      },
    },
  },
];

export function getScenarioForLevel(scenario: AiScenario, level: CEFRLevel): {
  initialMessageEn: string;
  initialMessageAr: string;
  systemPrompt: string;
  sampleReplies: string[];
  descAr: string;
} {
  const variant = scenario.levelVariants?.[level];
  if (variant) {
    return {
      initialMessageEn: variant.initialMessageEn,
      initialMessageAr: variant.initialMessageAr,
      systemPrompt: variant.systemPrompt || `${scenario.systemPrompt}\nTarget CEFR Level: ${level}. Respond strictly using English vocabulary and sentence structures appropriate for a ${level} learner.`,
      sampleReplies: variant.sampleReplies,
      descAr: variant.descAr || scenario.descAr,
    };
  }
  return {
    initialMessageEn: scenario.initialMessageEn,
    initialMessageAr: scenario.initialMessageAr,
    systemPrompt: `${scenario.systemPrompt}\nTarget CEFR Level: ${level}. Adjust vocabulary and sentence structure strictly to ${level}.`,
    sampleReplies: scenario.sampleReplies,
    descAr: scenario.descAr,
  };
}
