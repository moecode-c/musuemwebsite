// utils/i18n.js

const translations = {
  en: {
    testimonials: {
  title: "Testimonials",
  subtitle: "Real stories from visitors who explored the heart of Egypt.",
  highlightsTitle: "Visitor Highlights",
  highlightsText: "Every review helps us create more meaningful experiences for future visitors.",
  averageRating: "Average rating",
  formTitle: "Share your experience",
  name: "Name",
  message: "Message",
  rating: "Rating (1-5)",
  submit: "Submit"
},
    location: {
  title: "Map",
  subtitle: "Visit us in central Cairo and explore every gallery with interactive map pins.",
  commonPins: "Most Common Pins",
  noPins: "No common pins yet.",
  addressTitle: "Address",
  addressText: "Al Tahrir Square, Downtown Cairo, Egypt",
  phone: "+20 2 2579 6584",
  email: "visit@musuem.org",
  hoursTitle: "Hours",
  hours: [
    "Sunday–Thursday: 9:00 AM – 5:00 PM",
    "Friday: 10:00 AM – 4:00 PM",
    "Saturday: 11:00 AM – 3:00 PM"
  ],
  gettingHereTitle: "Getting Here",
  gettingHere: [
    "Metro: Sadat Station (5-minute walk)",
    "Bus: Routes 174, 356, 400",
    "Parking: Underground lot on Abdel Khalek Tharwat St."
  ]
},
    newsletter: {
  title: "Newsletter",
  subtitle: "Get exhibition previews, curator stories, and event invitations straight to your inbox.",
  receiveTitle: "What you'll receive",
  receiveList: [
    "Monthly highlights from the Pharaohs, Islamic, and Christian galleries.",
    "Behind-the-scenes conservation updates and artifact spotlights.",
    "Early access to workshops, tours, and special programs.",
    "Members-only discounts in the museum shop."
  ],
  frequencyTitle: "Frequency",
  frequencyText: "We send 1-2 emails per month. No spam. Unsubscribe anytime.",
  fullName: "Full Name (optional)",
  namePlaceholder: "Your name",
  email: "Email",
  emailPlaceholder: "you@example.com",
  interests: "Interests",
  allUpdates: "All updates",
  exhibitions: "Exhibitions",
  events: "Events & Workshops",
  research: "Research & Conservation",
  subscribe: "Subscribe"
},
    accessibility: {
  title: "Accessibility",
  subtitle: "Inclusive design, assistive services, and respectful care for every visitor.",
  mobilityTitle: "Mobility Access",
  mobilityText: "Step-free entrances, elevators, and wide gallery routes across all floors.",
  audioTitle: "Audio & Captions",
  audioText: "Audio guides, captions on videos, and induction loops in lecture halls.",
  interpretationTitle: "Interpretation",
  interpretationText: "Advance requests for sign language interpretation and guided tours.",
  sensoryTitle: "Sensory-Friendly",
  sensoryText: "Quiet zones, reduced-light exhibits, and sensory-friendly visiting hours.",
  supportTitle: "Visitor Support",
  supportList: [
    "Complimentary wheelchairs available at the main entrance.",
    "Assistance dogs and service animals are welcome.",
    "Priority seating for talks, screenings, and workshops.",
    "Large-print and high-contrast gallery guides."
  ],
  helpTitle: "Need help planning?",
  helpText: "Contact our accessibility desk for customized routes and advance accommodations.",
  email: "access@musuem.org",
  phone: "+20 2 2345 6789"
},
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
    testimonials: {
  title: "آراء الزوار",
  subtitle: "قصص حقيقية من زوار استكشفوا قلب مصر.",
  highlightsTitle: "أبرز آراء الزوار",
  highlightsText: "كل تقييم يساعدنا على خلق تجارب أكثر معنى للزوار القادمين.",
  averageRating: "متوسط التقييم",
  formTitle: "شارك تجربتك",
  name: "الاسم",
  message: "الرسالة",
  rating: "التقييم (1-5)",
  submit: "إرسال"
},
    location: {
  title: "الخريطة",
  subtitle: "زورونا في وسط القاهرة واستكشف كل قاعة من خلال دبابيس الخريطة التفاعلية.",
  commonPins: "أبرز الدبابيس",
  noPins: "لا توجد دبابيس شائعة بعد.",
  addressTitle: "العنوان",
  addressText: "ميدان التحرير، وسط القاهرة، مصر",
  phone: "+20 2 2579 6584",
  email: "visit@musuem.org",
  hoursTitle: "ساعات العمل",
  hours: [
    "الأحد–الخميس: 9:00 صباحًا – 5:00 مساءً",
    "الجمعة: 10:00 صباحًا – 4:00 مساءً",
    "السبت: 11:00 صباحًا – 3:00 مساءً"
  ],
  gettingHereTitle: "كيفية الوصول",
  gettingHere: [
    "مترو: محطة السادات (5 دقائق سيرًا)",
    "حافلة: خطوط 174، 356، 400",
    "مواقف السيارات: موقف تحت الأرض في شارع عبد الخالق ثروت"
  ]
},
    newsletter: {
  title: "النشرة البريدية",
  subtitle: "احصل على معاينات المعارض وقصص القيّمين ودعوات الفعاليات مباشرة في صندوق بريدك.",
  receiveTitle: "ما الذي ستتلقاه",
  receiveList: [
    "أبرز ما يميز قاعات الفراعنة والإسلامية والقبطية شهريًا.",
    "تحديثات الترميم من وراء الكواليس وأضواء على القطع الأثرية.",
    "وصول مبكر إلى ورش العمل والجولات والبرامج الخاصة.",
    "خصومات حصرية للأعضاء في متجر المتحف."
  ],
  frequencyTitle: "التكرار",
  frequencyText: "نرسل 1-2 رسائل بريدية شهريًا. لا رسائل مزعجة. إلغاء الاشتراك في أي وقت.",
  fullName: "الاسم الكامل (اختياري)",
  namePlaceholder: "اسمك",
  email: "البريد الإلكتروني",
  emailPlaceholder: "you@example.com",
  interests: "الاهتمامات",
  allUpdates: "جميع التحديثات",
  exhibitions: "المعارض",
  events: "الفعاليات وورش العمل",
  research: "البحث والترميم",
  subscribe: "اشترك"
},
    accessibility: {
  title: "إمكانية الوصول",
  subtitle: "تصميم شامل، وخدمات مساعدة، ورعاية محترمة لكل زائر.",
  mobilityTitle: "الوصول للأشخاص ذوي الإعاقة الحركية",
  mobilityText: "مداخل خالية من الدرجات، ومصاعد، ومسارات واسعة في جميع الطوابق.",
  audioTitle: "الصوت والتعليقات",
  audioText: "أدلة صوتية، وتعليقات على مقاطع الفيديو، وحلقات توصيل في قاعات المحاضرات.",
  interpretationTitle: "الترجمة الفورية",
  interpretationText: "طلبات مسبقة لترجمة لغة الإشارة والجولات الإرشادية.",
  sensoryTitle: "مناسب للحساسية الحسية",
  sensoryText: "مناطق هادئة، ومعارض بإضاءة خافتة، وساعات زيارة مناسبة حسيًا.",
  supportTitle: "دعم الزوار",
  supportList: [
    "كراسي متحركة مجانية متاحة عند المدخل الرئيسي.",
    "كلاب المساعدة وحيوانات الخدمة مرحب بها.",
    "أولوية الجلوس في المحادثات والعروض وورش العمل.",
    "أدلة المعارض بالطباعة الكبيرة والتباين العالي."
  ],
  helpTitle: "هل تحتاج مساعدة في التخطيط؟",
  helpText: "تواصل مع مكتب إمكانية الوصول لدينا للحصول على مسارات مخصصة وترتيبات مسبقة.",
  email: "access@musuem.org",
  phone: "+20 2 2345 6789"
},
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


const getTranslations = (lang) => translations[lang] || translations.en;

const makeT = (lang) => {
  return getTranslations(lang);
};

module.exports = { getTranslations, makeT };