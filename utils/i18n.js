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
planTrip: {
  title: "Plan Your Trip",
  subtitle: "Prepare your itinerary with tickets, timing, and travel tips.",

  weatherTitle: "Weather Update",

  tips: {
    title: "Travel Tips",
    tip1: "Arrive early for guided tours.",
    tip2: "Book tickets online to skip the queue.",
    tip3: "Comfortable walking shoes recommended."
  },

  form: {
    fullName: "Full Name",
    email: "Email",
    ticketType: "Ticket Type",
    selectTicket: "Select a ticket",
    visitDate: "Visit Date",
    submit: "Request Plan"
  }
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
planTrip: {
  title: "خطّط لزيارتك",
  subtitle: "جهّز برنامج زيارتك بالتذاكر والمواعيد ونصائح السفر.",

  weatherTitle: "تحديث الطقس",

  tips: {
    title: "نصائح السفر",
    tip1: "احضر مبكرًا للجولات الإرشادية.",
    tip2: "احجز التذاكر عبر الإنترنت لتجنب الزحام.",
    tip3: "يُنصح بارتداء أحذية مريحة للمشي."
  },

  form: {
    fullName: "الاسم بالكامل",
    email: "البريد الإلكتروني",
    ticketType: "نوع التذكرة",
    selectTicket: "اختر تذكرة",
    visitDate: "تاريخ الزيارة",
    submit: "إرسال الطلب"
  }
},

  }
};

const getTranslations = (lang) => translations[lang] || translations.en;

const makeT = (lang) => {
  const dict = getTranslations(lang);
  return (key) => {
    const parts = String(key).split(".");
    let cur = dict;
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        return key; // show key if missing
      }
    }
    return typeof cur === "string" ? cur : key;
  };
};

module.exports = { getTranslations, makeT };
