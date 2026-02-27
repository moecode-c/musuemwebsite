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
      subtitle: "Answer 15 questions to explore the people, places, and ideas that shaped Ancient Egypt.",
      learnTitle: "Learn Through Play",
      learnText: "Each answer includes a short explanation to help you learn.",
      start: "Start Quiz",
      next: "Next",
      finish: "Finish",
      score: "Score",
      question: "Question",
      of: "of",
      intro: "Start the quiz when you're ready. Try to answer based on what you know—then read the explanation to learn more about Egyptian history.",
      selectAnswer: "Select an answer to reveal the explanation.",
      correct: "✅ Correct!",
      incorrect: "❌ Not quite.",
      resultTitle: "Great job!",
      scored: "You scored",
      outOf: "out of",
      msgExcellent: "Excellent! You have a strong foundation in Egyptian history.",
      msgGreat: "Great effort! Review the notes below to deepen your knowledge.",
      msgNice: "Nice start! Read the explanations below and try again.",
      correctAnswer: "Correct answer:",
      restart: "Play Again"
    },

    explorer: {
      title: "Explorer Game",
      subtitle: "Exploration challenge coming soon.",
      placeholder: "Add your explorer game content here."
    },

    pyramid: {
      title: "Pyramid Builder",
      subtitle: "Build your own monument block by block in a compact sandbox.",
      learnTitle: "Learn by building",
      learnText: "Pyramid Builder helps children explore Egyptian history through hands-on play. By stacking blocks, they learn about ancient architecture, planning, and the shapes used in real pyramids.",
      howToPlay: "How to play",
      tip1: "Click <strong>Start</strong> then click the game to lock the pointer.",
      tip2: "Move with <strong>WASD</strong>, fly with <strong>Space</strong> and <strong>Shift</strong>.",
      tip3: "<strong>Left-click</strong> places a block, <strong>Right-click</strong> removes one.",
      tip4: "Select materials from the hotbar.",
      startSubtitle: "Pyramid Builder is an exciting game where you construct ancient pyramids using various materials and strategies.",
      start: "Start",
      instructions: "Click to play. WASD to move. 🖱️ Left-click: Place | 🖱️ Right-click: Remove",
      materials: "Materials"
    },

    hero: {
      museumName: "THE AFTERLIFE EGYPTIAN MUSEUM",
      title: "DISCOVER EGYPT'S TIMELESS LEGACY",
      subtitle: "Explore royal treasures, immersive virtual tours, and curated exhibits"
    },

    home: {
      spotlightKicker: "Museum Spotlight",
      spotlightTitle: "Step Into the Grand Halls",
      spotlightText: "Watch a cinematic glimpse of the galleries, artifacts, and the golden atmosphere that makes every visit unforgettable.",
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

    about: {
      title: "About the Museum",
      subtitle: "Honoring Egypt's heritage through immersive storytelling, research, and innovation.",
      missionTitle: "Mission and Goal",
      missionText: "Our mission is to preserve, interpret, and share Egypt's cultural legacy. We aim to inspire curiosity, deepen historical understanding, and connect visitors with the people, beliefs, and achievements that shaped civilization.",
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
        foundationText: "Established to safeguard Egypt's archaeological heritage and public education",
        expansionTitle: "Expansion",
        expansionText: "Expanded galleries to include daily life, faith, and artistic traditions",
        digitalTitle: "Digital Era",
        digitalText: "Launched virtual tours, multilingual audio guides, and open research access"
      },
      valuesTitle: "Values That Guide Us",
      values: {
        preservationTitle: "Preservation",
        preservationText: "Protecting artifacts with conservation science and ethical stewardship",
        educationTitle: "Education",
        educationText: "Inviting learners of all ages to engage with history through stories and design",
        communityTitle: "Community",
        communityText: "Partnering with local artisans, researchers, and cultural institutions",
        innovationTitle: "Innovation",
        innovationText: "Blending heritage with modern technology to unlock deeper understanding"
      },
      visitor: {
        title: "Visitor Experience",
        text: "Every visit is a journey through time. Our galleries are designed to immerse you in ancient Egypt like never before.",
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
        text: "Explore exhibitions, reserve tickets, and create your personalized itinerary.",
        button: "Start Planning"
      }
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

    exhibits: {
      allTitle: "Exhibits",
      allSubtitle: "Discover Pharaoh, Islamic, and Christian galleries.",
      pharaohTitle: "Pharaoh's Collection",
      pharaohSubtitle: "Explore royal artifacts, sacred relics, and treasures of the dynasties.",
      islamicTitle: "Islamic Collection",
      islamicSubtitle: "Discover artistic traditions, manuscripts, and architectural masterpieces.",
      christianTitle: "Christian Collection",
      christianSubtitle: "Experience icons, textiles, and heritage from Egypt's Christian era."
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

    virtualTour: {
      title: "Virtual Tour",
      subtitle: "Take an immersive guided tour through our galleries.",
      heroTitle: "Virtual Museum Experience",
      heroSubtitle: "Embark on an immersive journey through our collections from anywhere in the world. Explore ancient artifacts and historical treasures in stunning detail.",
      pharaohTitle: "Pharaohs Virtual Tour",
      pharaohIntro: "Welcome to the Pharaohs Virtual Tour at The Afterlife Museum! This interactive page allows you to explore the wonders of Ancient Egypt from anywhere in the world. Discover the grandeur of the pharaohs, view immersive 360° panoramas of our museum galleries, and learn about the artifacts and stories that shaped Egyptian civilization.",
      islamicTitle: "Islamic Virtual Tour",
      islamicIntro: "Welcome to the Islamic Virtual Tour at The Afterlife Museum! Explore the rich artistic traditions, manuscripts, and architectural masterpieces of the Islamic world from the comfort of your home.",
      christianTitle: "Christian Virtual Tour",
      christianIntro: "Welcome to the Christian Virtual Tour at The Afterlife Museum! Discover the icons, textiles, and heritage from Egypt's rich Christian era through our immersive 360° gallery.",
      audioGuide: "Audio Guide",
      downloadBrochure: "Download Brochure",
      tourInfo: "Tour Info",
      fullscreen: "Fullscreen",
      tourNotesTitle: "Tour Notes",
      tourNotesText: "Our virtual tour uses cutting-edge technology to provide you with a seamless museum experience. Navigate through our exhibits, zoom in on artifacts, and learn about their history with our interactive information points.",
      islamicHeroSubtitle: "Explore Islamic art, architecture, and historical treasures through a guided virtual experience.",
      islamicWelcome: "Welcome",
      islamicTourNotesText: "For the best experience, use headphones and explore each panorama point to reveal hidden details about artifacts, architectural motifs, and historical narratives.",
      christianHeroSubtitle: "Explore historic churches, sacred art, and Christian heritage.",
      christianWelcome: "Welcome",
      christianTourNotesText: "Use the guide to learn about Christian history, art, and cultural influence."
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
      subtitle: "أجب عن 15 سؤالًا لاستكشاف الناس والأماكن والأفكار التي شكّلت مصر القديمة.",
      learnTitle: "تعلّم من خلال اللعب",
      learnText: "كل إجابة تتضمن شرحًا مختصرًا لمساعدتك على التعلم.",
      start: "ابدأ الاختبار",
      next: "التالي",
      finish: "إنهاء",
      score: "النتيجة",
      question: "السؤال",
      of: "من",
      intro: "ابدأ الاختبار عندما تكون مستعدًا. حاول الإجابة بناءً على ما تعرفه — ثم اقرأ الشرح لتتعلم المزيد عن التاريخ المصري.",
      selectAnswer: "اختر إجابة للكشف عن الشرح.",
      correct: "✅ إجابة صحيحة!",
      incorrect: "❌ ليس تمامًا.",
      resultTitle: "أحسنت!",
      scored: "لقد حصلت على",
      outOf: "من أصل",
      msgExcellent: "ممتاز! لديك أساس قوي في التاريخ المصري.",
      msgGreat: "جهد رائع! راجع الملاحظات أدناه لتعمّق معرفتك.",
      msgNice: "بداية جيدة! اقرأ الشروحات أدناه وحاول مجددًا.",
      correctAnswer: "الإجابة الصحيحة:",
      restart: "العب مجددًا"
    },

    explorer: {
      title: "لعبة المستكشف",
      subtitle: "تحدي الاستكشاف قادم قريبًا.",
      placeholder: "أضف محتوى لعبة المستكشف هنا."
    },

    pyramid: {
      title: "بناء الهرم",
      subtitle: "ابنِ نصبك التذكاري الخاص بلوكة تلو بلوكة في بيئة مدمجة.",
      learnTitle: "تعلّم من خلال البناء",
      learnText: "تساعد لعبة بناء الهرم الأطفال على استكشاف التاريخ المصري من خلال اللعب العملي.",
      howToPlay: "كيفية اللعب",
      tip1: "انقر على <strong>ابدأ</strong> ثم انقر على اللعبة لتثبيت المؤشر.",
      tip2: "تحرك باستخدام <strong>WASD</strong>، وحلّق باستخدام <strong>Space</strong> و<strong>Shift</strong>.",
      tip3: "<strong>النقر الأيسر</strong> يضع بلوكة، و<strong>النقر الأيمن</strong> يزيلها.",
      tip4: "اختر المواد من شريط الأدوات.",
      startSubtitle: "بناء الهرم لعبة مثيرة حيث تبني أهرامات قديمة باستخدام مواد واستراتيجيات متنوعة.",
      start: "ابدأ",
      instructions: "انقر للعب. WASD للتحرك. 🖱️ النقر الأيسر: وضع | 🖱️ النقر الأيمن: إزالة",
      materials: "المواد"
    },

    hero: {
      museumName: "متحف الحياة الأخرى المصري",
      title: "اكتشف إرث مصر الخالد",
      subtitle: "استكشف الكنوز الملكية، وجولات افتراضية تفاعلية، ومعارض مختارة"
    },

    home: {
      spotlightKicker: "لمحة عن المتحف",
      spotlightTitle: "ادخل القاعات الكبرى",
      spotlightText: "شاهد لمحة سينمائية عن القاعات والقطع الأثرية والأجواء الذهبية التي تجعل كل زيارة لا تُنسى.",
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
      subtitle: "نُكرّم تراث مصر من خلال السرد التفاعلي، والبحث العلمي، والابتكار.",
      missionTitle: "الرسالة والهدف",
      missionText: "تتمثل رسالتنا في الحفاظ على التراث الثقافي المصري وتفسيره ومشاركته. نهدف إلى إلهام الفضول وتعميق الفهم التاريخي وربط الزوار بالأشخاص والمعتقدات والإنجازات التي شكّلت الحضارة.",
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
        foundationText: "تأسس المتحف لحماية التراث الأثري المصري وتعزيز التعليم العام",
        expansionTitle: "التوسع",
        expansionText: "توسعت القاعات لتشمل الحياة اليومية والمعتقدات والتقاليد الفنية",
        digitalTitle: "العصر الرقمي",
        digitalText: "إطلاق الجولات الافتراضية والأدلة الصوتية متعددة اللغات وإتاحة البحث المفتوح"
      },
      valuesTitle: "قيمنا",
      values: {
        preservationTitle: "الحفظ",
        preservationText: "حماية القطع الأثرية بأساليب علمية وأخلاقية",
        educationTitle: "التعليم",
        educationText: "تمكين المتعلمين من جميع الأعمار عبر القصص والتصميم",
        communityTitle: "المجتمع",
        communityText: "التعاون مع الحرفيين والباحثين والمؤسسات الثقافية",
        innovationTitle: "الابتكار",
        innovationText: "دمج التراث مع التكنولوجيا الحديثة لتعميق الفهم"
      },
      visitor: {
        title: "تجربة الزائر",
        text: "كل زيارة هي رحلة عبر الزمن. صُممت قاعاتنا لتغمرك في مصر القديمة كما لم تره من قبل.",
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
        text: "استكشف المعارض واحجز التذاكر وأنشئ برنامج زيارتك الخاص.",
        button: "ابدأ التخطيط"
      }
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

    exhibits: {
      allTitle: "المعارض",
      allSubtitle: "اكتشف قاعات الفراعنة والإسلامية والقبطية.",
      pharaohTitle: "مجموعة الفراعنة",
      pharaohSubtitle: "استكشف القطع الأثرية الملكية والمقدسات وكنوز الأسرات.",
      islamicTitle: "المجموعة الإسلامية",
      islamicSubtitle: "اكتشف التقاليد الفنية والمخطوطات والروائع المعمارية.",
      christianTitle: "المجموعة القبطية",
      christianSubtitle: "استكشف الأيقونات والمنسوجات والتراث من العصر القبطي."
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

    virtualTour: {
      title: "الجولة الافتراضية",
      subtitle: "استمتع بجولة إرشادية غامرة عبر قاعاتنا.",
      heroTitle: "تجربة المتحف الافتراضية",
      heroSubtitle: "انطلق في رحلة غامرة عبر مجموعاتنا من أي مكان في العالم. استكشف القطع الأثرية القديمة والكنوز التاريخية بتفاصيل مذهلة.",
      pharaohTitle: "جولة الفراعنة الافتراضية",
      pharaohIntro: "مرحبًا بك في جولة الفراعنة الافتراضية في متحف الحياة الأخرى! تتيح لك هذه الصفحة التفاعلية استكشاف عجائب مصر القديمة من أي مكان في العالم.",
      islamicTitle: "الجولة الافتراضية الإسلامية",
      islamicIntro: "مرحبًا بك في الجولة الافتراضية الإسلامية في متحف الحياة الأخرى! استكشف التقاليد الفنية الغنية والمخطوطات والروائع المعمارية للعالم الإسلامي من منزلك.",
      christianTitle: "الجولة الافتراضية القبطية",
      christianIntro: "مرحبًا بك في الجولة الافتراضية القبطية في متحف الحياة الأخرى! اكتشف الأيقونات والمنسوجات والتراث من العصر القبطي الغني في مصر.",
      audioGuide: "الدليل الصوتي",
      downloadBrochure: "تنزيل الكتيب",
      tourInfo: "معلومات الجولة",
      fullscreen: "ملء الشاشة",
      tourNotesTitle: "ملاحظات الجولة",
      tourNotesText: "تستخدم جولتنا الافتراضية تقنية متطورة لتوفير تجربة متحفية سلسة. تنقّل عبر معارضنا، وقرّب القطع الأثرية، وتعرّف على تاريخها.",
      islamicHeroSubtitle: "استكشف فن العمارة الإسلامية والكنوز التاريخية من خلال تجربة افتراضية إرشادية.",
      islamicWelcome: "مرحبًا",
      islamicTourNotesText: "للحصول على أفضل تجربة، استخدم سماعات الرأس واستكشف كل نقطة بانورامية.",
      christianHeroSubtitle: "استكشف الكنائس التاريخية والفن المقدس والتراث المسيحي.",
      christianWelcome: "مرحبًا",
      christianTourNotesText: "استخدم الدليل للتعرف على التاريخ المسيحي والفن والتأثير الثقافي."
    }
  }
};

const getTranslations = (lang) => translations[lang] || translations.en;

const makeT = (lang) => {
  return getTranslations(lang);
};

module.exports = { getTranslations, makeT };