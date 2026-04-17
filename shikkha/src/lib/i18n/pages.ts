/**
 * Per-page copy bundles in 4 languages (bn/en/ur/ar).
 *
 * Marketing pages (features, about, support, refund-policy, pricing/[slug])
 * have long content blocks that don't belong in marketing.ts. They live here
 * and are picked by locale.
 */

import type { Locale } from "./config";

// ─── /features ────────────────────────────────────────────────────────────

export type FeaturesPageCopy = {
  heroBadge: string;
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  groups: Array<{
    title: string;
    items: Array<{ iconName: string; title: string; desc: string }>;
  }>;
};

const featuresPage: Record<Locale, FeaturesPageCopy> = {
  bn: {
    heroBadge: "ফিচার",
    heroTitle: "যা যা লাগবে",
    heroAccent: "সব এক জায়গায়",
    heroSubtitle: "শিক্ষার্থী ব্যবস্থাপনা থেকে অনলাইন পেমেন্ট, AI বিশ্লেষণ থেকে মাদ্রাসা মডিউল — কোন তৃতীয়-পক্ষ সফটওয়্যার লাগবে না।",
    ctaTitle: "আজই শুরু করুন",
    ctaSubtitle: "১৫ দিন ফ্রি ট্রায়াল · কোন ক্রেডিট কার্ড লাগবে না · সম্পূর্ণ access",
    ctaPrimary: "ফ্রি ট্রায়াল শুরু করুন",
    ctaSecondary: "প্রাইসিং",
    groups: [
      { title: "📚 একাডেমিক", items: [
        { iconName: "Users", title: "শিক্ষার্থী ব্যবস্থাপনা", desc: "Excel import, guardian linking, transfer, promotion, profile photo।" },
        { iconName: "Calendar", title: "QR উপস্থিতি", desc: "২ মিনিটে ক্লাসের হাজিরা। অভিভাবক instant SMS পান।" },
        { iconName: "ScrollText", title: "পরীক্ষা ও রেজাল্ট", desc: "GPA 5.0, position ranking, keyboard-friendly marks entry grid।" },
        { iconName: "FileText", title: "সার্টিফিকেট", desc: "টেমপ্লেট-based certificate তৈরি, Bangla Unicode print-ready।" },
        { iconName: "ClipboardCheck", title: "অ্যাসাইনমেন্ট", desc: "শিক্ষক তৈরি করেন, ছাত্র জমা দেয়, শিক্ষক গ্রেড দেন।" },
        { iconName: "Video", title: "অনলাইন ক্লাস", desc: "Zoom, Google Meet, Teams — সরাসরি পোর্টাল থেকে যোগ।" },
      ]},
      { title: "💰 ফিন্যান্স", items: [
        { iconName: "Wallet", title: "অনলাইন পেমেন্ট", desc: "bKash, Nagad, Rocket, SSLCommerz — directly ফি collection।" },
        { iconName: "TrendingUp", title: "খরচ ও আয় ট্র্যাকিং", desc: "২৪টি pre-configured expense heads + donation campaigns।" },
        { iconName: "Award", title: "বৃত্তি ব্যবস্থাপনা", desc: "Need-based + merit-based scholarship assignment।" },
        { iconName: "BarChart3", title: "১০+ রিপোর্ট", desc: "ফি কালেকশন, বকেয়া aging, আয়-ব্যয়, বেতন — PDF/Excel।" },
      ]},
      { title: "📱 যোগাযোগ", items: [
        { iconName: "Megaphone", title: "SMS + WhatsApp + Push", desc: "একটি নোটিশ ৪ চ্যানেলে — SSL Wireless + Meta Cloud + FCM।" },
        { iconName: "MessageCircle", title: "সাপোর্ট টিকেট", desc: "অভিভাবক প্রশ্ন করেন, admin reply করেন — threaded inbox।" },
        { iconName: "Sparkles", title: "AI SMS টেমপ্লেট", desc: "ফি রিমাইন্ডার, অনুপস্থিতি — AI দিয়ে তৈরি বাংলা কপি।" },
      ]},
      { title: "🕌 মাদ্রাসা", items: [
        { iconName: "BookOpen", title: "হিফজ heatmap", desc: "৩০ পারা × শিক্ষার্থী — সম্পূর্ণ hifz progress এক নজরে।" },
        { iconName: "BookOpen", title: "কিতাব curriculum", desc: "৬ স্তর — প্রাথমিক থেকে তাকমিল পর্যন্ত।" },
        { iconName: "Calendar", title: "দৈনিক সবক-সবকী-মানজিল", desc: "প্রতিদিনের সবক track — ১০ কলামের গ্রিড।" },
        { iconName: "Globe", title: "Hijri তারিখ + Arabic RTL", desc: "Islamic calendar integration + পুরো সিস্টেম Arabic RTL সাপোর্ট।" },
      ]},
      { title: "🏢 অপারেশনাল", items: [
        { iconName: "BookOpen", title: "লাইব্রেরি", desc: "বই ক্যাটালগ, issue/return, overdue tracking।" },
        { iconName: "Users", title: "পরিবহন", desc: "রুট, গাড়ি, ছাত্র assignment, GPS-ready।" },
        { iconName: "Users", title: "হোস্টেল", desc: "ভবন, রুম, বেড allocation, warden ব্যবস্থাপনা।" },
        { iconName: "ClipboardCheck", title: "ইনভেন্টরি", desc: "স্টেশনারি ও সম্পদ stock movement, reorder alert।" },
      ]},
      { title: "🔒 নিরাপত্তা ও স্কেল", items: [
        { iconName: "Shield", title: "২-স্তর প্রমাণীকরণ (2FA)", desc: "TOTP-based 2FA — Google Authenticator + recovery codes।" },
        { iconName: "Shield", title: "Row-Level Security", desc: "প্রত্যেক স্কুলের ডেটা RLS-দ্বারা আলাদা, cross-tenant leak অসম্ভব।" },
        { iconName: "Smartphone", title: "অফলাইন PWA", desc: "নেট না থাকলেও হাজিরা ও মার্কস — auto-sync on reconnect।" },
        { iconName: "TrendingUp", title: "Realtime Live Dashboard", desc: "Supabase Realtime — পেমেন্ট/ভর্তি হলেই dashboard auto-update।" },
        { iconName: "Sparkles", title: "AI ড্রপআউট ঝুঁকি", desc: "উপস্থিতি + মার্কস + ফি → ঝুঁকি স্কোর + AI suggestion।" },
        { iconName: "Globe", title: "৪ ভাষা সাপোর্ট", desc: "বাংলা, English, উর্দু, আরবি — RTL + hijri + Bangla digits।" },
      ]},
    ],
  },
  en: {
    heroBadge: "Features",
    heroTitle: "Everything you need,",
    heroAccent: "in one place",
    heroSubtitle: "From student management to online payments, AI insights to madrasa modules — no third-party software needed.",
    ctaTitle: "Start today",
    ctaSubtitle: "15-day free trial · No credit card required · Full access",
    ctaPrimary: "Start Free Trial",
    ctaSecondary: "Pricing",
    groups: [
      { title: "📚 Academic", items: [
        { iconName: "Users", title: "Student Management", desc: "Excel import, guardian linking, transfer, promotion, profile photo." },
        { iconName: "Calendar", title: "QR Attendance", desc: "Full class in 2 minutes. Parents get instant SMS." },
        { iconName: "ScrollText", title: "Exams & Results", desc: "GPA 5.0, position ranking, keyboard-friendly marks entry grid." },
        { iconName: "FileText", title: "Certificates", desc: "Template-based certificate creation, Bangla Unicode print-ready." },
        { iconName: "ClipboardCheck", title: "Assignments", desc: "Teachers create, students submit, teachers grade." },
        { iconName: "Video", title: "Online Classes", desc: "Zoom, Google Meet, Teams — join directly from the portal." },
      ]},
      { title: "💰 Finance", items: [
        { iconName: "Wallet", title: "Online Payments", desc: "bKash, Nagad, Rocket, SSLCommerz — direct fee collection." },
        { iconName: "TrendingUp", title: "Income & Expense Tracking", desc: "24 pre-configured expense heads + donation campaigns." },
        { iconName: "Award", title: "Scholarship Management", desc: "Need-based + merit-based scholarship assignment." },
        { iconName: "BarChart3", title: "10+ Reports", desc: "Fee collection, dues aging, P&L, payroll — PDF/Excel." },
      ]},
      { title: "📱 Communication", items: [
        { iconName: "Megaphone", title: "SMS + WhatsApp + Push", desc: "One notice, 4 channels — SSL Wireless + Meta Cloud + FCM." },
        { iconName: "MessageCircle", title: "Support Tickets", desc: "Parents ask, admins reply — threaded inbox." },
        { iconName: "Sparkles", title: "AI SMS Templates", desc: "Fee reminders, absences — AI-generated Bangla copy." },
      ]},
      { title: "🕌 Madrasa", items: [
        { iconName: "BookOpen", title: "Hifz heatmap", desc: "30-para × student grid — entire hifz progress at a glance." },
        { iconName: "BookOpen", title: "Kitab curriculum", desc: "6 stages — primary to Takmeel." },
        { iconName: "Calendar", title: "Daily Sabaq-Sabqi-Manzil", desc: "Track every day — 10-column grid." },
        { iconName: "Globe", title: "Hijri dates + Arabic RTL", desc: "Islamic calendar + full system Arabic RTL support." },
      ]},
      { title: "🏢 Operational", items: [
        { iconName: "BookOpen", title: "Library", desc: "Book catalog, issue/return, overdue tracking." },
        { iconName: "Users", title: "Transport", desc: "Routes, vehicles, student assignment, GPS-ready." },
        { iconName: "Users", title: "Hostel", desc: "Buildings, rooms, bed allocation, warden management." },
        { iconName: "ClipboardCheck", title: "Inventory", desc: "Stationery & asset stock movement, reorder alerts." },
      ]},
      { title: "🔒 Security & Scale", items: [
        { iconName: "Shield", title: "Two-Factor Auth (2FA)", desc: "TOTP-based 2FA — Google Authenticator + recovery codes." },
        { iconName: "Shield", title: "Row-Level Security", desc: "Each school's data isolated by RLS, cross-tenant leak impossible." },
        { iconName: "Smartphone", title: "Offline PWA", desc: "Attendance & marks without internet — auto-sync on reconnect." },
        { iconName: "TrendingUp", title: "Realtime Live Dashboard", desc: "Supabase Realtime — payment/admission triggers auto-update." },
        { iconName: "Sparkles", title: "AI Dropout Risk", desc: "Attendance + marks + fees → risk score + AI suggestion." },
        { iconName: "Globe", title: "4-language support", desc: "Bangla, English, Urdu, Arabic — RTL + Hijri + Bangla digits." },
      ]},
    ],
  },
  ur: {
    heroBadge: "خصوصیات",
    heroTitle: "جو کچھ آپ کو چاہیے،",
    heroAccent: "ایک جگہ",
    heroSubtitle: "طالب علم کے انتظام سے آن لائن ادائیگی تک، AI تجزیہ سے مدرسہ ماڈیول تک — کسی تیسرے فریق کے سافٹ ویئر کی ضرورت نہیں۔",
    ctaTitle: "آج ہی شروع کریں",
    ctaSubtitle: "۱۵ دن مفت آزمائش · کوئی کریڈٹ کارڈ نہیں · مکمل رسائی",
    ctaPrimary: "مفت آزمائش شروع کریں",
    ctaSecondary: "قیمتیں",
    groups: [
      { title: "📚 تعلیمی", items: [
        { iconName: "Users", title: "طالب علم کا انتظام", desc: "Excel درآمد، سرپرست لنکنگ، ٹرانسفر، پروموشن، پروفائل فوٹو۔" },
        { iconName: "Calendar", title: "QR حاضری", desc: "۲ منٹ میں پوری کلاس۔ والدین کو فوری SMS۔" },
        { iconName: "ScrollText", title: "امتحانات اور نتائج", desc: "GPA 5.0، پوزیشن رینکنگ، کی بورڈ دوستانہ مارک انٹری گرڈ۔" },
        { iconName: "FileText", title: "اسناد", desc: "ٹیمپلیٹ پر مبنی سند، اردو پرنٹ ریڈی۔" },
        { iconName: "ClipboardCheck", title: "اسائنمنٹس", desc: "اساتذہ بناتے ہیں، طلباء جمع کرتے ہیں، اساتذہ گریڈ کرتے ہیں۔" },
        { iconName: "Video", title: "آن لائن کلاسز", desc: "Zoom، Google Meet، Teams — براہ راست پورٹل سے شمولیت۔" },
      ]},
      { title: "💰 مالیاتی", items: [
        { iconName: "Wallet", title: "آن لائن ادائیگی", desc: "bKash، Nagad، Rocket، SSLCommerz — براہ راست فیس وصولی۔" },
        { iconName: "TrendingUp", title: "آمدنی اور اخراجات کی نگرانی", desc: "۲۴ پہلے سے ترتیب شدہ اخراجات اقسام + عطیہ مہمات۔" },
        { iconName: "Award", title: "اسکالرشپ انتظام", desc: "ضرورت پر مبنی + میرٹ پر مبنی اسکالرشپ۔" },
        { iconName: "BarChart3", title: "۱۰+ رپورٹس", desc: "فیس وصولی، واجبات، منافع و نقصان، تنخواہ — PDF/Excel۔" },
      ]},
      { title: "📱 رابطہ", items: [
        { iconName: "Megaphone", title: "SMS + WhatsApp + Push", desc: "ایک نوٹس، ۴ چینلز — SSL Wireless + Meta Cloud + FCM۔" },
        { iconName: "MessageCircle", title: "سپورٹ ٹکٹ", desc: "والدین پوچھتے ہیں، منتظمین جواب دیتے ہیں — تھریڈڈ ان باکس۔" },
        { iconName: "Sparkles", title: "AI SMS ٹیمپلیٹس", desc: "فیس یاد دہانی، غیر حاضری — AI سے تیار کردہ۔" },
      ]},
      { title: "🕌 مدرسہ", items: [
        { iconName: "BookOpen", title: "حفظ ہیٹ میپ", desc: "۳۰ پارہ × طالب علم — مکمل حفظ پیش رفت۔" },
        { iconName: "BookOpen", title: "کتاب نصاب", desc: "۶ مراحل — ابتدائی سے تکمیل تک۔" },
        { iconName: "Calendar", title: "روزانہ سبق-سبقی-منزل", desc: "ہر دن ٹریک — ۱۰ کالم کا گرڈ۔" },
        { iconName: "Globe", title: "ہجری تاریخیں + عربی RTL", desc: "اسلامی کیلنڈر + مکمل سسٹم RTL۔" },
      ]},
      { title: "🏢 آپریشنل", items: [
        { iconName: "BookOpen", title: "لائبریری", desc: "کتابوں کا فہرست، ایشو/واپسی، اوور ڈیو ٹریکنگ۔" },
        { iconName: "Users", title: "ٹرانسپورٹ", desc: "روٹس، گاڑیاں، طلباء اسائنمنٹ، GPS-ریڈی۔" },
        { iconName: "Users", title: "ہاسٹل", desc: "عمارات، کمرے، بستر مختص، وارڈن انتظام۔" },
        { iconName: "ClipboardCheck", title: "انوینٹری", desc: "اسٹیشنری اور اثاثہ جات اسٹاک، دوبارہ آرڈر الرٹس۔" },
      ]},
      { title: "🔒 سیکیورٹی اور پیمانہ", items: [
        { iconName: "Shield", title: "دو عوامل تصدیق (2FA)", desc: "TOTP پر مبنی 2FA — Google Authenticator + ریکوری کوڈز۔" },
        { iconName: "Shield", title: "Row-Level Security", desc: "ہر اسکول کا ڈیٹا RLS سے الگ، کراس ٹیننٹ لیک ناممکن۔" },
        { iconName: "Smartphone", title: "آف لائن PWA", desc: "نیٹ کے بغیر حاضری اور مارکس — دوبارہ کنکشن پر آٹو سنک۔" },
        { iconName: "TrendingUp", title: "ریئل ٹائم لائیو ڈیش بورڈ", desc: "Supabase Realtime — ادائیگی/داخلہ ٹرگرز۔" },
        { iconName: "Sparkles", title: "AI ڈراپ آؤٹ رسک", desc: "حاضری + مارکس + فیس → رسک اسکور + AI تجویز۔" },
        { iconName: "Globe", title: "۴ زبانوں کی حمایت", desc: "بنگالی، انگریزی، اردو، عربی — RTL + ہجری + اردو ہندسے۔" },
      ]},
    ],
  },
  ar: {
    heroBadge: "المميزات",
    heroTitle: "كل ما تحتاجه،",
    heroAccent: "في مكان واحد",
    heroSubtitle: "من إدارة الطلاب إلى المدفوعات عبر الإنترنت، من تحليلات الذكاء الاصطناعي إلى وحدة المدرسة الدينية — لا حاجة إلى برامج طرف ثالث.",
    ctaTitle: "ابدأ اليوم",
    ctaSubtitle: "تجربة مجانية لمدة 15 يوم · بدون بطاقة ائتمان · وصول كامل",
    ctaPrimary: "ابدأ التجربة المجانية",
    ctaSecondary: "الأسعار",
    groups: [
      { title: "📚 الأكاديمي", items: [
        { iconName: "Users", title: "إدارة الطلاب", desc: "استيراد Excel، ربط ولي الأمر، النقل، الترقية، الصورة الشخصية." },
        { iconName: "Calendar", title: "الحضور بـ QR", desc: "الفصل كاملًا في دقيقتين. يتلقى الوالدان SMS فوريًا." },
        { iconName: "ScrollText", title: "الامتحانات والنتائج", desc: "GPA 5.0، ترتيب، شبكة إدخال درجات صديقة للوحة المفاتيح." },
        { iconName: "FileText", title: "الشهادات", desc: "إنشاء شهادات بناءً على قوالب، جاهزة للطباعة." },
        { iconName: "ClipboardCheck", title: "الواجبات", desc: "المعلمون ينشئون، الطلاب يسلمون، المعلمون يصححون." },
        { iconName: "Video", title: "الحصص عبر الإنترنت", desc: "Zoom, Google Meet, Teams — الانضمام مباشرة من البوابة." },
      ]},
      { title: "💰 المالية", items: [
        { iconName: "Wallet", title: "الدفع عبر الإنترنت", desc: "bKash، Nagad، Rocket، SSLCommerz — تحصيل رسوم مباشر." },
        { iconName: "TrendingUp", title: "تتبع الدخل والنفقات", desc: "24 بنودًا مُعدة مسبقًا + حملات تبرع." },
        { iconName: "Award", title: "إدارة المنح الدراسية", desc: "منح قائمة على الحاجة + الاستحقاق." },
        { iconName: "BarChart3", title: "10+ تقارير", desc: "تحصيل الرسوم، المستحقات، الأرباح والخسائر، الرواتب — PDF/Excel." },
      ]},
      { title: "📱 التواصل", items: [
        { iconName: "Megaphone", title: "SMS + WhatsApp + Push", desc: "إعلان واحد، 4 قنوات — SSL Wireless + Meta Cloud + FCM." },
        { iconName: "MessageCircle", title: "تذاكر الدعم", desc: "الوالدان يسألون، المسؤولون يردون — صندوق وارد مترابط." },
        { iconName: "Sparkles", title: "قوالب SMS بالذكاء الاصطناعي", desc: "تذكيرات الرسوم، الغياب — نسخ من إنشاء الذكاء الاصطناعي." },
      ]},
      { title: "🕌 المدرسة الدينية", items: [
        { iconName: "BookOpen", title: "خريطة حرارية للحفظ", desc: "30 جزءًا × طالب — تقدم الحفظ الكامل." },
        { iconName: "BookOpen", title: "منهج الكتاب", desc: "6 مراحل — الابتدائي إلى التكميل." },
        { iconName: "Calendar", title: "السبق والسبقي والمنزل اليومي", desc: "تتبع كل يوم — شبكة 10 أعمدة." },
        { iconName: "Globe", title: "التواريخ الهجرية + RTL", desc: "التقويم الإسلامي + دعم RTL كامل." },
      ]},
      { title: "🏢 التشغيلي", items: [
        { iconName: "BookOpen", title: "المكتبة", desc: "كتالوج الكتب، الإصدار/الإرجاع، تتبع المتأخرات." },
        { iconName: "Users", title: "النقل", desc: "مسارات، مركبات، تعيين الطلاب، جاهز لـ GPS." },
        { iconName: "Users", title: "السكن", desc: "المباني، الغرف، تخصيص الأسرة، إدارة المشرفين." },
        { iconName: "ClipboardCheck", title: "المخزون", desc: "حركة مخزون القرطاسية والأصول، تنبيهات إعادة الطلب." },
      ]},
      { title: "🔒 الأمان والحجم", items: [
        { iconName: "Shield", title: "المصادقة الثنائية (2FA)", desc: "2FA قائم على TOTP — Google Authenticator + رموز الاسترداد." },
        { iconName: "Shield", title: "Row-Level Security", desc: "بيانات كل مدرسة معزولة بواسطة RLS." },
        { iconName: "Smartphone", title: "PWA غير متصل", desc: "الحضور والدرجات بدون إنترنت — مزامنة تلقائية." },
        { iconName: "TrendingUp", title: "لوحة حية في الوقت الفعلي", desc: "Supabase Realtime — تحديث تلقائي." },
        { iconName: "Sparkles", title: "مخاطر التسرب بالذكاء الاصطناعي", desc: "الحضور + الدرجات + الرسوم → درجة المخاطر + اقتراح الذكاء الاصطناعي." },
        { iconName: "Globe", title: "دعم 4 لغات", desc: "البنغالية، الإنجليزية، الأردية، العربية — RTL + هجري + أرقام بنغالية." },
      ]},
    ],
  },
};

