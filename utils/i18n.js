// utils/i18n.js

const translations = {
  en: {
    siteTitle: "Egyptian Museum",

    shop: {
      title: "Shop",
      subtitle: "Bring home curated souvenirs and replicas"
    },

    cart: {
      title: "Your Cart",
      subtitle: "Review items and update quantities",
      total: "Total",
      checkout: "Proceed to Checkout",
      empty: "Your cart is empty"
    },

    quiz: {
      title: "Egyptian History Quiz",
      subtitle: "Answer 15 questions to explore Ancient Egypt",
      learnTitle: "Learn Through Play",
      learnText: "Each answer includes a short explanation",
      start: "Start Quiz",
      next: "Next",
      score: "Score",
      question: "Question"
    },

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
      dashboard: "Dashboard",
      menu: "Menu",
      theme: "Theme",

      aboutMenu: {
        aboutUs: "About Us",
        mission: "Mission and Goal",
        accessibility: "Accessibility",
        newsletter: "Newsletter",
        map: "Map",
        testimonials: "Testimonials"
      },

      exhibitsMenu: {
        pharaoh: "Pharaoh's Collection",
        islamic: "Islamic Collection",
        christian: "Christian Collection"
      },

      virtualTourMenu: {
        pharaoh: "Pharaohs Tour",
        islamic: "Islamic Tour",
        christian: "Christian Tour"
      },

      gamesMenu: {
        quiz: "Quiz Game",
        explorer: "Explorer Game",
        pyramid: "Pyramid Builder"
      },

      shopMenu: {
        books: "Books & Materials",
        souvenirs: "Souvenirs",
        cart: "Cart"
      }
    },

    buttons: {
      learnMore: "Learn More",
      addToCart: "Add to Cart",
      submit: "Submit",
      startVirtualTour: "Start Virtual Tour",
      exploreExhibits: "Explore Exhibits"
    },

    footer: {
      description:
        "Timeless history, immersive culture, and world-class experiences.",
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

    // ✅ TOP-LEVEL about key
    about: {
      title: "About the Museum",
      subtitle:
        "Honoring Egypt's heritage through immersive storytelling, research, and innovation.",

      missionTitle: "Mission and Goal",
      missionText:
        "Our mission is to preserve, interpret, and share Egypt's cultural legacy. We aim to inspire curiosity, deepen historical understanding, and connect visitors with the people, beliefs, and achievements that shaped civilization.",

      deliverTitle: "What We Deliver",
      deliver: [
        "Scholarly exhibitions grounded in ongoing research",
        "Interactive learning for families, schools, and travelers",
        "Inclusive access through multilingual and sensory resources",
        "Digital preservation for future generations"
      ],

      storyTitle: "Our Story",
      story: {
        foundationTitle: "Foundation",
        foundationText:
          "Established to safeguard Egypt's archaeological heritage and public education",
        expansionTitle: "Expansion",
        expansionText:
          "Expanded galleries to include daily life, faith, and artistic traditions",
        digitalTitle: "Digital Era",
        digitalText:
          "Launched virtual tours, multilingual audio guides, and open research access"
      },

      valuesTitle: "Values That Guide Us",
      values: {
        preservationTitle: "Preservation",
        preservationText:
          "Protecting artifacts with conservation science and ethical stewardship",
        educationTitle: "Education",
        educationText:
          "Inviting learners of all ages to engage with history through stories and design",
        communityTitle: "Community",
        communityText:
          "Partnering with local artisans, researchers, and cultural institutions",
        innovationTitle: "Innovation",
        innovationText:
          "Blending heritage with modern technology to unlock deeper understanding"
      },

      visitor: {
        title: "Visitor Experience",
        text:
          "Every visit is a journey through time. Our galleries are designed to immerse you in ancient Egypt like never before.",
        list: [
          "Daily curator talks and rotating spotlight artifacts",
          "Hands-on learning labs for students and educators",
          "Climate-controlled vaults for rare manuscripts"
        ],
        stats: {
          artifacts: "Artifacts",
          stations: "Interactive Stations",
          languages: "Languages"
        }
      },

      cta: {
        title: "Ready to Visit?",
        text:
          "Explore exhibitions, reserve tickets, and create your personalized itinerary.",
        button: "Start Planning"
      }
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
    }
  },

  ar: {
    siteTitle: "المتحف المصري",

    shop: {
      title: "المتجر",
      subtitle: "احصل على تذكارات ونسخ مختارة بعناية"
    },

    cart: {
      title: "سلة المشتريات",
      subtitle: "راجع المنتجات وعدّل الكميات",
      total: "الإجمالي",
      checkout: "إتمام الشراء",
      empty: "سلة المشتريات فارغة"
    },

    quiz: {
      title: "اختبار التاريخ المصري",
      subtitle: "أجب عن 15 سؤالًا لاكتشاف مصر القديمة",
      learnTitle: "تعلّم من خلال اللعب",
      learnText: "كل إجابة تتضمن شرحًا مختصرًا",
      start: "ابدأ الاختبار",
      next: "التالي",
      score: "النتيجة",
      question: "السؤال"
    },

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
      dashboard: "لوحة التحكم",
      menu: "القائمة",
      theme: "المظهر",

      aboutMenu: {
        aboutUs: "عن المتحف",
        mission: "الرسالة والهدف",
        accessibility: "إمكانية الوصول",
        newsletter: "النشرة البريدية",
        map: "الخريطة",
        testimonials: "آراء الزوار"
      },

      exhibitsMenu: {
        pharaoh: "مجموعة الفراعنة",
        islamic: "المجموعة الإسلامية",
        christian: "المجموعة القبطية"
      },

      virtualTourMenu: {
        pharaoh: "جولة الفراعنة",
        islamic: "جولة إسلامية",
        christian: "جولة قبطية"
      },

      gamesMenu: {
        quiz: "لعبة الاختبار",
        explorer: "لعبة المستكشف",
        pyramid: "بناء الهرم"
      },

      shopMenu: {
        books: "كتب ومواد",
        souvenirs: "تذكارات",
        cart: "السلة"
      }
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

    // ✅ TOP-LEVEL about key
    about: {
      title: "عن المتحف",
      subtitle:
        "نُكرّم تراث مصر من خلال السرد التفاعلي، والبحث العلمي، والابتكار.",

      missionTitle: "الرسالة والهدف",
      missionText:
        "تتمثل رسالتنا في الحفاظ على التراث الثقافي المصري وتفسيره ومشاركته. نهدف إلى إلهام الفضول وتعميق الفهم التاريخي وربط الزوار بالأشخاص والمعتقدات والإنجازات التي شكّلت الحضارة.",

      deliverTitle: "ماذا نقدم",
      deliver: [
        "معارض علمية قائمة على أبحاث مستمرة",
        "تجارب تعليمية تفاعلية للعائلات والمدارس والزوار",
        "إتاحة شاملة من خلال موارد متعددة اللغات والحواس",
        "حفظ رقمي للأجيال القادمة"
      ],

      storyTitle: "قصتنا",
      story: {
        foundationTitle: "التأسيس",
        foundationText:
          "تأسس المتحف لحماية التراث الأثري المصري وتعزيز التعليم العام",
        expansionTitle: "التوسع",
        expansionText:
          "توسعت القاعات لتشمل الحياة اليومية والمعتقدات والتقاليد الفنية",
        digitalTitle: "العصر الرقمي",
        digitalText:
          "إطلاق الجولات الافتراضية والأدلة الصوتية متعددة اللغات وإتاحة البحث المفتوح"
      },

      valuesTitle: "قيمنا",
      values: {
        preservationTitle: "الحفظ",
        preservationText:
          "حماية القطع الأثرية بأساليب علمية وأخلاقية",
        educationTitle: "التعليم",
        educationText:
          "تمكين المتعلمين من جميع الأعمار عبر القصص والتصميم",
        communityTitle: "المجتمع",
        communityText:
          "التعاون مع الحرفيين والباحثين والمؤسسات الثقافية",
        innovationTitle: "الابتكار",
        innovationText:
          "دمج التراث مع التكنولوجيا الحديثة لتعميق الفهم"
      },

      visitor: {
        title: "تجربة الزائر",
        text:
          "كل زيارة هي رحلة عبر الزمن. صُممت قاعاتنا لتغمرك في مصر القديمة كما لم تره من قبل.",
        list: [
          "جلسات يومية مع القيّمين على المعارض",
          "مختبرات تعليمية عملية للطلاب والمعلمين",
          "خزائن محكمة التحكم لحفظ المخطوطات النادرة"
        ],
        stats: {
          artifacts: "قطعة أثرية",
          stations: "محطة تفاعلية",
          languages: "لغة"
        }
      },

      cta: {
        title: "هل أنت مستعد للزيارة؟",
        text:
          "استكشف المعارض واحجز التذاكر وأنشئ برنامج زيارتك الخاص.",
        button: "ابدأ التخطيط"
      }
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
    }
  }
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const getTranslations = (lang) => translations[lang] || translations.en;

const makeT = (lang) => {
  return getTranslations(lang);
};

module.exports = { getTranslations, makeT };