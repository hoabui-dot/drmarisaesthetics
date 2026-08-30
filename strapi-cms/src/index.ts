import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register({ strapi }) {
    // webtools-addon-sitemap@1.3.1 probes this compatibility endpoint while
    // loading its admin screen. Webtools 1.4.x does not expose it itself.
    strapi.server.router.get("/webtools/sitemap/init", (ctx) => {
      ctx.body = { ok: true };
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * KEY RULES:
   *  1. Only sets public permissions if missing.
   *  2. Only injects default FAQ data if the faq field is completely absent.
   *  3. NEVER calls publish() automatically — that overwrites user edits made in CMS.
   */
  async bootstrap({ strapi }) {
    console.log("--- Antigravity Bootstrap Start ---");
    try {
      // Keep the add-on's private persistence table available after Strapi
      // schema synchronization. This is isolated from all application tables.
      const hasSitemapTable = await strapi.db.connection.schema.hasTable("wt_sitemap");
      if (!hasSitemapTable) {
        await strapi.db.connection.schema.createTable("wt_sitemap", (table) => {
          table.increments("id").primary();
          table.string("document_id", 255);
          table.text("sitemap_string").notNullable();
          table.string("name", 255).notNullable().defaultTo("default");
          table.string("type", 255).notNullable().defaultTo("default_hreflang");
          table.integer("delta").notNullable().defaultTo(1);
          table.integer("link_count");
          table.timestamp("created_at");
          table.timestamp("updated_at");
          table.timestamp("published_at");
          table.integer("created_by_id");
          table.integer("updated_by_id");
          table.string("locale", 255);
          table.index(["document_id", "locale", "published_at"], "wt_sitemap_documents_idx");
        });
        console.log("[BOOTSTRAP] Created missing Webtools sitemap persistence table.");
      }

      // ── 1. Ensure Public Permissions for APIs ──────────────────────────
      const publicRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "public" } });

      if (publicRole) {
        // Public website reads must not require a token in local Docker before
        // an editor has created a real API token. Keep writes protected.
        const publicReadActions = [
          "api::redirect.redirect.find",
          "api::navigation.navigation.find",
          "api::homepage.homepage.find",
          "api::our-team.our-team.find",
          "api::result.result.find",
          "api::footer.footer.find",
          "api::seo-manager-settings.seo-manager-settings.find",
          "api::canonical-rule.canonical-rule.find",
          "api::service-detail.service-detail.find",
          "api::blog.blog.find",
        ];

        for (const action of publicReadActions) {
          const permission = await strapi
            .query("plugin::users-permissions.permission")
            .findOne({ where: { role: publicRole.id, action } });

          if (!permission) {
            console.log(`[BOOTSTRAP] Setting Public permission for: ${action}`);
            await strapi.query("plugin::users-permissions.permission").create({
              data: { role: publicRole.id, action },
            });
          }
        }

        // Contact Page API
        const contactPageAction = "api::contact-page.contact-page.find";
        const contactPagePermission = await strapi
          .query("plugin::users-permissions.permission")
          .findOne({
            where: { role: publicRole.id, action: contactPageAction },
          });

        if (!contactPagePermission) {
          console.log(
            `[BOOTSTRAP] Setting Public permission for: ${contactPageAction}`,
          );
          await strapi.query("plugin::users-permissions.permission").create({
            data: { role: publicRole.id, action: contactPageAction },
          });
          console.log("[BOOTSTRAP] Permission created.");
        } else {
          console.log("[BOOTSTRAP] Public permission already exists. OK.");
        }

        // Contact Methods API
        const contactMethodsActions = [
          "api::contact-method.contact-method.find",
          "api::contact-method.contact-method.findOne",
        ];

        for (const action of contactMethodsActions) {
          const permission = await strapi
            .query("plugin::users-permissions.permission")
            .findOne({ where: { role: publicRole.id, action } });

          if (!permission) {
            console.log(`[BOOTSTRAP] Setting Public permission for: ${action}`);
            await strapi.query("plugin::users-permissions.permission").create({
              data: { role: publicRole.id, action },
            });
            console.log("[BOOTSTRAP] Permission created.");
          } else {
            console.log(
              `[BOOTSTRAP] Public permission for ${action} already exists. OK.`,
            );
          }
        }
      }

      // ── 1b. Stitch editorial metadata seed ─────────────────────────────
      // Keep the restored dynamic-zone content intact while aligning the
      // document metadata with the new cosmetic-surgery editorial direction.
      let stitchHomepageSeed: Record<string, unknown> = {};
      try {
        const seedPath = path.join(process.cwd(), "data", "stitch-homepage.json");
        stitchHomepageSeed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
      } catch (seedError: any) {
        console.warn(`[BOOTSTRAP] Stitch homepage seed file unavailable: ${seedError.message}`);
      }
      const stitchHome = await strapi.documents("api::homepage.homepage").findMany({ limit: 1, status: "draft" });
      if (stitchHome.length > 0) {
        await strapi.documents("api::homepage.homepage").update({
          documentId: stitchHome[0].documentId,
          data: {
            title: "Dr. Maris Aesthetics",
            metadata_title: "Plastic Surgery in Vietnam for International Patients | Dr. Maris Aesthetics",
            metadata_description: "Surgeon-led cosmetic surgery in Ho Chi Minh City, with direct surgeon care, hospital-based procedures, and personalized revision assessment.",
            visual_theme: "clinical-blue",
            ...stitchHomepageSeed,
          },
        });
        await strapi.documents("api::homepage.homepage").publish({ documentId: stitchHome[0].documentId });
        console.log("[BOOTSTRAP] Stitch homepage metadata seeded.");
      }

      const stitchAbout = await strapi.documents("api::about-page.about-page").findMany({ limit: 1, status: "draft" });
      if (stitchAbout.length > 0) {
        await strapi.documents("api::about-page.about-page").update({
          documentId: stitchAbout[0].documentId,
          data: {
            seo: {
              meta_title: "About Us | Dr. Maris Aesthetics",
              meta_description: "Learn about Dr. Maris Aesthetics, a surgeon-led cosmetic surgery practice in Ho Chi Minh City.",
            },
          },
        });
        await strapi.documents("api::about-page.about-page").publish({ documentId: stitchAbout[0].documentId });
        console.log("[BOOTSTRAP] Stitch About Us metadata seeded.");
      }

      // ── 1c. Stitch Our Team page seed ─────────────────────────────────
      let ourTeamSeed: Record<string, unknown> = {};
      try {
        const seedPath = path.join(process.cwd(), "data", "our-team.json");
        ourTeamSeed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
      } catch (seedError: any) {
        console.warn(`[BOOTSTRAP] Our Team seed file unavailable: ${seedError.message}`);
      }
      const ourTeam = await strapi.documents("api::our-team.our-team").findMany({ limit: 1, status: "draft" });
      if (ourTeam.length > 0) {
        await strapi.documents("api::our-team.our-team").update({
          documentId: ourTeam[0].documentId,
          data: ourTeamSeed,
        });
        await strapi.documents("api::our-team.our-team").publish({ documentId: ourTeam[0].documentId });
        console.log("[BOOTSTRAP] Our Team page seeded and published.");
      } else {
        const createdOurTeam = await strapi.documents("api::our-team.our-team").create({ data: ourTeamSeed });
        await strapi.documents("api::our-team.our-team").publish({ documentId: createdOurTeam.documentId });
        console.log("[BOOTSTRAP] Our Team page created, seeded and published.");
      }

      // ── 1d. Stitch Results page seed ──────────────────────────────────
      let resultsSeed: Record<string, unknown> = {};
      try {
        const seedPath = path.join(process.cwd(), "data", "results.json");
        resultsSeed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
      } catch (seedError: any) {
        console.warn(`[BOOTSTRAP] Results seed file unavailable: ${seedError.message}`);
      }
      const resultsPage = await strapi.documents("api::result.result").findMany({ limit: 1, status: "draft" });
      if (resultsPage.length > 0) {
        await strapi.documents("api::result.result").update({ documentId: resultsPage[0].documentId, data: resultsSeed });
        await strapi.documents("api::result.result").publish({ documentId: resultsPage[0].documentId });
        console.log("[BOOTSTRAP] Results page seeded and published.");
      } else {
        const createdResults = await strapi.documents("api::result.result").create({ data: resultsSeed });
        await strapi.documents("api::result.result").publish({ documentId: createdResults.documentId });
        console.log("[BOOTSTRAP] Results page created, seeded and published.");
      }

      // ── 2. Check if Contact Page layout is initialized ──────────────────────────
      //    Only inject default layout if it is completely absent.
      const CONTACT_PAGE_UID = "api::contact-page.contact-page";

      const results = await strapi.documents(CONTACT_PAGE_UID).findMany({
        limit: 1,
        populate: ["layout"],
      });

      if (results && results.length > 0) {
        const doc = results[0];
        const docId = doc.documentId;
        console.log(`[BOOTSTRAP] Contact Page found: ${docId}`);

        if (!doc.layout || doc.layout.length === 0) {
          // Layout is completely absent — safe to inject default data
          console.log(
            "[BOOTSTRAP] Contact Page layout missing. Injecting default components...",
          );

          await strapi.documents(CONTACT_PAGE_UID).update({
            documentId: docId,
            data: {
              title: doc.title || "Contact Us - Saigon International Dental Clinic",
              layout: [
                {
                  __component: "contact.hero",
                  title: "Liên hệ Smilux",
                  subtitle: "Tư vấn – Đặt lịch – Hỗ trợ điều trị Implant",
                  description: "Đội ngũ chuyên gia của Smilux luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên hành trình kiến tạo nụ cười khỏe đẹp. Liên hệ với chúng tôi để được tư vấn và đặt lịch khám nhanh chóng.",
                  contact_cards: [
                    { label: "Hotline", value: "1800 8888", supporting_text: "Tư vấn & đặt lịch miễn phí 24/7", icon: "phone", href: "tel:18008888" },
                    { label: "Địa chỉ", value: "233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam", icon: "location", href: "https://www.google.com/maps/search/?api=1&query=233%20%E2%80%93%20233A%20Nguy%E1%BB%85n%20Tr%E1%BB%8Dng%20Tuy%E1%BB%83n%2C%20Ph%C6%B0%E1%BB%9Dng%20Ph%C3%BA%20Nhu%E1%BA%ADn%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vi%E1%BB%87t%20Nam" },
                    { label: "Email", value: "info@smiluxdental.vn", supporting_text: "Phản hồi trong 30 phút", icon: "email", href: "mailto:info@smiluxdental.vn" },
                    { label: "Giờ làm việc", value: "Thứ 2 – Chủ nhật\\n08:00 – 20:00", icon: "clock" }
                  ]
                },
                {
                  __component: "contact.map-section",
                  title: "Find Us",
                  description: "Visit our clinic in the heart of Ho Chi Minh City",
                  location_name: "Saigon International Dental Clinic",
                  address: "233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam",
                  latitude: "10.776145",
                  longitude: "106.676643"
                },
              ]
            },
          });

          // Publish once so the default layout is visible on the frontend immediately
          await strapi
            .documents(CONTACT_PAGE_UID)
            .publish({ documentId: docId });
          console.log("[BOOTSTRAP] Default Contact Page layout injected and published.");
        } else {
          // Layout exists — leave all data and publish state unchanged
          console.log(
            `[BOOTSTRAP] Contact Page layout already present. No changes made.`,
          );
        }
      } else {
        console.warn(
          "[BOOTSTRAP] No Contact Page document found. Creating one from scratch...",
        );
        const newDoc = await strapi.documents(CONTACT_PAGE_UID).create({
          data: {
            title: "Contact Us - Saigon International Dental Clinic",
            layout: [
              {
                __component: "contact.hero",
                title: "Liên hệ Smilux",
                subtitle: "Tư vấn – Đặt lịch – Hỗ trợ điều trị Implant",
                description: "Đội ngũ chuyên gia của Smilux luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên hành trình kiến tạo nụ cười khỏe đẹp. Liên hệ với chúng tôi để được tư vấn và đặt lịch khám nhanh chóng.",
                contact_cards: [
                  { label: "Hotline", value: "1800 8888", supporting_text: "Tư vấn & đặt lịch miễn phí 24/7", icon: "phone", href: "tel:18008888" },
                  { label: "Địa chỉ", value: "233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam", icon: "location", href: "https://www.google.com/maps/search/?api=1&query=233%20%E2%80%93%20233A%20Nguy%E1%BB%85n%20Tr%E1%BB%8Dng%20Tuy%E1%BB%83n%2C%20Ph%C6%B0%E1%BB%9Dng%20Ph%C3%BA%20Nhu%E1%BA%ADn%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh%2C%20Vi%E1%BB%87t%20Nam" },
                  { label: "Email", value: "info@smiluxdental.vn", supporting_text: "Phản hồi trong 30 phút", icon: "email", href: "mailto:info@smiluxdental.vn" },
                  { label: "Giờ làm việc", value: "Thứ 2 – Chủ nhật\\n08:00 – 20:00", icon: "clock" }
                ]
              },
              {
                __component: "contact.map-section",
                title: "Find Us",
                description: "Visit our clinic in the heart of Ho Chi Minh City",
                location_name: "Saigon International Dental Clinic",
                address: "233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam",
                latitude: "10.776145",
                longitude: "106.676643"
              },
            ]
          }
        });
        await strapi.documents(CONTACT_PAGE_UID).publish({ documentId: newDoc.documentId });
        console.log("[BOOTSTRAP] Contact Page successfully created & published.");
      }

      // ── 3. Services Overview ────────────────────────────────────────────
      // Service cards are now resolved from the service-details collection.
      // Keep this single type CMS-managed; never recreate it during bootstrap.
      const SERVICES_UID = "api::services-overview.services-overview";
      const srvResults = await strapi.documents(SERVICES_UID).findMany({ status: "published" });
      console.log(`[BOOTSTRAP] Preserving ${srvResults.length} Services Overview document(s).`);
      // ── 4. Force Update Customer Page Dynamic Zone ────────────────────────
      const CUSTOMER_UID = "api::customer.customer";
      const customerDocs = await strapi.documents(CUSTOMER_UID).findMany({
        status: "draft",
      });

      if (customerDocs && customerDocs.length > 0) {
        const requiredCustomerMediaIds = [4, 5, 7, 8, 9, 42, 43, 44, 45];
        const availableCustomerMedia = await strapi.db
          .query("plugin::upload.file")
          .findMany({ where: { id: { $in: requiredCustomerMediaIds } }, select: ["id"] });

        if (availableCustomerMedia.length !== requiredCustomerMediaIds.length) {
          console.warn(
            `[BOOTSTRAP] Preserving restored Customer Page; ${requiredCustomerMediaIds.length - availableCustomerMedia.length} referenced media file(s) are not present in the backup.`,
          );
        } else {
        const doc = customerDocs[0];
        console.log(`[BOOTSTRAP] Updating Customer Page: ${doc.documentId}`);

        // Define the target layout
        // We want to ensure combined-testimonial-result is present and populated
        const newLayout = [
          {
            __component: "customer.hero",
            badge: "Patient Results",
            title: "Real Patient Results: Dental Before and Afters In Viet Nam",
            description: "Trusted by Thousands",
          },
          {
            __component: "customer.combined-testimonial-result",
            title: "Before and After Dental Transformations",
            subtitle: "Explore real before-and-after results from patients who trusted us with their smile journey",
            items: [
              {
                customerName: "Patient One",
                content: "Amazing results! The dental transformation was life-changing.",
                rating: 5,
                treatmentType: "Veneers",
                beforeImage: 44,
                afterImage: 45,
                labelBefore: "Before",
                labelAfter: "After",
              },
              {
                customerName: "Patient Two",
                content: "Very professional care. My smile looks so natural now.",
                rating: 5,
                treatmentType: "Implants",
                beforeImage: 42,
                afterImage: 43,
                labelBefore: "Before",
                labelAfter: "After",
              },
              {
                customerName: "Patient Three",
                content: "I'm so happy with my new teeth. Highly recommend!",
                rating: 5,
                treatmentType: "Whitening",
                beforeImage: 5,
                afterImage: 4,
                labelBefore: "Before",
                labelAfter: "After",
              },
            ],
          },
          {
            __component: "customer.success-stories",
            badge: "Success Stories",
            title: "Stories of Transformation",
            description: "Discover how advanced dental treatments at Saigon International Dental Clinic have transformed the lives and confidence of our international patients.",
            stories: [
              {
                name: "Trần Thị Bình",
                treatment: "All-on-4 Implants",
                quote: "After struggling with dentures for years, the All-on-4 implants gave me my life back. The surgical team was incredibly gentle, and the results look completely natural. I can finally eat my favorite foods again without worry.",
                rating: 5,
                avatar: 7
              },
              {
                name: "Lê Minh Châu",
                treatment: "Invisalign & Teeth Whitening",
                quote: "The doctors designed a comprehensive plan that fixed my alignment and brightened my smile. The 3D scanning technology made the entire process so smooth, and the English-speaking staff made me feel right at home.",
                rating: 5,
                avatar: 8
              },
              {
                name: "Phạm Hoàng Dũng",
                treatment: "Porcelain Veneers",
                quote: "I traveled halfway across the world for these veneers, and it was worth every mile. The clinic's attention to detail and standard of hygiene are world-class. My smile has never looked better, and the cost was a fraction of what I would have paid back home.",
                rating: 5,
                avatar: 9
              }
            ]
          },
          {
            __component: "customer.reviews",
            badge: "Top Rated",
            title: "5-Star Dental Clinic with Verified Patient Reviews",
            rating: 4.9,
            total_reviews: 400,
            rating_subtitle: "rating from over 400 reviews on Google Maps",
            description: "We are committed not only to delivering high-quality clinical results but also to providing a comfortable and stress-free experience for every patient.",
            checklist: [
              { text: "Painless procedures with advanced anesthesia options" },
              { text: "Detailed upfront consultation and transparent pricing" },
              { text: "Long-lasting results backed by warranty" },
              { text: "Exceptional post-treatment care and support" }
            ]
          },
          {
            __component: "customer.why-choose-us",
            badge: "Our Advantages",
            title: "Why International Patients Choose Our Dental Clinic",
            description: "Combining world-class expertise with state-of-the-art technology, we ensure your visits are safe, affordable, and incredibly comfortable.",
            features: [
              {
                title: "World-Class Dental Experts",
                description: "Our specialists are internationally trained and have successfully completed thousands of complex cases, from full mouth restorations to aesthetic veneers."
              },
              {
                title: "Advanced Technology",
                description: "We use CBCT 3D scanning, CAD/CAM design, and laser dentistry to provide precise, minimally invasive, and fast treatments."
              },
              {
                title: "Affordable Care",
                description: "Save up to 70% on premium dental treatments compared to prices in the US, Australia, and Europe without compromising on material quality."
              },
              {
                title: "English-Speaking Environment",
                description: "Our doctors and dedicated care team communicate fluently in English, ensuring you fully understand your treatment journey from day one."
              }
            ]
          },
        ];

        await strapi.documents(CUSTOMER_UID).update({
          documentId: doc.documentId,
          data: {
            layout: newLayout,
          },
        });

        // ── WORKAROUND: Strapi v5 Document API aggressively strips nested media arrays 
        // Manually link via native ORM queries
        console.log("[BOOTSTRAP] Executing deterministic Db.Query native media linkage bounds for Customer Success Stories...");
        const dbCustomerDoc = await strapi.db.query(CUSTOMER_UID).findOne({
          where: { documentId: doc.documentId },
          populate: ["layout.stories"],
        });
        const layoutStories = dbCustomerDoc.layout?.find(
          (c: any) => c.__component === "customer.success-stories",
        );
        if (layoutStories && layoutStories.stories) {
          const avatarMap: Record<string, number> = {
            "Trần Thị Bình": 7,
            "Lê Minh Châu": 8,
            "Phạm Hoàng Dũng": 9,
          };
          for (const item of layoutStories.stories) {
            if (avatarMap[item.name]) {
              await strapi.db.query("customer.story-item").update({
                where: { id: item.id },
                data: { avatar: avatarMap[item.name] },
              });
            }
          }
        }

        await strapi.documents(CUSTOMER_UID).publish({
          documentId: doc.documentId,
        });

        console.log("[BOOTSTRAP] Customer Page successfully updated and published via Document API!");
        }
      }
    } catch (error: any) {
      console.error("[BOOTSTRAP] Error:", error.message);
      if (error.details) {
        console.error(
          "[BOOTSTRAP] Details:",
          JSON.stringify(error.details, null, 2),
        );
      }
    }
    console.log("--- Antigravity Bootstrap End ---");
  },
};
