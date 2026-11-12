import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Check, X, HelpCircle, Layers, MessageSquare, Mic, Bell } from 'lucide-react';
import { alphabetLetters, phonicsDigraphs, survivalPhrases, phonicsQuizItems } from '../../data/phonicsData';
import { AudioButton } from '../common/AudioButton';
import { playClick, playError, playSuccess, speakText } from '../../utils/audio';
import { useLearner } from '../../context/LearnerContext';
import { CEFRLevel } from '../../types';

interface AlphabetPhonicsStudioProps {
  level?: CEFRLevel;
}

// A2 Silent Letters dataset
const SILENT_LETTERS_DATA = [
  {
    letter: 'Silent K',
    ruleAr: 'يكون حرف K صامتاً تماماً إذا جاء في أول الكلمة متبوعاً بحرف N.',
    arabicMistakeNote: 'يميل المتعلم العربي لنطق الكاف في كسر للكلمة (كنايف). النطق الصحيح يبدأ فوراً بحرف N.',
    words: [
      { en: 'knife', ipa: '/naɪf/', ar: 'سكين', phoneticAr: 'نَايْف' },
      { en: 'knee', ipa: '/niː/', ar: 'ركبة', phoneticAr: 'نِي' },
      { en: 'know', ipa: '/noʊ/', ar: 'يعرف', phoneticAr: 'نُو' },
      { en: 'knight', ipa: '/naɪt/', ar: 'فارس', phoneticAr: 'نَايْت' },
      { en: 'knock', ipa: '/nɑːk/', ar: 'يطرق', phoneticAr: 'نَاك' },
      { en: 'knot', ipa: '/nɑːt/', ar: 'عقدة', phoneticAr: 'نَات' },
    ],
  },
  {
    letter: 'Silent B',
    ruleAr: 'يكون حرف B صامتاً إذا جاء في آخر الكلمة بعد M، أو قبل حرف T.',
    arabicMistakeNote: 'لا تنطق الباء في climb أو doubt؛ الصوت ينتهي عند الميم في climb أو يبدأ بالتاء في doubt.',
    words: [
      { en: 'climb', ipa: '/klaɪm/', ar: 'يتسلق', phoneticAr: 'كْلَايْم' },
      { en: 'comb', ipa: '/koʊm/', ar: 'مشط', phoneticAr: 'كُوم' },
      { en: 'doubt', ipa: '/daʊt/', ar: 'شك', phoneticAr: 'دَاوْت' },
      { en: 'debt', ipa: '/det/', ar: 'دَيْن مالي', phoneticAr: 'دِت' },
      { en: 'lamb', ipa: '/læm/', ar: 'حمل صغير', phoneticAr: 'لَام' },
      { en: 'thumb', ipa: '/θʌm/', ar: 'إبهام', phoneticAr: 'ثَام' },
    ],
  },
  {
    letter: 'Silent W',
    ruleAr: 'يكون حرف W صامتاً إذا جاء في بداية الكلمة متبوعاً بـ R، أو في بعض الكلمات الشائعة.',
    arabicMistakeNote: 'ابدأ بصوت الراء مباشرة: write تنطق تماماً مثل right.',
    words: [
      { en: 'write', ipa: '/raɪt/', ar: 'يكتب', phoneticAr: 'رَايْت' },
      { en: 'wrong', ipa: '/rɔːŋ/', ar: 'خاطئ', phoneticAr: 'رُونْغ' },
      { en: 'wrist', ipa: '/rɪst/', ar: 'معصم اليد', phoneticAr: 'رِسْت' },
      { en: 'answer', ipa: '/ˈæn.sɚ/', ar: 'إجابة / يجيب', phoneticAr: 'آنْسَر' },
      { en: 'sword', ipa: '/sɔːrd/', ar: 'سيف', phoneticAr: 'سُورْد' },
      { en: 'wrap', ipa: '/ræp/', ar: 'يغلّف', phoneticAr: 'رَاب' },
    ],
  },
  {
    letter: 'Silent L',
    ruleAr: 'غالباً ما يسكت حرف L بين حرف علة وحرف K أو M أو F.',
    arabicMistakeNote: 'تجنب نطق اللام في walk أو talk؛ الكلمة تمتد فيها الواو ثم الكاف مباشرة.',
    words: [
      { en: 'walk', ipa: '/wɔːk/', ar: 'يمشي', phoneticAr: 'وُوك' },
      { en: 'talk', ipa: '/tɔːk/', ar: 'يتحدث', phoneticAr: 'تُوك' },
      { en: 'half', ipa: '/hæf/', ar: 'نصف', phoneticAr: 'هَاف' },
      { en: 'calm', ipa: '/kɑːm/', ar: 'هادئ', phoneticAr: 'كَام' },
      { en: 'salmon', ipa: '/ˈsæm.ən/', ar: 'سمك السلمون', phoneticAr: 'سَامُون' },
      { en: 'could', ipa: '/kʊd/', ar: 'استطاع', phoneticAr: 'كُود' },
    ],
  },
  {
    letter: 'Silent H & G',
    ruleAr: 'حرف H صامت في كلمات شائعة مثل hour و honest؛ وحرف G صامت قبل N في sign و foreign.',
    arabicMistakeNote: 'كلمة hour تبدأ بصوت متحرك لذا تأخذ an hour وليس a hour.',
    words: [
      { en: 'hour', ipa: '/aʊ.ɚ/', ar: 'ساعة زمنية', phoneticAr: 'آوَر' },
      { en: 'honest', ipa: '/ˈɑː.nɪst/', ar: 'صادق وأمين', phoneticAr: 'آنِسْت' },
      { en: 'ghost', ipa: '/ɡoʊst/', ar: 'شبح', phoneticAr: 'غُوسْت' },
      { en: 'sign', ipa: '/saɪn/', ar: 'لافتة / يوقع', phoneticAr: 'سَايْن' },
      { en: 'foreign', ipa: '/ˈfɔːr.ən/', ar: 'أجنبي', phoneticAr: 'فُورِن' },
      { en: 'design', ipa: '/dɪˈzaɪn/', ar: 'تصميم', phoneticAr: 'دِيزَايْن' },
    ],
  },
];

