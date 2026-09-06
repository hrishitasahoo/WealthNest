const APP_NAV_LINKS = [
  { href: 'dashboard.html', label: 'Dashboard', key: 'dashboard' },
  { href: 'expenses.html', label: 'Expenses', key: 'expenses' },
  { href: 'budget.html', label: 'Budget', key: 'budget' },
  { href: 'goals.html', label: 'Goals', key: 'goals' },
  { href: 'savings.html', label: 'Savings', key: 'savings' },
  { href: 'tools.html', label: 'Financial Tools', key: 'tools' },
  { href: 'learn.html', label: 'Learn', key: 'learn' },
  { href: 'schemes.html', label: 'Schemes', key: 'schemes' },
  { href: 'settings.html', label: 'Settings', key: 'settings' }
];

const WN_LANG_KEY = 'wn_language';

const WN_TRANSLATIONS = {
  en: {
    'index.html': 'Home', 'index.html#features': 'Features', 'learn.html': 'Learn',
    'dashboard.html': 'Dashboard', 'expenses.html': 'Expenses', 'budget.html': 'Budget',
    'goals.html': 'Goals', 'savings.html': 'Savings', 'tools.html': 'Financial Tools',
    'schemes.html': 'Schemes', 'settings.html': 'Settings', 'login.html': 'Login',
    'register.html': 'Get Started', 'logout': 'Log Out',
    heroTitle: 'Secure Your Present. Plan Your Future.',
    heroSub: 'WealthNest makes personal finance simple — helping you save, plan your goals, understand financial products and make better financial decisions.',
    getStarted: 'Get Started', startLearning: 'Start Learning'
  },
  hi: {
    'index.html': 'होम', 'index.html#features': 'विशेषताएं', 'learn.html': 'सीखें',
    'dashboard.html': 'डैशबोर्ड', 'expenses.html': 'खर्च', 'budget.html': 'बजट',
    'goals.html': 'लक्ष्य', 'savings.html': 'बचत', 'tools.html': 'वित्तीय उपकरण',
    'schemes.html': 'सरकारी योजनाएं', 'settings.html': 'सेटिंग्स', 'login.html': 'लॉगिन',
    'register.html': 'शुरू करें', 'logout': 'लॉग आउट',
    heroTitle: 'अपने वर्तमान को सुरक्षित करें। अपने भविष्य की योजना बनाएं।',
    heroSub: 'वेल्थनेस्ट व्यक्तिगत वित्त को सरल बनाता है — बचत करने, लक्ष्यों की योजना बनाने और बेहतर वित्तीय निर्णय लेने में आपकी मदद करता है।',
    getStarted: 'शुरू करें', startLearning: 'सीखना शुरू करें'
  },
  bn: {
    'index.html': 'হোম', 'index.html#features': 'বৈশিষ্ট্য', 'learn.html': 'শিখুন',
    'dashboard.html': 'ড্যাশবোর্ড', 'expenses.html': 'খরচ', 'budget.html': 'বাজেট',
    'goals.html': 'লক্ষ্য', 'savings.html': 'সঞ্চয়', 'tools.html': 'আর্থিক সরঞ্জাম',
    'schemes.html': 'সরকারি প্রকল্প', 'settings.html': 'সেটিংস', 'login.html': 'লগইন',
    'register.html': 'শুরু করুন', 'logout': 'লগ আউট',
    heroTitle: 'আপনার বর্তমানকে সুরক্ষিত করুন। আপনার ভবিষ্যতের পরিকল্পনা করুন।',
    heroSub: 'ওয়েলথনেস্ট ব্যক্তিগত অর্থব্যবস্থাকে সহজ করে তোলে — সঞ্চয় করতে, লক্ষ্য পরিকল্পনা করতে এবং আরও ভালো সিদ্ধান্ত নিতে সাহায্য করে।',
    getStarted: 'শুরু করুন', startLearning: 'শেখা শুরু করুন'
  },
  mr: {
    'index.html': 'मुख्यपृष्ठ', 'index.html#features': 'वैशिष्ट्ये', 'learn.html': 'शिका',
    'dashboard.html': 'डॅशबोर्ड', 'expenses.html': 'खर्च', 'budget.html': 'बजेट',
    'goals.html': 'उद्दिष्टे', 'savings.html': 'बचत', 'tools.html': 'आर्थिक साधने',
    'schemes.html': 'सरकारी योजना', 'settings.html': 'सेटिंग्ज', 'login.html': 'लॉगिन',
    'register.html': 'सुरू करा', 'logout': 'लॉग आउट',
    heroTitle: 'तुमचा वर्तमान सुरक्षित करा. तुमच्या भविष्याचे नियोजन करा.',
    heroSub: 'वेल्थनेस्ट वैयक्तिक आर्थिक व्यवस्थापन सोपे करते — बचत करण्यास आणि तुमच्या ध्येयांचे नियोजन करण्यास मदत करते.',
    getStarted: 'सुरू करा', startLearning: 'शिकणे सुरू करा'
  },
  ta: {
    'index.html': 'முகப்பு', 'index.html#features': 'அம்சங்கள்', 'learn.html': 'கற்றுக்கொள்ளுங்கள்',
    'dashboard.html': 'டாஷ்போர்டு', 'expenses.html': 'செலவுகள்', 'budget.html': 'பட்ஜெட்',
    'goals.html': 'இலக்குகள்', 'savings.html': 'சேமிப்பு', 'tools.html': 'நிதி கருவிகள்',
    'schemes.html': 'அரசு திட்டங்கள்', 'settings.html': 'அமைப்புகள்', 'login.html': 'உள்நுழைவு',
    'register.html': 'தொடங்குங்கள்', 'logout': 'வெளியேறு',
    heroTitle: 'உங்கள் நிகழ்காலத்தை பாதுகாக்கவும். உங்கள் எதிர்காலத்தைத் திட்டமிடுங்கள்.',
    heroSub: 'வெல்த்நெஸ்ட் தனிநபர் நிதியை எளிதாக்குகிறது — சேமிக்கவும், இலக்குகளைத் திட்டமிடவும் உதவுகிறது.',
    getStarted: 'தொடங்குங்கள்', startLearning: 'கற்க தொடங்குங்கள்'
  },
  te: {
    'index.html': 'హోమ్', 'index.html#features': 'లక్షణాలు', 'learn.html': 'నేర్చుకోండి',
    'dashboard.html': 'డాష్‌బోర్డ్', 'expenses.html': 'ఖర్చులు', 'budget.html': 'బడ్జెట్',
    'goals.html': 'లక్ష్యాలు', 'savings.html': 'పొదుపు', 'tools.html': 'ఆర్థిక సాధనాలు',
    'schemes.html': 'ప్రభుత్వ పథకాలు', 'settings.html': 'సెట్టింగ్‌లు', 'login.html': 'లాగిన్',
    'register.html': 'ప్రారంభించండి', 'logout': 'లాగ్ అవుట్',
    heroTitle: 'మీ వర్తమానాన్ని సురక్షితం చేసుకోండి. మీ భవిష్యత్తును ప్లాన్ చేసుకోండి.',
    heroSub: 'వెల్త్‌నెస్ట్ వ్యక్తిగత ఆర్థిక వ్యవహారాలను సులభతరం చేస్తుంది — పొదుపు చేయడానికి, లక్ష్యాలను ప్లాన్ చేయడానికి సహాయపడుతుంది.',
    getStarted: 'ప్రారంభించండి', startLearning: 'నేర్చుకోవడం ప్రారంభించండి'
  }
};

