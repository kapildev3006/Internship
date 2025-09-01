import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        form: 'Apply',
        recommendations: 'Recommendations',
        admin: 'Admin'
      },
      home: {
        title: 'Find Your Perfect Internship',
        subtitle: 'AI-powered recommendations tailored to your skills and interests',
        getStarted: 'Get Started',
        features: {
          smart: 'Smart Matching',
          smartDesc: 'AI algorithms match you with the best opportunities',
          diverse: 'Diverse Sectors',
          diverseDesc: 'Internships across IT, Finance, Healthcare, and more',
          support: '24/7 Support',
          supportDesc: 'Get help whenever you need it'
        }
      },
      form: {
        title: 'Tell Us About Yourself',
        name: 'Full Name',
        education: 'Education Level',
        skills: 'Skills',
        interests: 'Sector Interests',
        location: 'Preferred Location',
        submit: 'Find Internships',
        step: 'Step {{current}} of {{total}}'
      },
      recommendations: {
        title: 'Recommended Internships',
        noResults: 'No internships found matching your criteria',
        apply: 'Apply Now',
        stipend: 'Stipend',
        capacity: 'Positions',
        location: 'Location'
      },
      admin: {
        title: 'Admin Dashboard',
        addNew: 'Add New Internship',
        filter: 'Filter by Department',
        all: 'All Departments',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: 'होम',
        form: 'आवेदन',
        recommendations: 'सिफारिशें',
        admin: 'एडमिन'
      },
      home: {
        title: 'अपनी परफेक्ट इंटर्नशिप खोजें',
        subtitle: 'आपके कौशल और रुचियों के अनुकूल AI-संचालित सिफारिशें',
        getStarted: 'शुरू करें',
        features: {
          smart: 'स्मार्ट मैचिंग',
          smartDesc: 'AI एल्गोरिदम आपको सबसे अच्छे अवसरों से मिलाते हैं',
          diverse: 'विविध क्षेत्र',
          diverseDesc: 'IT, वित्त, स्वास्थ्य सेवा और अन्य में इंटर्नशिप',
          support: '24/7 सहायता',
          supportDesc: 'जब भी आपको जरूरत हो सहायता प्राप्त करें'
        }
      },
      form: {
        title: 'अपने बारे में बताएं',
        name: 'पूरा नाम',
        education: 'शिक्षा स्तर',
        skills: 'कौशल',
        interests: 'क्षेत्रीय रुचियां',
        location: 'पसंदीदा स्थान',
        submit: 'इंटर्नशिप खोजें',
        step: 'चरण {{current}} का {{total}}'
      },
      recommendations: {
        title: 'सुझाई गई इंटर्नशिप',
        noResults: 'आपके मानदंडों से मेल खाने वाली कोई इंटर्नशिप नहीं मिली',
        apply: 'अभी आवेदन करें',
        stipend: 'वेतन',
        capacity: 'पद',
        location: 'स्थान'
      },
      admin: {
        title: 'एडमिन डैशबोर्ड',
        addNew: 'नई इंटर्नशिप जोड़ें',
        filter: 'विभाग के अनुसार फ़िल्टर करें',
        all: 'सभी विभाग',
        edit: 'संपादित करें',
        delete: 'हटाएं',
        save: 'सेव करें',
        cancel: 'रद्द करें'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;