// A2 Past Simple -ED Endings Guide
const PAST_ED_RULES = [
  {
    sound: '/t/',
    titleAr: 'تنطق تاءً صريحة /t/',
    ruleAr: 'إذا انتهى الفعل الأصلي بصوت مهموس غير مجهور: (P, K, S, SH, CH, F, X)',
    arabicNote: 'لا تنطق إد! فقط المس سقف فمك بالتاء فوراً بعد الحرف الأخير.',
    examples: [
      { word: 'walked', ipa: '/wɔːkt/', ar: 'مشى' },
      { word: 'helped', ipa: '/helpt/', ar: 'ساعد' },
      { word: 'watched', ipa: '/wɑːtʃt/', ar: 'شاهد' },
      { word: 'washed', ipa: '/wɑːʃt/', ar: 'غسل' },
      { word: 'laughed', ipa: '/læft/', ar: 'ضحك' },
      { word: 'fixed', ipa: '/fɪkst/', ar: 'أصلح' },
    ],
  },
  {
    sound: '/d/',
    titleAr: 'تنطق دالاً خفيفة /d/',
    ruleAr: 'إذا انتهى الفعل بصوت مجهور تهتز فيه الأوتار الصوتية: (B, G, V, Z, M, N, L, R أو حرف علة)',
    arabicNote: 'أكثر الصيغ شيوعاً؛ دال خفيفة مسترخية تتبع الحرف الأخير بانسياب.',
    examples: [
      { word: 'played', ipa: '/pleɪd/', ar: 'لعب' },
      { word: 'lived', ipa: '/lɪvd/', ar: 'عاش' },
      { word: 'cleaned', ipa: '/kliːnd/', ar: 'نظف' },
      { word: 'opened', ipa: '/ˈoʊ.pənd/', ar: 'فتح' },
      { word: 'loved', ipa: '/lʌvd/', ar: 'أحب' },
      { word: 'called', ipa: '/kɔːld/', ar: 'اتصل' },
    ],
  },
  {
    sound: '/ɪd/',
    titleAr: 'تنطق مقطعاً زائداً /ɪd/',
    ruleAr: 'فقط وحصرياً إذا انتهى الفعل بصوت T أو D لتسهيل الفصل بين الحرفين المتشابهين.',
    arabicNote: 'هنا فقط يضاف مقطع صوتي كامل زائد ينطق إد.',
    examples: [
      { word: 'waited', ipa: '/ˈweɪ.tɪd/', ar: 'انتظر' },
      { word: 'needed', ipa: '/ˈniː.dɪd/', ar: 'احتاج' },
      { word: 'decided', ipa: '/dɪˈsaɪ.dɪd/', ar: 'قرر' },
      { word: 'wanted', ipa: '/ˈwɑːn.tɪd/', ar: 'أراد' },
      { word: 'started', ipa: '/ˈstɑːr.tɪd/', ar: 'بدأ' },
      { word: 'invited', ipa: '/ɪnˈvaɪ.tɪd/', ar: 'دعا' },
    ],
  },
];