const WN_LANG_NAMES = { en: 'English', hi: 'हिन्दी', bn: 'বাংলা', mr: 'मराठी', ta: 'தமிழ்', te: 'తెలుగు' };

function wnGetLang() {
  return localStorage.getItem(WN_LANG_KEY) || 'en';
}

function wnApplyTranslations(lang) {
  const dict = WN_TRANSLATIONS[lang] || WN_TRANSLATIONS.en;

  document.querySelectorAll('.main-nav a, .sidebar-nav a, .header-actions a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && dict[href] && !link.querySelector('*')) {
      link.textContent = dict[href];
    }
  });

  document.querySelectorAll('[data-logout]').forEach(el => {
    if (dict.logout) el.textContent = dict.logout;
  });

  const heroTitle = document.querySelector('.hero h1');
  const heroSub = document.querySelector('.hero-sub');
  if (heroTitle && dict.heroTitle) heroTitle.textContent = dict.heroTitle;
  if (heroSub && dict.heroSub) heroSub.textContent = dict.heroSub;

  document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : lang);
}

function wnInjectLanguageSwitcher() {
  return;
}

window.wnInjectLanguageSwitcher = wnInjectLanguageSwitcher;
window.wnApplyTranslations = wnApplyTranslations;
window.wnGetLang = wnGetLang;

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.split('/').pop() === currentPage) {
      link.classList.add('active');
    }
  });

  const navLinksSlot = document.querySelector('[data-nav-links]');
  const headerUserSlot = document.querySelector('[data-header-user]');

  if ((navLinksSlot || headerUserSlot) && window.WN) {
    WN.api.get('/auth/me', { silent: true })
      .then(res => {
        const user = res.data.user;

        if (headerUserSlot) {
          headerUserSlot.innerHTML = `
            <a href="dashboard.html" class="btn btn-secondary">Dashboard</a>
            <div class="user-avatar" title="${WN.escapeHTML(user.full_name)}">${WN.escapeHTML(user.full_name.charAt(0).toUpperCase())}</div>
          `;
        }

        if (navLinksSlot) {
          const currentKey = navLinksSlot.dataset.navLinks;
          navLinksSlot.innerHTML = APP_NAV_LINKS.map(link =>
            `<a href="${link.href}"${link.key === currentKey ? ' class="active"' : ''}>${link.label}</a>`
          ).join('');
        }

        wnApplyTranslations(wnGetLang());
      })
      .catch(() => {
        if (headerUserSlot) {
          headerUserSlot.innerHTML = `
            <a href="login.html" class="btn btn-secondary">Login</a>
            <a href="register.html" class="btn btn-primary">Get Started</a>
          `;
        }
        wnApplyTranslations(wnGetLang());
      });
  } else {
    wnApplyTranslations(wnGetLang());
  }

  wnInjectLanguageSwitcher();

  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await WN.api.post('/auth/logout');
      } catch (err) { /* proceed regardless */ }
      window.location.href = '/index.html';
    });
  });
});
