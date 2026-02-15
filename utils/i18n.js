const translations = {
  en: {
    siteTitle: "Egyptian Museum",

    hero: {
      museumName: "THE AFTERLIFE EGYPTIAN MUSEUM",
      title: "DISCOVER EGYPT'S TIMELESS LEGACY",
      subtitle:
        "Explore royal treasures, immersive virtual tours, and curated exhibits"
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
    }
  }
};

const getTranslations = (lang) => translations[lang] || translations.en;

module.exports = { getTranslations };
