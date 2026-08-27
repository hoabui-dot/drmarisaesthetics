const strapi = require('@strapi/strapi');
const path = require('path');

async function run() {
  console.log('Booting Strapi context...');
  const app = strapi({ distDir: path.join(__dirname, '../strapi-cms/dist'), dir: path.join(__dirname, '../strapi-cms') });
  await app.load();
  await app.start();

  try {
    console.log('Fetching contact page...');
    const page = await app.documents('api::contact-page.contact-page').findFirst({ populate: '*' });
    console.log('Found page documentId:', page.documentId);

    // Update to touch it, triggering component sync
    await app.documents('api::contact-page.contact-page').update({
      documentId: page.documentId,
      data: {
        contact_info: {
          title: "Contact Our Dental Clinic in Ho Chi Minh City",
          subtitle: "Sai Gon International Dental Clinic – Leading Reputable Excellence.",
          tiles: [
            {
              __component: 'contact.contact-info-tile',
              type: 'website',
              title: "Visit Our Website",
              value: "nhakhoaquoctesg.vn",
              cta_link: "https://nhakhoaquoctesg.vn"
            },
            {
              __component: 'contact.contact-info-tile',
              type: 'phone',
              title: "24/7 Hotline",
              value: "0903 123 456",
              value_secondary: "0909 456 789"
            },
            {
              __component: 'contact.contact-info-tile',
              type: 'address',
              title: "Heritage Address",
              value: "233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam",
              cta_label: "Open in Google Maps",
              cta_link: "https://www.google.com/maps/search/?api=1&query=233%20%E2%80%93%20233A%20Nguy%E1%BB%85n%20Tr%E1%BB%8Dng%20Tuy%E1%BB%83n%2C%20Ph%C6%B0%E1%BB%9Dng%20Ph%C3%BA%20Nhu%E1%BA%ADn%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vi%E1%BB%87t%20Nam"
            },
            {
              __component: 'contact.contact-info-tile',
              type: 'hours',
              title: "Operating Hours",
              value: "Mon – Sat: 8:00 AM – 7:00 PM\nSunday: 8:00 AM – 5:00 PM"
            }
          ]
        }
      },
      status: 'published'
    });
    
    console.log('Successfully updated contact page via Strapi Document API!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
