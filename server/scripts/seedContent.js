require('dotenv').config();
const { connectDb } = require('../db');
const ContentBlock = require('../models/ContentBlock');

// All the hardcoded content from the website pages
const SEED_DATA = {
  home: [
    { key: 'hero_title', value: 'Welcome to DiasporaNRI' },
    { key: 'hero_subtitle', value: 'Your trusted platform for NRI services and support' },
    { key: 'hero_body', value: 'DiasporaNRI.com is your trusted platform providing comprehensive support services for NRIs and global Indians. Manage your property, legal matters, banking, investments, family support, and more with professional assistance and peace of mind.' },
    { key: 'cta_primary', value: 'Get Started' },
    { key: 'cta_secondary', value: 'Learn More' },
    { key: 'features_title', value: 'Why Choose Us' },
    { key: 'feature_1_title', value: 'Professional Expertise' },
    { key: 'feature_1_desc', value: 'Access to verified professionals and experts in various fields' },
    { key: 'feature_2_title', value: 'Secure & Transparent' },
    { key: 'feature_2_desc', value: 'Complete transparency with secure, encrypted transactions' },
    { key: 'feature_3_title', value: '24/7 Support' },
    { key: 'feature_3_desc', value: 'Round-the-clock support across multiple time zones' },
    { key: 'testimonials_title', value: 'What Our Clients Say' },
    { key: 'testimonial_1_name', value: 'Rajesh Kumar' },
    { key: 'testimonial_1_text', value: 'DiasporaNRI made managing my property so easy despite being overseas. Highly recommended!' },
    { key: 'testimonial_2_name', value: 'Priya Singh' },
    { key: 'testimonial_2_text', value: 'The legal support team resolved my case efficiently. Great service!' }
  ],
  about: [
    { key: 'about_title', value: 'About DiasporaNRI' },
    { key: 'about_subtitle', value: 'Connecting NRIs with their homeland through trusted professional support.' },
    { key: 'mission_title', value: 'Our Mission' },
    { key: 'mission_p1', value: 'To deliver trustworthy, transparent, and professional support services that help NRIs and overseas Indians stay confidently connected with their homeland.' },
    { key: 'mission_p2', value: 'We bridge the gap between overseas Indians and their native country by offering dependable coordination, verified assistance, and professional guidance.' },
    { key: 'vision_title', value: 'Our Vision' },
    { key: 'vision_p1', value: 'To create a trusted global bridge between NRIs and their motherland by delivering reliable assistance, emotional connection, and professional support under one unified platform.' },
    { key: 'vision_p2', value: 'No matter where you live in the world, your connection to your homeland should always remain strong, secure, and supported.' },
    { key: 'who_title', value: 'Who We Are' },
    { key: 'who_body', value: 'DiasporaNRI is a dedicated platform serving the global Indian community with integrity, professionalism, and cultural sensitivity.' },
    { key: 'values_title', value: 'Our Core Values' },
    { key: 'value_1_title', value: 'Integrity' },
    { key: 'value_1_desc', value: 'We conduct business with honesty and transparency' },
    { key: 'value_2_title', value: 'Excellence' },
    { key: 'value_2_desc', value: 'We strive for the highest quality in everything we do' },
    { key: 'value_3_title', value: 'Reliability' },
    { key: 'value_3_desc', value: 'Our clients can depend on us for consistent, dependable service' }
  ],
  services: [
    { key: 'services_title', value: 'Our Services' },
    { key: 'services_subtitle', value: 'Comprehensive solutions for your needs' },
    { key: 'services_intro', value: 'We offer a wide range of professional services tailored to meet the unique needs of NRIs' },
    { key: 'service_property_title', value: 'Property Management' },
    { key: 'service_property_desc', value: 'Comprehensive property management services including rentals, sales, maintenance, and legal documentation' },
    { key: 'service_legal_title', value: 'Legal Support' },
    { key: 'service_legal_desc', value: 'Expert legal assistance for property disputes, inheritance, tax matters, and NRI-specific legal issues' },
    { key: 'service_finance_title', value: 'Financial Planning' },
    { key: 'service_finance_desc', value: 'Professional financial advisory for investments, savings, insurance, and wealth management' },
    { key: 'service_banking_title', value: 'Banking Solutions' },
    { key: 'service_banking_desc', value: 'Assistance with NRE accounts, investments, and foreign exchange transactions' },
    { key: 'service_family_title', value: 'Family Support' },
    { key: 'service_family_desc', value: 'Domestic help coordination, elder care, and family event management' },
    { key: 'service_business_title', value: 'Business Consultancy' },
    { key: 'service_business_desc', value: 'Guidance for business setup, partnerships, and corporate matters' }
  ],
  associates: [
    { key: 'associates_title', value: 'Our Associates' },
    { key: 'associates_subtitle', value: 'Trusted partners in your success' },
    { key: 'associates_description', value: 'Network of verified, experienced, and dedicated professional associates across India and globally' },
    { key: 'associates_intro', value: 'Our carefully selected network of associates brings expertise, reliability, and cultural understanding to serve you better' }
  ],
  investment: [
    { key: 'investment_title', value: 'Investment Opportunities' },
    { key: 'investment_subtitle', value: 'Grow your wealth with us' },
    { key: 'investment_intro', value: 'Explore diverse investment opportunities tailored for NRIs' },
    { key: 'investment_1_title', value: 'Real Estate Investments' },
    { key: 'investment_1_desc', value: 'Secure real estate opportunities with high returns and complete transparency' },
    { key: 'investment_2_title', value: 'Stock Market' },
    { key: 'investment_2_desc', value: 'Portfolio management and stock investment guidance from expert advisors' },
    { key: 'investment_3_title', value: 'Mutual Funds' },
    { key: 'investment_3_desc', value: 'Diversified mutual fund options with professional management' },
    { key: 'investment_4_title', value: 'Business Ventures' },
    { key: 'investment_4_desc', value: 'Partnership opportunities in established and growing businesses' }
  ],
  achievements: [
    { key: 'achievements_title', value: 'Our Achievements' },
    { key: 'achievements_subtitle', value: 'Milestones that define our journey' },
    { key: 'achievements_empty_title', value: 'Coming Soon' },
    { key: 'achievements_empty_body', value: 'Our achievements and milestones will be showcased here' }
  ],
  media: [
    { key: 'media_title', value: 'Media Gallery' },
    { key: 'media_subtitle', value: 'Visual stories from our community' },
    { key: 'media_intro', value: 'Browse our collection of photos and videos from events, client stories, and community highlights' },
    { key: 'media_empty_title', value: 'Gallery Coming Soon' },
    { key: 'media_empty_body', value: 'Photos and videos will be showcased here' }
  ],
  contact: [
    { key: 'contact_title', value: 'Get In Touch' },
    { key: 'contact_subtitle', value: "We'd love to hear from you. Send us a message!" },
    { key: 'contact_info_title', value: 'Contact Information' },
    { key: 'contact_hq_title', value: 'Headquarters' },
    { key: 'contact_hq_details', value: 'Pan-India Office Network with Global Reach' },
    { key: 'contact_phone_title', value: 'Phone' },
    { key: 'contact_phone_details', value: '+91-XXXX-XXXX-XXXX, Toll Free Support' },
    { key: 'contact_email_title', value: 'Email' },
    { key: 'contact_email_details', value: 'support@diasporanri.com, info@diasporanri.com' },
    { key: 'contact_website_title', value: 'Website' },
    { key: 'contact_website_details', value: 'www.diasporanri.com, 24/7 Online Support' }
  ]
};

async function seedContent() {
  try {
    await connectDb();
    console.log('✅ Connected to MongoDB\n');

    let totalSeeded = 0;

    for (const [page, blocks] of Object.entries(SEED_DATA)) {
      console.log(`Seeding ${page} page...`);
      
      for (const block of blocks) {
        const existing = await ContentBlock.findOne({ page, key: block.key });
        
        if (existing) {
          console.log(`  ⏭️  Skipped ${block.key} (already exists)`);
        } else {
          await ContentBlock.create({
            page,
            key: block.key,
            value: block.value,
            valueType: 'text'
          });
          console.log(`  ✓ Created ${block.key}`);
          totalSeeded++;
        }
      }
    }

    console.log(`\n✅ Seeding complete! ${totalSeeded} new content blocks created.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedContent();
