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
  connect: "Connect",
  explore: "Explore",
  visit: "Visit",
  rights: "Egyptian Museum. All rights reserved"
}

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
  connect: "تواصل",
  explore: "استكشف",
  visit: "زيارة",
  rights: "المتحف المصري. جميع الحقوق محفوظة"
}

  }
};

const getTranslations = (lang) => translations[lang] || translations.en;

module.exports = { getTranslations };