// ─── /about ──────────────────────────────────────────────────────────────

export type AboutPageCopy = {
  heroBadge: string;
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  missionTitle: string;
  missionBody: string;
  valuesTitle: string;
  values: Array<{ title: string; desc: string }>;
  whyTitle: string;
  problemLabel: string;
  problemBody: string;
  solutionLabel: string;
  solutionBody: string;
  stats: Array<{ value: string; label: string }>;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

const aboutPage: Record<Locale, AboutPageCopy> = {
  bn: {
    heroBadge: "আমাদের গল্প",
    heroTitle: "বাংলাদেশের জন্য তৈরি,",
    heroAccent: "বাংলাদেশের মানুষদের দ্বারা",
    heroSubtitle: "Muhius Sunnah-এর যাত্রা শুরু একটি সহজ প্রশ্ন দিয়ে — কেন আমাদের প্রতিষ্ঠানগুলোর জন্য বিদেশি software-ই একমাত্র বিকল্প?",
    missionTitle: "আমাদের মিশন",
    missionBody: "বাংলাদেশের প্রত্যেক মাদ্রাসা ও স্কুলে আধুনিক প্রযুক্তি পৌঁছে দেয়া — সাশ্রয়ী মূল্যে, বাংলা ভাষায়, স্থানীয় context-এ।",
    valuesTitle: "আমাদের মূল্যবোধ",
    values: [
      { title: "সাশ্রয়ী মূল্য", desc: "ছোট প্রতিষ্ঠানও যেন ব্যবহার করতে পারে — তাই Lifetime ৫,০০০ টাকার প্ল্যান।" },
      { title: "স্থানীয় সহযোগিতা", desc: "আমাদের team পুরোপুরি বাংলাদেশে। বাংলা সাপোর্ট, বাংলাদেশি context।" },
      { title: "গতি ও উদ্ভাবন", desc: "নতুন feature দ্রুত — আপনার প্রয়োজন ২ সপ্তাহে বাস্তবায়ন।" },
    ],
    whyTitle: "কেন Muhius Sunnah?",
    problemLabel: "❌ সমস্যা",
    problemBody: "বাংলাদেশের বেশিরভাগ মাদ্রাসা ও স্কুল এখনো কাগজে-কলমে চলে। পুরাতন সফটওয়্যারগুলোতে অনলাইন পেমেন্ট নেই, মাদ্রাসা-specific feature নেই, সাপোর্ট ধীর।",
    solutionLabel: "✅ আমাদের সমাধান",
    solutionBody: "আধুনিক tech stack (Next.js 16, Supabase, AI) — কিন্তু UI বাংলায়, workflow বাংলাদেশি, pricing সাশ্রয়ী। হিফজ/কিতাব/সবক module, bKash/Nagad, অফলাইন mode।",
    stats: [
      { value: "২০২৬", label: "প্রতিষ্ঠিত" },
      { value: "১২০+", label: "প্রতিষ্ঠান" },
      { value: "৫০,০০০+", label: "শিক্ষার্থী" },
      { value: "৪", label: "ভাষা" },
    ],
    ctaTitle: "আমাদের journey-এ যোগ দিন",
    ctaSubtitle: "আপনার প্রতিষ্ঠানকে আধুনিকীকরণে আমরা সাথে আছি।",
    ctaPrimary: "ফ্রি ট্রায়াল শুরু করুন",
    ctaSecondary: "আমাদের সাথে যোগাযোগ",
  },
  en: {
    heroBadge: "Our Story",
    heroTitle: "Built for Bangladesh,",
    heroAccent: "by the people of Bangladesh",
    heroSubtitle: "Muhius Sunnah's journey started with a simple question — why must foreign software be our only option?",
    missionTitle: "Our Mission",
    missionBody: "Bring modern technology to every madrasa and school in Bangladesh — affordably, in Bangla, in local context.",
    valuesTitle: "Our Values",
    values: [
      { title: "Affordable", desc: "Small institutions can use it too — hence the ৳5,000 Lifetime plan." },
      { title: "Local First", desc: "Our team is entirely in Bangladesh. Bangla support, Bangladeshi context." },
      { title: "Speed & Innovation", desc: "New features fast — your need built in 2 weeks." },
    ],
    whyTitle: "Why Muhius Sunnah?",
    problemLabel: "❌ Problem",
    problemBody: "Most madrasas and schools in Bangladesh still run on paper. Old software lacks online payments, has no madrasa-specific features, and offers slow support.",
    solutionLabel: "✅ Our Solution",
    solutionBody: "Modern tech stack (Next.js 16, Supabase, AI) — but UI in Bangla, workflow Bangladeshi, pricing affordable. Hifz/Kitab/Sabaq modules, bKash/Nagad, offline mode.",
    stats: [
      { value: "2026", label: "Founded" },
      { value: "120+", label: "Institutions" },
      { value: "50,000+", label: "Students" },
      { value: "4", label: "Languages" },
    ],
    ctaTitle: "Join our journey",
    ctaSubtitle: "We're here to modernize your institution.",
    ctaPrimary: "Start Free Trial",
    ctaSecondary: "Contact Us",
  },
  ur: {
    heroBadge: "ہماری کہانی",
    heroTitle: "بنگلہ دیش کے لیے بنایا،",
    heroAccent: "بنگلہ دیش کے لوگوں نے",
    heroSubtitle: "Muhius Sunnah کا سفر ایک سادہ سوال سے شروع ہوا — ہمارے اداروں کے لیے غیر ملکی سافٹ ویئر ہی واحد انتخاب کیوں؟",
    missionTitle: "ہمارا مشن",
    missionBody: "بنگلہ دیش کے ہر مدرسے اور اسکول میں جدید ٹیکنالوجی لے کر آنا — سستی، اردو میں، مقامی تناظر میں۔",
    valuesTitle: "ہماری اقدار",
    values: [
      { title: "سستا", desc: "چھوٹے ادارے بھی استعمال کر سکیں — اس لیے ۵،۰۰۰ روپے کا Lifetime پلان۔" },
      { title: "مقامی پہلے", desc: "ہماری ٹیم مکمل طور پر بنگلہ دیش میں ہے۔" },
      { title: "رفتار اور جدت", desc: "نئی خصوصیات تیزی سے — ۲ ہفتوں میں۔" },
    ],
    whyTitle: "Muhius Sunnah کیوں؟",
    problemLabel: "❌ مسئلہ",
    problemBody: "زیادہ تر مدارس اور اسکول اب بھی کاغذ پر چلتے ہیں۔ پرانے سافٹ ویئر میں آن لائن ادائیگی نہیں، مدرسہ کے خصوصی خصوصیات نہیں، سست سپورٹ۔",
    solutionLabel: "✅ ہمارا حل",
    solutionBody: "جدید ٹیک اسٹیک، لیکن UI اردو میں، سستی قیمت۔ حفظ/کتاب/سبق ماڈیول، bKash/Nagad، آف لائن موڈ۔",
    stats: [
      { value: "۲۰۲۶", label: "قائم" },
      { value: "۱۲۰+", label: "ادارے" },
      { value: "۵۰،۰۰۰+", label: "طلباء" },
      { value: "۴", label: "زبانیں" },
    ],
    ctaTitle: "ہمارے سفر میں شامل ہوں",
    ctaSubtitle: "ہم آپ کے ادارے کو جدید بنانے کے لیے ہیں۔",
    ctaPrimary: "مفت آزمائش شروع کریں",
    ctaSecondary: "ہم سے رابطہ کریں",
  },
  ar: {
    heroBadge: "قصتنا",
    heroTitle: "صُنع لبنغلاديش،",
    heroAccent: "من قبل شعب بنغلاديش",
    heroSubtitle: "بدأت رحلة Muhius Sunnah بسؤال بسيط — لماذا يجب أن تكون البرامج الأجنبية خيارنا الوحيد؟",
    missionTitle: "مهمتنا",
    missionBody: "جلب التكنولوجيا الحديثة إلى كل مدرسة دينية ومدرسة في بنغلاديش — بأسعار معقولة، بلغة البنغالية، في السياق المحلي.",
    valuesTitle: "قيمنا",
    values: [
      { title: "سعر معقول", desc: "المؤسسات الصغيرة يمكنها استخدامه أيضًا — لذا خطة Lifetime بـ 5,000 تاكا." },
      { title: "المحلي أولاً", desc: "فريقنا بالكامل في بنغلاديش. دعم بالبنغالية، سياق بنغالي." },
      { title: "السرعة والابتكار", desc: "ميزات جديدة بسرعة — احتياجك مبني في أسبوعين." },
    ],
    whyTitle: "لماذا Muhius Sunnah؟",
    problemLabel: "❌ المشكلة",
    problemBody: "معظم المدارس الدينية والمدارس في بنغلاديش لا تزال تعمل على الورق. البرامج القديمة تفتقر إلى الدفع عبر الإنترنت.",
    solutionLabel: "✅ حلنا",
    solutionBody: "تقنية حديثة مع واجهة بالبنغالية، سير عمل بنغالي، أسعار معقولة. وحدات الحفظ/الكتاب/السبق، bKash/Nagad، الوضع غير المتصل.",
    stats: [
      { value: "2026", label: "تأسست" },
      { value: "120+", label: "مؤسسات" },
      { value: "50,000+", label: "طلاب" },
      { value: "4", label: "لغات" },
    ],
    ctaTitle: "انضم إلى رحلتنا",
    ctaSubtitle: "نحن هنا لتحديث مؤسستك.",
    ctaPrimary: "ابدأ التجربة المجانية",
    ctaSecondary: "اتصل بنا",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────

export function getFeaturesPageCopy(locale: Locale): FeaturesPageCopy {
  return featuresPage[locale] ?? featuresPage.bn;
}

export function getAboutPageCopy(locale: Locale): AboutPageCopy {
  return aboutPage[locale] ?? aboutPage.bn;
}

// ─── /support ────────────────────────────────────────────────────────────

export type SupportPageCopy = {
  heroBadge: string;
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  channels: Array<{ icon: "Video" | "Phone" | "MessageCircle" | "BookOpen"; accent: string; title: string; desc: string; cta: string; href: string; badge: string }>;
  demoBadge: string;
  demoTitle: string;
  demoAccent: string;
  demoBody: string;
  demoBookCta: string;
  demoContactCta: string;
  contactMoreTitle: string;
  contactCards: Array<{ icon: "Mail" | "Phone" | "Clock"; label: string; value: string; href: string }>;
  slaTitle: string;
  slaSubtitle: string;
  slaHeaders: string[];
  slaRows: Array<{ plan: string; email: string; whatsapp: string; phone: string; demo: string }>;
};

const supportPage: Record<Locale, SupportPageCopy> = {
  bn: {
    heroBadge: "সাপোর্ট সেন্টার",
    heroTitle: "আমরা আপনার সাথে",
    heroAccent: "সবসময় আছি",
    heroSubtitle: "Video টিউটোরিয়াল, live call, WhatsApp — যে চ্যানেলে সুবিধা, সেখানেই সাপোর্ট পান। বাংলায়, ২৪/৭।",
    channels: [
      { icon: "Video", accent: "from-[#FF0000] to-[#cc0000]", title: "Video Tutorial Library", desc: "১০০+ বাংলা video tutorial — setup থেকে advanced features পর্যন্ত সব।", cta: "Tutorials দেখুন", href: "#", badge: "১০০+ videos" },
      { icon: "Phone", accent: "from-primary to-accent", title: "Live ফোন কল", desc: "সরাসরি আমাদের সাপোর্ট engineer-এর সাথে কথা বলুন। Scale plan-এ ২৪/৭।", cta: "ফোন করুন", href: "tel:+8801767682381", badge: "২৪/৭ (Scale plan)" },
      { icon: "MessageCircle", accent: "from-[#25D366] to-[#128C7E]", title: "WhatsApp চ্যাট", desc: "আপনার প্রশ্ন WhatsApp-এ পাঠান, গড়ে ১৫ মিনিটে reply।", cta: "WhatsApp-এ Chat", href: "https://wa.me/8801767682381", badge: "১৫ মিনিট avg response" },
      { icon: "BookOpen", accent: "from-accent to-secondary", title: "Help Center & Docs", desc: "Self-service documentation — ২০০+ article, FAQ, troubleshooting guides।", cta: "ডকুমেন্টেশন দেখুন", href: "#", badge: "২০০+ articles" },
    ],
    demoBadge: "Featured",
    demoTitle: "একটি",
    demoAccent: "Live Demo",
    demoBody: "আমাদের expert-এর সাথে ৩০ মিনিটের personalized demo। আপনার প্রতিষ্ঠানের exact চাহিদা অনুযায়ী সফটওয়্যার walk-through। ফ্রি, কোন obligation নেই।",
    demoBookCta: "ফ্রি Demo Book",
    demoContactCta: "Contact Form",
    contactMoreTitle: "আরও যোগাযোগের উপায়",
    contactCards: [
      { icon: "Mail", label: "Email সাপোর্ট", value: "itsinjamul@gmail.com", href: "mailto:itsinjamul@gmail.com" },
      { icon: "Phone", label: "Hotline", value: "+880 1767-682381", href: "tel:+8801767682381" },
      { icon: "Clock", label: "সাপোর্ট সময়", value: "সকাল ৯টা - রাত ৯টা", href: "#" },
    ],
    slaTitle: "Response Time (SLA)",
    slaSubtitle: "আপনার plan অনুযায়ী সাপোর্ট response",
    slaHeaders: ["Plan", "Email", "WhatsApp", "Phone", "Live Demo"],
    slaRows: [
      { plan: "Lifetime Basic", email: "৪৮ ঘণ্টা", whatsapp: "—", phone: "—", demo: "একবার" },
      { plan: "Starter", email: "২৪ ঘণ্টা", whatsapp: "—", phone: "—", demo: "✓" },
      { plan: "Growth", email: "৮ ঘণ্টা", whatsapp: "১৫ মিনিট", phone: "Office hours", demo: "✓" },
      { plan: "Scale", email: "৪ ঘণ্টা", whatsapp: "ইনস্ট্যান্ট", phone: "২৪/৭", demo: "unlimited" },
    ],
  },
  en: {
    heroBadge: "Support Center",
    heroTitle: "We're with you",
    heroAccent: "every step of the way",
    heroSubtitle: "Video tutorials, live calls, WhatsApp — support on whatever channel suits you. In Bangla, 24/7.",
    channels: [
      { icon: "Video", accent: "from-[#FF0000] to-[#cc0000]", title: "Video Tutorial Library", desc: "100+ Bangla video tutorials — from setup to advanced features.", cta: "Watch Tutorials", href: "#", badge: "100+ videos" },
      { icon: "Phone", accent: "from-primary to-accent", title: "Live Phone Call", desc: "Talk directly to our support engineer. 24/7 on the Scale plan.", cta: "Call Us", href: "tel:+8801767682381", badge: "24/7 (Scale plan)" },
      { icon: "MessageCircle", accent: "from-[#25D366] to-[#128C7E]", title: "WhatsApp Chat", desc: "Send your question on WhatsApp, average reply in 15 minutes.", cta: "Chat on WhatsApp", href: "https://wa.me/8801767682381", badge: "15 min avg response" },
      { icon: "BookOpen", accent: "from-accent to-secondary", title: "Help Center & Docs", desc: "Self-service documentation — 200+ articles, FAQ, troubleshooting guides.", cta: "View Documentation", href: "#", badge: "200+ articles" },
    ],
    demoBadge: "Featured",
    demoTitle: "Book a",
    demoAccent: "Live Demo",
    demoBody: "30-minute personalized demo with our expert. Walkthrough tailored to your institution's exact needs. Free, no obligation.",
    demoBookCta: "Book Free Demo",
    demoContactCta: "Contact Form",
    contactMoreTitle: "Other ways to reach us",
    contactCards: [
      { icon: "Mail", label: "Email Support", value: "itsinjamul@gmail.com", href: "mailto:itsinjamul@gmail.com" },
      { icon: "Phone", label: "Hotline", value: "+880 1767-682381", href: "tel:+8801767682381" },
      { icon: "Clock", label: "Support Hours", value: "9 AM - 9 PM", href: "#" },
    ],
    slaTitle: "Response Time (SLA)",
    slaSubtitle: "Support response based on your plan",
    slaHeaders: ["Plan", "Email", "WhatsApp", "Phone", "Live Demo"],
    slaRows: [
      { plan: "Lifetime Basic", email: "48 hours", whatsapp: "—", phone: "—", demo: "Once" },
      { plan: "Starter", email: "24 hours", whatsapp: "—", phone: "—", demo: "✓" },
      { plan: "Growth", email: "8 hours", whatsapp: "15 min", phone: "Office hours", demo: "✓" },
      { plan: "Scale", email: "4 hours", whatsapp: "Instant", phone: "24/7", demo: "unlimited" },
    ],
  },
  ur: {
    heroBadge: "سپورٹ سینٹر",
    heroTitle: "ہم آپ کے ساتھ ہیں",
    heroAccent: "ہر قدم پر",
    heroSubtitle: "ویڈیو ٹیوٹوریل، لائیو کال، WhatsApp — جس چینل پر آسانی ہو۔ اردو میں، ۲۴/۷۔",
    channels: [
      { icon: "Video", accent: "from-[#FF0000] to-[#cc0000]", title: "ویڈیو ٹیوٹوریل لائبریری", desc: "۱۰۰+ ویڈیو — سیٹ اپ سے ایڈوانس خصوصیات تک۔", cta: "ٹیوٹوریل دیکھیں", href: "#", badge: "۱۰۰+ ویڈیوز" },
      { icon: "Phone", accent: "from-primary to-accent", title: "لائیو فون کال", desc: "ہمارے سپورٹ انجینئر سے براہ راست بات کریں۔", cta: "فون کریں", href: "tel:+8801767682381", badge: "۲۴/۷ (Scale)" },
      { icon: "MessageCircle", accent: "from-[#25D366] to-[#128C7E]", title: "WhatsApp چیٹ", desc: "WhatsApp پر سوال بھیجیں، اوسطاً ۱۵ منٹ میں جواب۔", cta: "WhatsApp پر چیٹ", href: "https://wa.me/8801767682381", badge: "۱۵ منٹ اوسط" },
      { icon: "BookOpen", accent: "from-accent to-secondary", title: "ہیلپ سینٹر اور ڈاکس", desc: "سیلف سروس دستاویزات — ۲۰۰+ مضامین۔", cta: "دستاویزات دیکھیں", href: "#", badge: "۲۰۰+ مضامین" },
    ],
    demoBadge: "Featured",
    demoTitle: "ایک",
    demoAccent: "Live Demo",
    demoBody: "ہمارے ماہر کے ساتھ ۳۰ منٹ کا ذاتی ڈیمو۔ مفت، کوئی ذمہ داری نہیں۔",
    demoBookCta: "مفت ڈیمو بک کریں",
    demoContactCta: "رابطہ فارم",
    contactMoreTitle: "رابطے کے مزید طریقے",
    contactCards: [
      { icon: "Mail", label: "ای میل سپورٹ", value: "itsinjamul@gmail.com", href: "mailto:itsinjamul@gmail.com" },
      { icon: "Phone", label: "ہاٹ لائن", value: "+880 1767-682381", href: "tel:+8801767682381" },
      { icon: "Clock", label: "سپورٹ اوقات", value: "صبح ۹ تا رات ۹", href: "#" },
    ],
    slaTitle: "Response Time (SLA)",
    slaSubtitle: "آپ کے پلان کے مطابق سپورٹ جواب",
    slaHeaders: ["Plan", "Email", "WhatsApp", "Phone", "Live Demo"],
    slaRows: [
      { plan: "Lifetime Basic", email: "۴۸ گھنٹے", whatsapp: "—", phone: "—", demo: "ایک بار" },
      { plan: "Starter", email: "۲۴ گھنٹے", whatsapp: "—", phone: "—", demo: "✓" },
      { plan: "Growth", email: "۸ گھنٹے", whatsapp: "۱۵ منٹ", phone: "دفتری اوقات", demo: "✓" },
      { plan: "Scale", email: "۴ گھنٹے", whatsapp: "فوری", phone: "۲۴/۷", demo: "لامحدود" },
    ],
  },
  ar: {
    heroBadge: "مركز الدعم",
    heroTitle: "نحن معك",
    heroAccent: "في كل خطوة",
    heroSubtitle: "دروس فيديو، مكالمات حية، WhatsApp — الدعم في أي قناة تناسبك. على مدار الساعة.",
    channels: [
      { icon: "Video", accent: "from-[#FF0000] to-[#cc0000]", title: "مكتبة الفيديو التعليمية", desc: "100+ فيديو تعليمي — من الإعداد إلى الميزات المتقدمة.", cta: "شاهد الدروس", href: "#", badge: "100+ فيديو" },
      { icon: "Phone", accent: "from-primary to-accent", title: "مكالمة هاتفية مباشرة", desc: "تحدث مباشرة إلى مهندس الدعم لدينا. 24/7 في خطة Scale.", cta: "اتصل بنا", href: "tel:+8801767682381", badge: "24/7 (Scale)" },
      { icon: "MessageCircle", accent: "from-[#25D366] to-[#128C7E]", title: "دردشة WhatsApp", desc: "أرسل سؤالك على WhatsApp، متوسط الرد 15 دقيقة.", cta: "الدردشة على WhatsApp", href: "https://wa.me/8801767682381", badge: "15 دقيقة متوسط" },
      { icon: "BookOpen", accent: "from-accent to-secondary", title: "مركز المساعدة والمستندات", desc: "وثائق الخدمة الذاتية — 200+ مقالة، أسئلة شائعة، دلائل.", cta: "عرض الوثائق", href: "#", badge: "200+ مقالة" },
    ],
    demoBadge: "مميز",
    demoTitle: "احجز",
    demoAccent: "عرضًا توضيحيًا مباشرًا",
    demoBody: "عرض توضيحي شخصي لمدة 30 دقيقة مع خبيرنا. مجاني، دون التزام.",
    demoBookCta: "احجز عرضًا مجانيًا",
    demoContactCta: "نموذج الاتصال",
    contactMoreTitle: "طرق أخرى للتواصل",
    contactCards: [
      { icon: "Mail", label: "دعم البريد الإلكتروني", value: "itsinjamul@gmail.com", href: "mailto:itsinjamul@gmail.com" },
      { icon: "Phone", label: "الخط الساخن", value: "+880 1767-682381", href: "tel:+8801767682381" },
      { icon: "Clock", label: "ساعات الدعم", value: "9 صباحًا - 9 مساءً", href: "#" },
    ],
    slaTitle: "Response Time (SLA)",
    slaSubtitle: "استجابة الدعم حسب خطتك",
    slaHeaders: ["Plan", "Email", "WhatsApp", "Phone", "Live Demo"],
    slaRows: [
      { plan: "Lifetime Basic", email: "48 ساعة", whatsapp: "—", phone: "—", demo: "مرة" },
      { plan: "Starter", email: "24 ساعة", whatsapp: "—", phone: "—", demo: "✓" },
      { plan: "Growth", email: "8 ساعات", whatsapp: "15 دقيقة", phone: "ساعات العمل", demo: "✓" },
      { plan: "Scale", email: "4 ساعات", whatsapp: "فوري", phone: "24/7", demo: "غير محدود" },
    ],
  },
};

export function getSupportPageCopy(locale: Locale): SupportPageCopy {
  return supportPage[locale] ?? supportPage.bn;
}

// ─── /refund-policy ──────────────────────────────────────────────────────

export type RefundPageCopy = {
  heroBadge: string;
  heroTitle: string;
  heroAccent: string;
  heroSubtitle: string;
  guaranteedLabel: string;
  satisfactionLabel: string;
  guaranteeTitle: string;
  guaranteeTitleAccent: string;
  guaranteeBody: string;
  guaranteeBodyBold: string;
  stepsTitle: string;
  stepsSubtitle: string;
  steps: Array<{ step: string; title: string; desc: string }>;
  coveredTitle: string;
  coveredItems: string[];
  conditionsTitle: string;
  conditionsItems: string[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

const refundPage: Record<Locale, RefundPageCopy> = {
  bn: {
    heroBadge: "Refund Policy",
    heroTitle: "৩০ দিনের",
    heroAccent: "Full Money-Back Guarantee",
    heroSubtitle: "No Questions Asked. আপনি যদি কোনো কারণে সন্তুষ্ট না হন, ৩০ দিনের মধ্যে ১০০% টাকা ফেরত পাবেন।",
    guaranteedLabel: "GUARANTEED",
    satisfactionLabel: "100% Satisfaction",
    guaranteeTitle: "কোন সন্তুষ্টি নেই?",
    guaranteeTitleAccent: "টাকা ফেরত।",
    guaranteeBody: "আমরা আমাদের সফটওয়্যারের মানের উপর সম্পূর্ণ আত্মবিশ্বাসী। যদি কোনো কারণে আপনি সন্তুষ্ট না হন, কেনাকাটার ৩০ দিনের মধ্যে ইমেইল/WhatsApp করুন — আমরা",
    guaranteeBodyBold: "পূর্ণ টাকা ফেরত দেব। কোনো প্রশ্ন করা হবে না।",
    stepsTitle: "Refund কিভাবে পাবেন?",
    stepsSubtitle: "মাত্র ৩ ধাপে",
    steps: [
      { step: "১", title: "যোগাযোগ করুন", desc: "itsinjamul@gmail.com-এ ইমেইল পাঠান অথবা WhatsApp-এ message দিন। আপনার purchase invoice number mention করুন।" },
      { step: "২", title: "২৪ ঘণ্টায় reply", desc: "আমাদের support team ২৪ ঘণ্টার মধ্যে আপনাকে যোগাযোগ করে refund process শুরু করবে।" },
      { step: "৩", title: "৩-৭ দিনে টাকা ফেরত", desc: "আপনার পেমেন্ট method-এ (bKash/Nagad/bank) ৩-৭ কর্মদিবসে টাকা জমা হবে।" },
    ],
    coveredTitle: "যা Cover করা হয়",
    coveredItems: [
      "৩০ দিনের মধ্যে যে কোনো সাবস্ক্রিপশন plan",
      "Lifetime Basic plan (৩০ দিন পর্যন্ত)",
      "Technical issue, software bug — instant refund",
      "যদি আপনার প্রত্যাশা পূরণ না হয়",
      "কোনো কারণ ছাড়াই — No Questions Asked",
    ],
    conditionsTitle: "শর্ত",
    conditionsItems: [
      "কেনাকাটার তারিখ থেকে ৩০ দিন সময়সীমা",
      "Purchase invoice / transaction ID লাগবে",
      "SMS credit-এ টাকা খরচ হলে সেটা বাদ পড়বে",
      "Custom development / migration fee non-refundable",
      "Refund শুধু original পেমেন্ট method-এ যাবে",
    ],
    ctaTitle: "ঝুঁকি ছাড়া Try করুন",
    ctaSubtitle: "১৫ দিন ফ্রি ট্রায়াল + ৩০ দিন refund গ্যারান্টি = মোট ৪৫ দিন সম্পূর্ণ নিরাপদ",
    ctaPrimary: "ফ্রি ট্রায়াল শুরু",
    ctaSecondary: "সাপোর্ট টিমের সাথে কথা",
  },
  en: {
    heroBadge: "Refund Policy",
    heroTitle: "30-day",
    heroAccent: "Full Money-Back Guarantee",
    heroSubtitle: "No Questions Asked. If you're not satisfied for any reason, get 100% back within 30 days.",
    guaranteedLabel: "GUARANTEED",
    satisfactionLabel: "100% Satisfaction",
    guaranteeTitle: "Not satisfied?",
    guaranteeTitleAccent: "Money back.",
    guaranteeBody: "We're fully confident in the quality of our software. If for any reason you're not satisfied, email/WhatsApp us within 30 days of purchase — we'll",
    guaranteeBodyBold: "return your full payment. No questions asked.",
    stepsTitle: "How to get a refund?",
    stepsSubtitle: "Just 3 steps",
    steps: [
      { step: "1", title: "Contact Us", desc: "Email itsinjamul@gmail.com or send a WhatsApp message. Include your purchase invoice number." },
      { step: "2", title: "Reply in 24 hours", desc: "Our support team will contact you within 24 hours and start the refund process." },
      { step: "3", title: "3-7 days to refund", desc: "Amount deposited to your payment method (bKash/Nagad/bank) within 3-7 business days." },
    ],
    coveredTitle: "What's Covered",
    coveredItems: [
      "Any subscription plan within 30 days",
      "Lifetime Basic plan (up to 30 days)",
      "Technical issue, software bug — instant refund",
      "If your expectations aren't met",
      "No reason needed — No Questions Asked",
    ],
    conditionsTitle: "Conditions",
    conditionsItems: [
      "30-day window from purchase date",
      "Purchase invoice / transaction ID required",
      "SMS credits spent will be deducted",
      "Custom development / migration fees non-refundable",
      "Refunds only to original payment method",
    ],
    ctaTitle: "Try Without Risk",
    ctaSubtitle: "15-day free trial + 30-day refund guarantee = 45 days fully safe",
    ctaPrimary: "Start Free Trial",
    ctaSecondary: "Talk to Support",
  },
  ur: {
    heroBadge: "Refund Policy",
    heroTitle: "۳۰ دن کی",
    heroAccent: "مکمل رقم واپسی کی ضمانت",
    heroSubtitle: "No Questions Asked. اگر آپ کسی بھی وجہ سے مطمئن نہیں ہیں، ۳۰ دن میں ۱۰۰٪ واپس حاصل کریں۔",
    guaranteedLabel: "GUARANTEED",
    satisfactionLabel: "100% اطمینان",
    guaranteeTitle: "مطمئن نہیں؟",
    guaranteeTitleAccent: "رقم واپس۔",
    guaranteeBody: "ہم اپنے سافٹ ویئر کے معیار پر مکمل پر اعتماد ہیں۔ خریداری کے ۳۰ دن کے اندر ای میل/WhatsApp کریں — ہم",
    guaranteeBodyBold: "مکمل رقم واپس کریں گے۔ کوئی سوال نہیں۔",
    stepsTitle: "Refund کیسے ملے گا؟",
    stepsSubtitle: "صرف ۳ مراحل میں",
    steps: [
      { step: "۱", title: "رابطہ کریں", desc: "itsinjamul@gmail.com پر ای میل یا WhatsApp پر پیغام۔ انوائس نمبر شامل کریں۔" },
      { step: "۲", title: "۲۴ گھنٹوں میں جواب", desc: "ہماری سپورٹ ٹیم ۲۴ گھنٹوں میں رابطہ کرے گی۔" },
      { step: "۳", title: "۳-۷ دن میں رقم واپس", desc: "آپ کے پے منٹ طریقہ پر ۳-۷ کاروباری دنوں میں رقم جمع۔" },
    ],
    coveredTitle: "کیا کور کیا جاتا ہے",
    coveredItems: [
      "۳۰ دن کے اندر کوئی بھی سبسکرپشن پلان",
      "Lifetime Basic (۳۰ دن تک)",
      "تکنیکی مسئلہ، سافٹ ویئر bug — فوری refund",
      "اگر آپ کی توقعات پوری نہ ہوں",
      "بغیر کسی وجہ — No Questions Asked",
    ],
    conditionsTitle: "شرائط",
    conditionsItems: [
      "خریداری کی تاریخ سے ۳۰ دن",
      "انوائس / لین دین ID درکار",
      "خرچ شدہ SMS کریڈٹ کٹوتی ہوگی",
      "کسٹم ڈویلپمنٹ / مائیگریشن فیس ناقابل واپسی",
      "Refund صرف اصل ادائیگی طریقہ پر",
    ],
    ctaTitle: "بغیر خطرے کے آزمائیں",
    ctaSubtitle: "۱۵ دن مفت + ۳۰ دن refund ضمانت = ۴۵ دن مکمل محفوظ",
    ctaPrimary: "مفت آزمائش شروع",
    ctaSecondary: "سپورٹ سے بات کریں",
  },
  ar: {
    heroBadge: "Refund Policy",
    heroTitle: "30 يومًا",
    heroAccent: "ضمان استرداد كامل",
    heroSubtitle: "بدون أسئلة. إذا لم تكن راضيًا لأي سبب، استرد 100٪ خلال 30 يومًا.",
    guaranteedLabel: "GUARANTEED",
    satisfactionLabel: "رضا 100٪",
    guaranteeTitle: "غير راضٍ؟",
    guaranteeTitleAccent: "استرد المال.",
    guaranteeBody: "نحن واثقون تمامًا من جودة برنامجنا. إذا لم تكن راضيًا، راسلنا عبر البريد/WhatsApp خلال 30 يومًا —",
    guaranteeBodyBold: "سنعيد كامل المبلغ. بدون أسئلة.",
    stepsTitle: "كيف تسترد المال؟",
    stepsSubtitle: "3 خطوات فقط",
    steps: [
      { step: "1", title: "اتصل بنا", desc: "أرسل بريدًا إلى itsinjamul@gmail.com أو WhatsApp. أضف رقم الفاتورة." },
      { step: "2", title: "رد خلال 24 ساعة", desc: "فريق الدعم لدينا سيتواصل معك خلال 24 ساعة." },
      { step: "3", title: "3-7 أيام للاسترداد", desc: "المبلغ يودع في طريقة الدفع خلال 3-7 أيام عمل." },
    ],
    coveredTitle: "ما هو مغطى",
    coveredItems: [
      "أي خطة اشتراك خلال 30 يومًا",
      "خطة Lifetime Basic (حتى 30 يومًا)",
      "مشكلة تقنية، خطأ برمجي — استرداد فوري",
      "إذا لم تتحقق توقعاتك",
      "بدون سبب — بدون أسئلة",
    ],
    conditionsTitle: "الشروط",
    conditionsItems: [
      "30 يومًا من تاريخ الشراء",
      "يلزم رقم الفاتورة / معاملة",
      "أرصدة SMS المستخدمة ستُخصم",
      "رسوم التطوير المخصص / الترحيل غير قابلة للاسترداد",
      "الاسترداد فقط إلى طريقة الدفع الأصلية",
    ],
    ctaTitle: "جرب بدون مخاطر",
    ctaSubtitle: "15 يومًا مجانية + 30 يومًا ضمان استرداد = 45 يومًا آمنة",
    ctaPrimary: "ابدأ التجربة المجانية",
    ctaSecondary: "تحدث مع الدعم",
  },
};

export function getRefundPageCopy(locale: Locale): RefundPageCopy {
  return refundPage[locale] ?? refundPage.bn;
}