// A2 Phonics Quiz Items
const A2_PHONICS_QUIZ = [
  {
    id: 'a2-ph-1',
    questionAr: 'في أي من الكلمات التالية يكون حرف K صامتاً تماماً لا يُلفظ؟',
    options: ['Knife', 'Kitchen', 'King', 'Kite'],
    correctIndex: 0,
    explanationAr: 'حرف K صامت في Knife لأنه متبوع بـ N في بداية الكلمة.',
  },
  {
    id: 'a2-ph-2',
    questionAr: 'كيف يُنطق مقطع -ed في الفعل الماضي walked؟',
    options: ['صوت /t/ تاء صريحة', 'صوت /ɪd/ مقطع إد', 'صوت /d/ دال'],
    correctIndex: 0,
    explanationAr: 'الفعل walk ينتهي بصوت K المهموس، لذا تأخذ نهاية -ed صوت /t/: /wɔːkt/.',
  },
  {
    id: 'a2-ph-3',
    questionAr: 'ما هو الحرف الصامت في كلمة "doubt" (شك)؟',
    options: ['حرف B', 'حرف D', 'حرف U', 'حرف T'],
    correctIndex: 0,
    explanationAr: 'حرف B صامت عندما يسبق حرف T في كلمات مثل doubt و debt.',
  },
  {
    id: 'a2-ph-4',
    questionAr: 'أي من الأفعال التالية يُنطق مقطع -ed فيه كصوت /ɪd/ كامل؟',
    options: ['Decided', 'Played', 'Watched', 'Cleaned'],
    correctIndex: 0,
    explanationAr: 'فقط الأفعال المنتهية بـ T أو D تأخذ /ɪd/ مثل decided و waited و needed.',
  },
  {
    id: 'a2-ph-5',
    questionAr: 'حرف L صامت تماماً في أي من الكلمات التالية؟',
    options: ['Talk', 'Tell', 'Like', 'Lamp'],
    correctIndex: 0,
    explanationAr: 'في كلمة Talk حرف L صامت تماماً وتُنطق /tɔːk/.',
  },
];

