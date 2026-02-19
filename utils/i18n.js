const translations = {
  en: {
    siteTitle: "Egyptian Museum",

    hero: {
      museumName: "THE AFTERLIFE EGYPTIAN MUSEUM",
      title: "DISCOVER EGYPT'S TIMELESS LEGACY",
      subtitle:
        "Explore royal treasures, immersive virtual tours, and curated exhibits"
    },
    home: {
  spotlightKicker: "Museum Spotlight",
  spotlightTitle: "Step Into the Grand Halls",
  spotlightText:
    "Watch a cinematic glimpse of the galleries, artifacts, and the golden atmosphere that makes every visit unforgettable.",
  enterVirtualTour: "Enter Virtual Tour",
  autoPlaysNote: "Auto plays, muted by default.",

  weatherTitle: "Weather in Cairo",
  weatherSubtitle: "Plan your visit with live conditions.",

  featuredExhibits: "Featured Exhibits",
  shopHighlights: "Shop Highlights",
  visitorTestimonials: "Visitor Testimonials"
},

    nav: {
      home: "Home",
      about: "About",
      exhibits: "Exhibits",
      virtualTour: "Virtual Tour",
      games: "Games",
      shop: "Shop",
      testimonials: "Testimonials",
      planTrip: "Plan Your Trip",
      login: "Login",
      register: "Register",
      dashboard: "Dashboard"
    },

    buttons: {
      learnMore: "Learn More",
      addToCart: "Add to Cart",
      submit: "Submit",
      startVirtualTour: "Start Virtual Tour",
      exploreExhibits: "Explore Exhibits"
    },
footer: {
  description: "Timeless history, immersive culture, and world-class experiences.",
  visit: "Visit",
  location: "Downtown Cairo, Egypt",
  hours: "Open daily 9:00 - 19:00",
  guidedTours: "Guided tours every hour",
  explore: "Explore",
  featuredExhibits: "Featured Exhibits",
  virtualTours: "Virtual Tours",
  museumShop: "Museum Shop",
  planTrip: "Plan Your Trip",
  connect: "Connect",
  email: "Email",
  phone: "Phone",
  support: "Support",
  copyright: "© 2026 Egyptian Museum. All rights reserved.",
  about: "About",
  accessibility: "Accessibility",
  newsletter: "Newsletter"
},

  },

  ar: {
    siteTitle: "المتحف المصري",

    hero: {
      museumName: "متحف الحياة الأخرى المصري",
      title: "اكتشف إرث مصر الخالد",
      subtitle:
        "استكشف الكنوز الملكية، وجولات افتراضية تفاعلية، ومعارض مختارة"
    },
    home: {
  spotlightKicker: "لمحة عن المتحف",
  spotlightTitle: "ادخل القاعات الكبرى",
  spotlightText:
    "شاهد لمحة سينمائية عن القاعات والقطع الأثرية والأجواء الذهبية التي تجعل كل زيارة لا تُنسى.",
  enterVirtualTour: "ادخل الجولة الافتراضية",
  autoPlaysNote: "يعمل تلقائيًا، بدون صوت افتراضيًا.",

  weatherTitle: "الطقس في القاهرة",
  weatherSubtitle: "خطّط زيارتك مع تحديثات الطقس المباشرة.",

  featuredExhibits: "أبرز المعارض",
  shopHighlights: "مقتطفات من المتجر",
  visitorTestimonials: "آراء الزوار"
},


    nav: {
      home: "الرئيسية",
      about: "عن المتحف",
      exhibits: "المعارض",
      virtualTour: "جولة افتراضية",
      games: "الألعاب",
      shop: "المتجر",
      testimonials: "آراء الزوار",
      planTrip: "خطط زيارتك",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      dashboard: "لوحة التحكم"
    },

    buttons: {
      learnMore: "اعرف المزيد",
      addToCart: "أضف للسلة",
      submit: "إرسال",
      startVirtualTour: "ابدأ الجولة الافتراضية",
      exploreExhibits: "استكشف المعارض"
    },
footer: {
  description: "تاريخ خالد، ثقافة غامرة، وتجارب عالمية المستوى.",
  visit: "زيارة",
  location: "وسط القاهرة، مصر",
  hours: "مفتوح يوميًا من 9:00 إلى 19:00",
  guidedTours: "جولات إرشادية كل ساعة",
  explore: "استكشف",
  featuredExhibits: "أبرز المعارض",
  virtualTours: "الجولات الافتراضية",
  museumShop: "متجر المتحف",
  planTrip: "خطط زيارتك",
  connect: "تواصل",
  email: "البريد الإلكتروني",
  phone: "الهاتف",
  support: "الدعم",
  copyright: "© 2026 المتحف المصري. جميع الحقوق محفوظة.",
  about: "عن المتحف",
  accessibility: "إمكانية الوصول",
  newsletter: "النشرة البريدية"
},

  }
};

const getTranslations = (lang) => translations[lang] || translations.en;

module.exports = { getTranslations };
