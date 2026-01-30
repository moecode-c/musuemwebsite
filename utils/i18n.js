const translations = {
  en: {
    siteTitle: "Egyptian Museum",
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
      submit: "Submit"
    }
  },
  ar: {
    siteTitle: "المتحف المصري",
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
      submit: "إرسال"
    }
  }
};

const getTranslations = (lang) => translations[lang] || translations.en;

module.exports = { getTranslations };