export const AlphabetPhonicsStudio: React.FC<AlphabetPhonicsStudioProps> = ({ level }) => {
  const { progress } = useLearner();
  const currentLevel = level || progress.estimatedLevel;

  // Set default tab based on CEFR level: A2+ learners default to silent letters & -ed endings
  const isA2OrAbove = currentLevel === 'A2' || currentLevel === 'B1' || currentLevel === 'B2' || currentLevel === 'C1' || currentLevel === 'C2';
  const [subTab, setSubTab] = useState<'letters' | 'digraphs' | 'silent_letters' | 'past_ed' | 'survival' | 'quiz'>(
    isA2OrAbove ? 'silent_letters' : 'letters'
  );
  const [vowelOnly, setVowelOnly] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isA2OrAbove && (subTab === 'letters' || subTab === 'survival')) {
      setSubTab('silent_letters');
    }
  }, [currentLevel]);

  const filteredLetters = vowelOnly ? alphabetLetters.filter((l) => l.isVowel) : alphabetLetters;

  const handleQuizAnswer = (qId: string, optIdx: number, correctIdx: number) => {
    if (quizAnswers[qId] !== undefined) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    if (optIdx === correctIdx) {
      playSuccess(progress.soundEffectsEnabled);
    } else {
      playError(progress.soundEffectsEnabled);
    }
  };

  const activeQuizList = isA2OrAbove ? A2_PHONICS_QUIZ : phonicsQuizItems;

  return (
    <div className="space-y-6 text-right">
      {/* Studio Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#131f24] border-2 border-b-4 border-[#e5e5e5] dark:border-[#37464f] border-b-[#cecece] dark:border-b-[#263137] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-en text-xs font-black px-2.5 py-0.5 rounded-xl bg-[#1cb0f6] text-white">
              {currentLevel} Phonetics
            </span>
            <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
              استوديو الصوتيات المتقدم | مستوى {currentLevel}
            </h2>
          </div>
          <p className="text-xs text-[#777777] dark:text-[#afafaf] font-bold">
            {isA2OrAbove
              ? `صوتيات المستوى (${currentLevel}): الحروف الصامتة الأكثر إرباكاً للمتعلم العربي، ومخارج نهايات الماضي البسيط (-ed)، والتمييز النطقي الدقيق.`
              : 'أتقن مخارج الحروف الإنجليزية، والتمييز بين اسم الحرف وصوته، والحروف المركبة والأزواج الدقيقة.'}
          </p>
        </div>

        {/* Sub-Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#f7f7f7] dark:bg-[#202f36] rounded-2xl shrink-0">
          {/* A2 Specific tabs */}
          {isA2OrAbove && (
            <>
              <button
                type="button"
                onClick={() => {
                  playClick(progress.soundEffectsEnabled);
                  setSubTab('silent_letters');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  subTab === 'silent_letters'
                    ? 'bg-[#1cb0f6] text-white shadow-xs'
                    : 'text-[#777777] dark:text-[#afafaf] hover:text-slate-900'
                }`}
              >
                🤫 الحروف الصامتة (Silent Letters)
              </button>

              <button
                type="button"
                onClick={() => {
                  playClick(progress.soundEffectsEnabled);
                  setSubTab('past_ed');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  subTab === 'past_ed'
                    ? 'bg-[#1cb0f6] text-white shadow-xs'
                    : 'text-[#777777] dark:text-[#afafaf] hover:text-slate-900'
                }`}
              >
                🔊 نطق الماضي (-ed)
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              playClick(progress.soundEffectsEnabled);
              setSubTab('digraphs');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTab === 'digraphs'
                ? 'bg-[#1cb0f6] text-white shadow-xs'
                : 'text-[#777777] dark:text-[#afafaf] hover:text-slate-900'
            }`}
          >
            المقاطع المركبة (SH, CH, TH)
          </button>

          <button
            type="button"
            onClick={() => {
              playClick(progress.soundEffectsEnabled);
              setSubTab('letters');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTab === 'letters'
                ? 'bg-[#1cb0f6] text-white shadow-xs'
                : 'text-[#777777] dark:text-[#afafaf] hover:text-slate-900'
            }`}
          >
            الأبجدية (26 حرفاً)
          </button>

          {!isA2OrAbove && (
            <button
              type="button"
              onClick={() => {
                playClick(progress.soundEffectsEnabled);
                setSubTab('survival');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                subTab === 'survival'
                  ? 'bg-[#1cb0f6] text-white shadow-xs'
                  : 'text-[#777777] dark:text-[#afafaf] hover:text-slate-900'
              }`}
            >
              عبارات النجاة
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playClick(progress.soundEffectsEnabled);
              setSubTab('quiz');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTab === 'quiz'
                ? 'bg-[#1cb0f6] text-white shadow-xs'
                : 'text-[#777777] dark:text-[#afafaf] hover:text-slate-900'
            }`}
          >
            اختبار الصوتيات ({isA2OrAbove ? 'A2' : 'A0'})
          </button>
        </div>
      </div>

      {/* 1. A2 Silent Letters Lab */}
      {subTab === 'silent_letters' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#e5f6ff] dark:bg-[#183648] border-2 border-[#1cb0f6] text-[#0f5478] dark:text-[#a0ddff] text-xs font-bold leading-relaxed">
            💡 <strong>قاعدة هامة لمتعلمي المستوى A2:</strong> في اللغة العربية، كل حرف يُكتب يُنطق بالضرورة. لكن في الإنجليزية، العديد من الحروف صامتة تماماً بسبب التطور التاريخي للغة. تدرب على هذه المجموعات الست وتجنب نطق الحرف الصامت!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SILENT_LETTERS_DATA.map((group, gIdx) => (
              <div
                key={gIdx}
                className="p-6 rounded-3xl bg-white dark:bg-[#131f24] border-2 border-b-4 border-[#e5e5e5] dark:border-[#37464f] border-b-[#cecece] dark:border-b-[#263137] shadow-xs space-y-4"
              >
                <div className="border-b border-[#f0f0f0] dark:border-[#263137] pb-3 flex items-baseline justify-between gap-2">
                  <h3 className="font-en text-xl font-black text-[#1cb0f6]">{group.letter}</h3>
                  <span className="text-xs font-black text-[#777777] dark:text-[#afafaf]">{group.words.length} كلمات شائعة</span>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                  {group.ruleAr}
                </p>

                <div className="p-3 rounded-2xl bg-[#fff4e5] dark:bg-[#392415] border border-[#ff9600] text-[#7a4100] dark:text-[#ffd699] text-[11px] leading-relaxed font-black">
                  ⚠️ خطأ شائع: {group.arabicMistakeNote}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {group.words.map((item, wIdx) => (
                    <div
                      key={wIdx}
                      className="p-3 rounded-2xl bg-[#f7f7f7] dark:bg-[#202f36] border-2 border-[#e5e5e5] dark:border-[#37464f] flex items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <span className="font-en text-sm font-black text-slate-900 dark:text-white block truncate">
                          {item.en}
                        </span>
                        <span className="text-[11px] font-bold text-[#1cb0f6] block">
                          ({item.phoneticAr})
                        </span>
                        <span className="text-[10px] text-[#afafaf] font-black block truncate">
                          {item.ar}
                        </span>
                      </div>
                      <AudioButton textToSpeak={item.en} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. A2 Past Simple -ED Endings Lab */}
      {subTab === 'past_ed' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#eefbe7] dark:bg-[#1a3818] border-2 border-[#58cc02] text-[#2d6600] dark:text-[#a5ff6b] text-xs font-bold leading-relaxed">
            ✨ <strong>نهايات الماضي البسيط في المستوى A2:</strong> لا تنطق كل -ed كـ "إد"! تنطق تاءً /t/ بعد الحروف المهموسة، ودالاً /d/ بعد المجهورة، وفقط تنطق /ɪd/ إذا كان الفعل ينتهي أصلاً بـ T أو D.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PAST_ED_RULES.map((rule, rIdx) => (
              <div
                key={rIdx}
                className="p-6 rounded-3xl bg-white dark:bg-[#131f24] border-2 border-b-4 border-[#e5e5e5] dark:border-[#37464f] border-b-[#cecece] dark:border-b-[#263137] shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="border-b border-[#f0f0f0] dark:border-[#263137] pb-3 space-y-1">
                    <span className="font-en text-2xl font-black text-[#58cc02] block">{rule.sound}</span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">{rule.titleAr}</h3>
                  </div>

                  <p className="text-xs text-[#777777] dark:text-[#afafaf] font-bold leading-relaxed">
                    {rule.ruleAr}
                  </p>

                  <div className="p-3 rounded-2xl bg-[#f7f7f7] dark:bg-[#202f36] border border-[#e5e5e5] dark:border-[#37464f] text-[11px] text-slate-800 dark:text-slate-200 font-black">
                    💡 {rule.arabicNote}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#f0f0f0] dark:border-[#263137]">
                  <span className="text-[11px] font-black text-[#afafaf] block">أمثلة صوتية استمع لها:</span>
                  <div className="space-y-1.5">
                    {rule.examples.map((ex, eIdx) => (
                      <div
                        key={eIdx}
                        className="p-2.5 rounded-xl bg-[#fafafa] dark:bg-[#182329] border border-[#e5e5e5] dark:border-[#37464f] flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <AudioButton textToSpeak={ex.word} size="sm" />
                          <span className="font-en text-xs font-black text-slate-900 dark:text-white">
                            {ex.word}
                          </span>
                          <span className="font-en text-[11px] text-[#afafaf] font-bold">
                            {ex.ipa}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#777777] dark:text-[#afafaf]">
                          {ex.ar}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Digraphs Tab */}
      {subTab === 'digraphs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {phonicsDigraphs.map((dg) => (
            <div
              key={dg.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#131f24] border-2 border-b-4 border-[#e5e5e5] dark:border-[#37464f] border-b-[#cecece] dark:border-b-[#263137] shadow-xs space-y-4"
            >
              <div className="border-b border-[#f0f0f0] dark:border-[#263137] pb-3 space-y-1">
                <span className="text-xs text-[#afafaf] font-bold block">{dg.titleAr}</span>
                <div className="flex items-baseline gap-3">
                  <span className="font-en text-2xl font-black text-[#1cb0f6]">{dg.combination}</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    = صوت ({dg.soundAr})
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#777777] dark:text-[#afafaf] leading-relaxed font-bold">
                {dg.explanationAr}
              </p>

              <div className="space-y-2 pt-1">
                {dg.examples.map((ex, i) => (
                  <div
                    key={i}
                    onClick={() => speakText(ex.word)}
                    className="p-3 rounded-2xl border-2 border-[#e5e5e5] dark:border-[#37464f] bg-[#f7f7f7] dark:bg-[#202f36] flex items-center justify-between gap-3 cursor-pointer hover:border-[#1cb0f6] transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <AudioButton textToSpeak={ex.word} size="sm" />
                      <span className="font-en font-black text-sm text-slate-900 dark:text-white">
                        {ex.word}
                      </span>
                      <span className="text-xs font-bold text-[#58cc02]">({ex.phoneticAr})</span>
                    </div>
                    <span className="text-xs text-[#afafaf] font-bold">{ex.meaningAr}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Letters Tab */}
      {subTab === 'letters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-black text-[#afafaf]">
              عرض {filteredLetters.length} حرفاً
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVowelOnly(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  !vowelOnly
                    ? 'bg-[#1cb0f6] text-white shadow-xs'
                    : 'bg-white dark:bg-[#202f36] border border-[#e5e5e5] dark:border-[#37464f] text-[#777777]'
                }`}
              >
                جميع الحروف (26)
              </button>
              <button
                type="button"
                onClick={() => setVowelOnly(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  vowelOnly
                    ? 'bg-[#1cb0f6] text-white shadow-xs'
                    : 'bg-white dark:bg-[#202f36] border border-[#e5e5e5] dark:border-[#37464f] text-[#777777]'
                }`}
              >
                الحروف المتحركة Vowels
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLetters.map((l) => (
              <div
                key={l.upper}
                className="p-5 rounded-3xl border-2 border-b-4 border-[#e5e5e5] dark:border-[#37464f] border-b-[#cecece] dark:border-b-[#263137] bg-white dark:bg-[#131f24] shadow-xs space-y-3.5 transition-all hover:border-[#1cb0f6]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="font-en text-3xl font-black text-[#1cb0f6]">
                        {l.upper} {l.lower}
                      </span>
                      {l.isVowel && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#fff4e5] dark:bg-[#392415] text-[#ff9600]">
                          Vowel
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-black text-[#afafaf]">اسم الحرف: {l.nameAr}</p>
                  </div>
                  <AudioButton textToSpeak={`${l.upper}. ${l.exampleWord}`} size="sm" />
                </div>

                <div className="p-3 rounded-2xl bg-[#f7f7f7] dark:bg-[#202f36] border border-[#e5e5e5] dark:border-[#37464f] flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-en text-base font-black text-slate-900 dark:text-white">
                      {l.exampleWord}
                    </span>
                    <span className="text-xs text-[#58cc02] font-black">
                      ({l.examplePhoneticAr})
                    </span>
                  </div>
                  <span className="text-xs text-[#777777] dark:text-[#afafaf] font-bold">
                    {l.exampleMeaningAr}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-[#777777] dark:text-[#afafaf] font-bold">
                    صوت الحرف: <span className="font-black text-slate-900 dark:text-white">{l.soundAr}</span>
                  </p>
                  {l.arabicNote && (
                    <p className="text-[#1cb0f6] text-[11px] font-black leading-relaxed">
                      💡 {l.arabicNote}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Survival Phrases Tab */}
      {subTab === 'survival' && (
        <div className="space-y-6">
          {survivalPhrases.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#131f24] border-2 border-b-4 border-[#e5e5e5] dark:border-[#37464f] border-b-[#cecece] dark:border-b-[#263137] shadow-xs space-y-4"
            >
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#1cb0f6]" />
                <span>{cat.titleAr}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.phrases.map((phrase, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#f7f7f7] dark:bg-[#202f36] border border-[#e5e5e5] dark:border-[#37464f] flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="font-en font-black text-sm text-slate-900 dark:text-white">
                        {phrase.en}
                      </p>
                      <p className="text-xs text-[#777777] dark:text-[#afafaf] font-bold">
                        {phrase.ar}
                      </p>
                      <p className="text-[11px] font-black text-[#58cc02]">{phrase.phoneticAr}</p>
                    </div>
                    <AudioButton textToSpeak={phrase.en} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Quiz Tab */}
      {subTab === 'quiz' && (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#131f24] border-2 border-b-6 border-[#e5e5e5] dark:border-[#37464f] border-b-[#cecece] dark:border-b-[#263137] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#f0f0f0] dark:border-[#263137] pb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#1cb0f6]" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                اختبار الصوتيات والمخارج ({isA2OrAbove ? 'المستوى A2' : 'المستوى A0'})
              </h3>
            </div>
            <span className="font-en text-xs font-black px-2.5 py-0.5 rounded-lg bg-[#e5f6ff] text-[#1cb0f6]">
              {activeQuizList.length} أسئلة
            </span>
          </div>

          <div className="space-y-6">
            {activeQuizList.map((q, idx) => {
              const selected = quizAnswers[q.id];
              const isAnswered = selected !== undefined;

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-3xl bg-[#f7f7f7] dark:bg-[#202f36] border-2 border-[#e5e5e5] dark:border-[#37464f] space-y-3"
                >
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    {idx + 1}. {q.questionAr}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selected === optIdx;
                      const isCorrect = optIdx === q.correctIndex;

                      let btnStyle =
                        'bg-white dark:bg-[#131f24] border-[#e5e5e5] dark:border-[#37464f] text-slate-800 dark:text-slate-200';
                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle =
                            'bg-[#eefbe7] dark:bg-[#1a3818] border-[#58cc02] text-[#2d6600] dark:text-[#a5ff6b] font-black';
                        } else if (isSelected) {
                          btnStyle =
                            'bg-[#ffe6e6] dark:bg-[#381616] border-[#ff4b4b] text-[#8f1919] dark:text-[#ffa8a8]';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleQuizAnswer(q.id, optIdx, q.correctIndex)}
                          className={`p-3.5 rounded-2xl border-2 text-start text-xs sm:text-sm font-bold flex items-center justify-between gap-2 transition cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && isCorrect && (
                            <Check className="w-4 h-4 text-[#58cc02] stroke-[3] shrink-0" />
                          )}
                          {isAnswered && isSelected && !isCorrect && (
                            <X className="w-4 h-4 text-[#ff4b4b] stroke-[3] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <p className="text-xs text-[#777777] dark:text-[#afafaf] pt-2 border-t border-[#e5e5e5] dark:border-[#37464f] leading-relaxed font-bold">
                      💡 {q.explanationAr}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
