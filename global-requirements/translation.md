hiện tại chỉ có 1 option tiếng anh, làm thế nào để triển khai thêm 1 option tiếng Việt ?

Đúng, màn hình bạn chụp là ngôn ngữ giao diện Admin Panel, không phải locale của content i18n.

Hiện tại dropdown chỉ có English vì project chưa khai báo thêm locale cho Admin UI. Strapi hiện đã có sẵn translation tiếng Việt trong source (vi.json) và tên locale vi: "Tiếng Việt".

Bạn cấu hình trong:

src/admin/app.ts

hoặc nếu project dùng JavaScript:

src/admin/app.js

Ví dụ với Strapi 5:

import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['vi'],
  },

  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};

Không cần thêm en, vì English là fallback/default locale của Admin Panel và Strapi giữ nó mặc định. Cơ chế chính thức để thêm ngôn ngữ giao diện cũng là khai báo config.locales trong src/admin/app.

Sau đó cần rebuild Admin Panel, đây là bước rất quan trọng:

rm -rf dist .strapi

npm run build
npm run develop

Nếu dùng yarn:

rm -rf dist .strapi

yarn build
yarn develop

Sau khi build lại, vào:

Avatar
→ Profile
→ Experience
→ Interface language

Dropdown dự kiến sẽ thành:

English
Tiếng Việt

Chọn Tiếng Việt → Save.

Strapi hiện có translation tiếng Việt thực tế cho Admin UI, ví dụ các key như:

Interface language → Ngôn ngữ giao diện
Experience         → Trải nghiệm
Super Admin        → Quản trị viên cấp cao
Save               → Lưu
Delete             → Xóa

File translation tiếng Việt hiện tồn tại trong core Admin và chứa hàng trăm key UI.

Quan trọng: đừng nhầm 2 loại i18n

Trong Strapi bạn sẽ có hai cấu hình độc lập:

Mục đích	Cấu hình
Admin hiển thị English / Tiếng Việt	src/admin/app.ts → config.locales
Content website có vi / en	Settings → Internationalization

Ví dụ kiến trúc của bạn nên là:

Strapi
│
├── Admin UI languages
│   └── src/admin/app.ts
│       └── locales: ['vi']
│
└── Content languages
    └── Settings → Internationalization
        ├── en
        └── vi

Tức là việc bạn đã thêm Vietnamese trong:

Settings
→ Internationalization

không làm Tiếng Việt xuất hiện trong dropdown ở ảnh bạn gửi. Locale content và locale giao diện Admin là hai hệ thống khác nhau. Strapi mô tả Internationalization là tính năng quản lý content theo locale; Admin customization lại dùng src/admin/app để cấu hình ngôn ngữ UI.

Tôi đề xuất file app.ts như sau

Nếu hiện tại bạn chưa custom Admin:

import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['vi'],
  },

  bootstrap(app: StrapiApp) {},
};

Nếu file hiện tại đang là:

src/admin/app.example.tsx

thì đổi thành:

src/admin/app.ts

hoặc tùy scaffold của version bạn đang dùng có thể là:

src/admin/app.tsx

rồi rebuild.

Có một lưu ý với một số Strapi 5.x gần đây: hiện có bug report ở Strapi 5.51.1 khiến non-English locale đôi khi đã được lưu nhưng translation chunk không được load, dẫn đến UI vẫn English.

Vì vậy nếu sau khi thêm:

locales: ['vi']

mà vẫn chỉ thấy English, bước tiếp theo tôi sẽ kiểm tra:

npm list @strapi/strapi

hoặc:

yarn why @strapi/strapi

Nếu bạn gửi cho tôi package.json hoặc chỉ cần version Strapi hiện tại (5.x.x), tôi có thể cho bạn chính xác cấu hình tương thích với version đó, bao gồm trường hợp cần workaround cho bug Admin locale.

nếu chỉ muốn translate các label của field trong content manager, chứ không translate giá trị của field đó, tức là translate schema display label field thôi, thì làm thế nào, cách này có tác dụng ?

Có, và nếu yêu cầu của bạn là chỉ dịch label của field trong Content Manager, còn field key + field value + database hoàn toàn giữ nguyên, thì đây là hướng phù hợp hơn so với bật i18n cho content.

Ví dụ schema vẫn là:

{
  "attributes": {
    "doctorName": {
      "type": "string"
    },
    "specialty": {
      "type": "string"
    },
    "experienceYears": {
      "type": "integer"
    }
  }
}

Database vẫn lưu:

{
  "doctorName": "Nguyễn Văn A",
  "specialty": "Plastic Surgery",
  "experienceYears": 15
}

Nhưng Admin UI có thể hiển thị:

English                  Vietnamese

Doctor Name              Tên bác sĩ
Specialty                 Chuyên khoa
Experience Years          Số năm kinh nghiệm

Không có chuyện doctorName bị đổi thành tenBacSi, cũng không tạo thêm locale cho dữ liệu.

Nhưng có một điểm quan trọng với Strapi 5

Cấu hình mà tôi nói ở trên:

config: {
  locales: ['vi'],
}

chỉ thêm ngôn ngữ giao diện Admin và dịch các text mà Strapi đã khai báo bằng react-intl.

Nó không tự động dịch toàn bộ custom field labels trong Edit View của Content Manager.

Trong source hiện tại của Strapi 5, Edit View lấy label trực tiếp từ metadata:

return {
  attribute,
  disabled: !metadata.editable,
  hint: metadata.description,
  label: metadata.label ?? '',
  name: field.name,
  ...
};

Tức là metadata.label được đưa thẳng vào field, không được chạy qua formatMessage().

Trong khi đó ở List View, Strapi lại có xử lý translation cho column header bằng ID dạng:

content-manager.content-types.${model}.${header.name}

và gọi formatMessage().

Vì vậy có sự khác biệt giữa List View column labels và Edit View field labels.

Nếu toàn bộ editor đều dùng tiếng Việt

Đây là cách đơn giản nhất.

Vào:

Content Manager
→ Collection Type
→ Configure the view

Sau đó đổi:

doctorName
Label: Doctor Name

thành:

Label: Tên bác sĩ

Field thật vẫn là:

doctorName

API vẫn trả:

{
  "doctorName": "..."
}

Database không thay đổi.

Đây chỉ là presentation metadata của Content Manager.

Với hệ thống chỉ dành cho nhân viên Việt Nam, tôi sẽ chọn cách này vì ít custom code nhất.

Nếu muốn switch English ⇄ Vietnamese theo Interface Language

Ví dụ user A chọn:

Interface language: English

thì thấy:

Doctor Name
Specialty
Years of Experience

User B chọn:

Interface language: Tiếng Việt

thì thấy:

Tên bác sĩ
Chuyên khoa
Số năm kinh nghiệm

Trường hợp này nên custom Admin Panel bằng hook:

Admin/CM/pages/EditView/mutate-edit-view-layout

Đây chính là hook Strapi cung cấp để sửa layout của Edit View.

Ví dụ src/admin/app.ts:

import type { StrapiApp } from '@strapi/strapi/admin';

const fieldLabels = {
  vi: {
    doctorName: 'Tên bác sĩ',
    specialty: 'Chuyên khoa',
    experienceYears: 'Số năm kinh nghiệm',
    biography: 'Tiểu sử',
    position: 'Chức danh',
    image: 'Hình ảnh',
  },

  en: {
    doctorName: 'Doctor Name',
    specialty: 'Specialty',
    experienceYears: 'Years of Experience',
    biography: 'Biography',
    position: 'Position',
    image: 'Image',
  },
} as const;

export default {
  config: {
    locales: ['vi'],
  },

  bootstrap(app: StrapiApp) {
    app.registerHook(
      'Admin/CM/pages/EditView/mutate-edit-view-layout',
      ({ layout, ...rest }) => {
        const locale =
          window.localStorage.getItem('strapi-admin-language') || 'en';

        const translations =
          fieldLabels[locale as keyof typeof fieldLabels] ??
          fieldLabels.en;

        const translateFields = (value: any): any => {
          if (Array.isArray(value)) {
            return value.map(translateFields);
          }

          if (!value || typeof value !== 'object') {
            return value;
          }

          // Đây là một field trong Content Manager
          if (
            typeof value.name === 'string' &&
            typeof value.label === 'string'
          ) {
            return {
              ...value,
              label:
                translations[
                  value.name as keyof typeof translations
                ] ?? value.label,
            };
          }

          return Object.fromEntries(
            Object.entries(value).map(([key, child]) => [
              key,
              translateFields(child),
            ])
          );
        };

        return {
          ...rest,
          layout: translateFields(layout),
        };
      }
    );
  },
};

Strapi hiện lưu interface language ở key strapi-admin-language; source/bug report hiện tại cũng cho thấy locale Admin được persist ở key này.

Sau đó rebuild:

rm -rf dist .strapi

npm run build
npm run develop

Kết quả về mặt dữ liệu sẽ là:

                    Schema/API/DB
                         │
                         │
                         ▼
                  doctorName
                         │
                 ┌───────┴────────┐
                 │                │
         Admin locale=en   Admin locale=vi
                 │                │
                 ▼                ▼
          "Doctor Name"      "Tên bác sĩ"

Value hoàn toàn không bị ảnh hưởng.

Đây cũng là lý do tôi không khuyên bật Content i18n cho case này

Nếu bật i18n trên content type:

English entry
Vietnamese entry

thì bạn đang giải quyết vấn đề khác: dịch dữ liệu/content.

Trong trường hợp của bạn chỉ cần:

schema:
doctorName

UI en:
Doctor Name

UI vi:
Tên bác sĩ

thì không cần tạo:

doctorName[locale=en]
doctorName[locale=vi]

Nói cách khác:

Thành phần	Có translate?
Admin menu/buttons	✅
Field display label	✅
Field description/hint	Có thể
Field key doctorName	❌
API property	❌
Database column	❌
Value người dùng nhập	❌
Website content	❌
Tôi sẽ chọn kiến trúc này cho CMS của bạn

Giữ toàn bộ schema bằng English:

doctorName
specialty
experienceYears
biography
education
certifications
beforeAfterImages

và chỉ có một layer Admin UI:

src/admin/
├── app.ts
└── translations/
    ├── en.ts
    └── vi.ts

Ví dụ:

// translations/vi.ts
export default {
  doctorName: 'Tên bác sĩ',
  specialty: 'Chuyên khoa',
  experienceYears: 'Số năm kinh nghiệm',
};
// translations/en.ts
export default {
  doctorName: 'Doctor Name',
  specialty: 'Specialty',
  experienceYears: 'Years of Experience',
};

Cách này sạch hơn rất nhiều so với nhét tiếng Việt vào schema.json, vì schema là technical contract, còn label là presentation layer.

Và quan trọng nhất: config.locales: ['vi'] vẫn có tác dụng, nhưng nhiệm vụ của nó là cho phép user chọn Tiếng Việt làm Interface Language. Để custom schema field labels trong Edit View đổi theo ngôn ngữ đó, bạn cần thêm layer MUTATE_EDIT_VIEW_LAYOUT như trên.

cần viết 1 md english block prompt để check và triển khai option vi, lưu ý đây chỉ là language cho admin panel, và label field của content manager như phân tích trren6
# Task: Add Vietnamese Admin UI Language and Localized Content Manager Field Labels in Strapi

## Objective

Inspect the existing Strapi project and implement Vietnamese (`vi`) as an additional **Admin Panel interface language**.

This task is strictly about:

1. Strapi Admin Panel interface language.
2. Content Manager field display labels.
3. Content Manager field descriptions/hints if applicable.

This task is **NOT** about translating content values stored in Strapi.

The implementation must preserve the existing content schema, API contracts, database structure, and stored content values.

---

## Important Scope

We need to support:

```text
Admin Interface Language

English
Vietnamese

When the current Admin user selects English:

Doctor Name
Specialty
Years of Experience
Biography
Image

When the current Admin user selects Vietnamese:

Tên bác sĩ
Chuyên khoa
Số năm kinh nghiệm
Tiểu sử
Hình ảnh

However, the actual schema must remain unchanged:

doctorName
specialty
experienceYears
biography
image

The actual stored values must also remain unchanged.

Example:

{
  "doctorName": "Nguyễn Văn A",
  "specialty": "Plastic Surgery",
  "experienceYears": 15
}

Changing the Admin language MUST NOT create another localized content entry and MUST NOT modify the above values.

Phase 1 — Inspect the Existing Strapi Project

Before modifying anything, inspect the project and determine:

Exact Strapi version.
Whether this project is Strapi v4 or Strapi v5.
Whether the Admin customization entry point is:
src/admin/app.ts
src/admin/app.tsx
src/admin/app.js
src/admin/app.jsx
Existing Admin Panel customization.
Existing Admin locales configuration.
Existing Content Manager customization.
Whether @strapi/plugin-i18n exists.
Whether content i18n/localization is currently enabled.
Whether custom Admin plugins/extensions already exist.
Current build/runtime commands.
Current TypeScript configuration if applicable.

Inspect at minimum:

package.json
src/admin/
config/
src/api/
src/components/

Also inspect any existing Content Manager configuration or custom Admin extensions that may affect field labels.

Do not assume the implementation from another Strapi version is valid.

Use APIs/hooks supported by the exact Strapi version installed in this repository.

Phase 2 — Understand and Preserve the Separation of Concerns

There are two different localization concepts in Strapi.

A. Content localization

Example:

Article EN
Article VI

This translates actual content values.

This is NOT what we are implementing.

Do not enable localization on content types just to solve Admin field labels.

Do not introduce duplicate localized entries.

Do not change API requests to:

?locale=en
?locale=vi

unless such behavior already exists for unrelated business requirements.

B. Admin interface localization

This controls the Admin UI.

Example:

English:
Doctor Name

Vietnamese:
Tên bác sĩ

while keeping:

schema attribute: doctorName
database field/value: unchanged
API property: doctorName

This is the required behavior.

Phase 3 — Add Vietnamese as an Admin Interface Language

Configure the Admin application so the user can select Vietnamese from:

Profile
→ Experience
→ Interface language

Expected options:

English
Tiếng Việt

For Strapi versions that support Admin locales through src/admin/app.*, configure Vietnamese appropriately.

Conceptually:

export default {
  config: {
    locales: ['vi'],
  },
};

However, verify the correct API and syntax against the exact installed Strapi version before applying it.

Do not blindly overwrite an existing config object.

Merge with the current Admin configuration.

For example, preserve existing configuration such as:

config: {
  auth: {},
  head: {},
  menu: {},
  tutorials: false,
  notifications: {},
  translations: {},
}

if present.

Phase 4 — Check Built-In Vietnamese Admin Translations

Determine whether the installed Strapi version already ships Vietnamese translations for the standard Admin interface.

Verify that standard UI elements can switch appropriately, for example:

Save
Delete
Settings
Content Manager
Profile
Interface language

Do not duplicate the entire Strapi translation catalog if Strapi already provides it.

Only add custom translations where needed.

Phase 5 — Localize Content Manager Field Display Labels

The main requirement is to translate Content Manager field labels according to the selected Admin interface language.

Example schema:

{
  "attributes": {
    "doctorName": {
      "type": "string"
    },
    "specialty": {
      "type": "string"
    },
    "experienceYears": {
      "type": "integer"
    }
  }
}

Schema attribute names must remain:

doctorName
specialty
experienceYears

Display labels can change:

English
Doctor Name
Specialty
Years of Experience
Vietnamese
Tên bác sĩ
Chuyên khoa
Số năm kinh nghiệm
Phase 6 — Determine How the Current Strapi Version Renders Field Labels

Before implementing translations, inspect how the installed Strapi Content Manager resolves:

field.name
field.label
field.description
metadata.label
metadata.description

Check whether Edit View labels already support translation message IDs.

Also inspect the behavior of:

List View
Edit View
Create View
Components
Dynamic Zones
Relations
Media fields
Repeatable components
Single types
Collection types

Do not assume List View and Edit View use the same translation mechanism.

Phase 7 — Implement a Maintainable Translation Layer

Do not hardcode Vietnamese labels directly inside business schemas unless absolutely required by the installed Strapi architecture.

Prefer a centralized Admin translation structure such as:

src/admin/
├── app.ts
└── translations/
    ├── en.ts
    └── vi.ts

Example:

// translations/en.ts

export default {
  doctorName: 'Doctor Name',
  specialty: 'Specialty',
  experienceYears: 'Years of Experience',
  biography: 'Biography',
  image: 'Image',
};
// translations/vi.ts

export default {
  doctorName: 'Tên bác sĩ',
  specialty: 'Chuyên khoa',
  experienceYears: 'Số năm kinh nghiệm',
  biography: 'Tiểu sử',
  image: 'Hình ảnh',
};

If the project contains many content types, use namespaced keys instead of globally ambiguous field names.

Preferred pattern:

export default {
  'doctor.doctorName': 'Tên bác sĩ',
  'doctor.specialty': 'Chuyên khoa',
  'doctor.experienceYears': 'Số năm kinh nghiệm',

  'service.title': 'Tên dịch vụ',
  'service.description': 'Mô tả',

  'article.title': 'Tiêu đề',
  'article.content': 'Nội dung',
};

This avoids collisions such as:

doctor.title
service.title
article.title

having different business meanings.

Phase 8 — Use the Selected Admin Language

The translated Content Manager labels must follow the currently selected Strapi Admin interface language.

Expected behavior:

User A:
Interface language = English

doctorName → Doctor Name
specialty → Specialty
User B:
Interface language = Tiếng Việt

doctorName → Tên bác sĩ
specialty → Chuyên khoa

Do not implement a separate language selector specifically for field labels.

The Content Manager labels must derive their language from the Strapi Admin user's existing interface language preference.

Before reading from localStorage directly, inspect the current Strapi Admin API/state and determine whether there is an official mechanism to obtain the active locale.

Prefer the official Admin API/store/context when available.

Only use a persistence key such as:

strapi-admin-language

if that is confirmed to be the correct mechanism for the installed Strapi version.

Do not rely on undocumented assumptions when a supported API exists.

Phase 9 — Content Manager Edit View

If the installed Strapi version does not automatically translate custom field labels, use the officially supported Content Manager extension/hook mechanism.

For Strapi versions that expose an Edit View layout mutation hook, investigate the appropriate hook, such as conceptually:

Admin/CM/pages/EditView/mutate-edit-view-layout

Do not use this exact hook name unless it exists in the installed version.

Use the version-specific supported hook.

The implementation may conceptually transform:

{
  name: 'doctorName',
  label: 'Doctor Name'
}

into:

{
  name: 'doctorName',
  label: 'Tên bác sĩ'
}

for Vietnamese users.

The transformation MUST only affect presentation metadata.

Never transform:

name
attribute name
API key
component key
database field
relation key
Phase 10 — Support Nested Components

The solution should not only work for top-level fields.

Inspect and support, where applicable:

Components
Repeatable Components
Dynamic Zones
Nested Components
Relations
Media fields
Enumeration fields
Boolean fields
JSON fields
Rich Text fields
UID fields

Example:

Doctor
└── seo
    ├── metaTitle
    ├── metaDescription
    └── keywords

Vietnamese Admin labels might become:

SEO
├── Tiêu đề SEO
├── Mô tả SEO
└── Từ khóa

while schema remains:

seo.metaTitle
seo.metaDescription
seo.keywords
Phase 11 — Prefer Stable Translation Keys

Do not translate based only on arbitrary visible English strings such as:

if (label === 'Doctor Name') ...

This is fragile.

Prefer stable identifiers such as:

content type UID
component UID
field name

For example:

api::doctor.doctor.doctorName
api::doctor.doctor.specialty
shared.seo.metaTitle

or another normalized internal structure.

Create a reusable translation resolver.

Example conceptual API:

resolveFieldLabel({
  locale,
  contentType,
  component,
  fieldName,
  defaultLabel,
});

Expected:

resolveFieldLabel({
  locale: 'vi',
  contentType: 'api::doctor.doctor',
  fieldName: 'doctorName',
  defaultLabel: 'Doctor Name',
});

returns:

Tên bác sĩ

If a translation does not exist, safely fall back to the existing/default label.

Phase 12 — Optional Field Descriptions / Hints

If Content Manager fields currently use descriptions or hints, support their localization as well.

Example:

English
Doctor Name
Enter the doctor's full professional name.
Vietnamese
Tên bác sĩ
Nhập đầy đủ họ tên chuyên môn của bác sĩ.

Keep labels and descriptions as separate translation keys.

Example:

{
  'doctor.doctorName.label': 'Tên bác sĩ',
  'doctor.doctorName.description':
    'Nhập đầy đủ họ tên chuyên môn của bác sĩ.',
}

Do not translate placeholder/value text unless explicitly intended as Admin UI metadata.

Phase 13 — Do NOT Modify Content Values

This requirement is critical.

Do not translate:

Article title value
Doctor biography value
Service description value
SEO content value
Rich text content
JSON content
Relation values
Uploaded media metadata

For example:

Field:
specialty

Stored value:
Plastic Surgery

Changing Admin language to Vietnamese must NOT automatically change it to:

Phẫu thuật thẩm mỹ

Only the label:

Specialty

should become:

Chuyên khoa
Phase 14 — Do NOT Modify API Contracts

Before and after implementation:

GET /api/doctors

must continue to return the same property names.

Before:

{
  "doctorName": "...",
  "specialty": "...",
  "experienceYears": 15
}

After:

{
  "doctorName": "...",
  "specialty": "...",
  "experienceYears": 15
}

Never change API keys to:

{
  "tenBacSi": "...",
  "chuyenKhoa": "..."
}
Phase 15 — Do NOT Modify the Database Schema

No migration should be required just to translate Admin labels.

Do not:

Rename columns.
Add localized columns.
Duplicate records.
Create locale-specific records.
Modify relations.
Modify component storage.
Add content localization fields.

If a DB migration appears necessary, stop and re-evaluate the implementation because that likely means Admin presentation and business data are being mixed incorrectly.

Phase 16 — Keep Existing Content i18n Independent

If the project already uses Strapi content i18n for some content types, do not remove or break it.

However, do not use Content i18n as the mechanism for Admin field labels.

These must remain independent:

Admin UI locale
        │
        ├── menu translations
        ├── buttons
        ├── field labels
        └── field hints

Content locale
        │
        ├── English content values
        └── Vietnamese content values

A user may theoretically have:

Admin UI: Vietnamese
Content locale being edited: English

That is valid.

Example:

Tên bác sĩ:
John Smith

Tiểu sử:
John Smith is a board-certified...

Here:

Tên bác sĩ
Tiểu sử

are Vietnamese Admin labels,

while:

John Smith
John Smith is...

are English content values.

Do not couple these two locales.

Phase 17 — Implementation Quality

The implementation should be:

Type-safe where TypeScript is used.
Centralized.
Easy to extend.
Version-compatible with the installed Strapi version.
Free from unnecessary dependencies.
Compatible with production Admin builds.
Non-invasive to Strapi core.
Upgrade-friendly.

Do not modify files inside:

node_modules/

Do not patch Strapi core source directly unless there is an unavoidable confirmed Strapi bug.

If a workaround is required, document exactly why.

Phase 18 — Build and Verify

After implementation, rebuild the Admin Panel using the project's existing package manager.

For example:

npm run build
npm run develop

or the equivalent Yarn/pnpm commands.

Only clear caches/build artifacts that are safe for this repository.

Verify both development and production Admin builds if practical.

Acceptance Criteria

The task is complete only when all of the following are verified.

1. Language option

Admin Profile shows:

English
Tiếng Việt

under Interface Language.

2. Standard Admin UI

Selecting Vietnamese changes supported standard Strapi Admin UI labels to Vietnamese.

3. Content Manager labels

Given a schema field:

doctorName

English Admin UI displays:

Doctor Name

Vietnamese Admin UI displays:

Tên bác sĩ
4. Content values unchanged

Switching between:

English
Tiếng Việt

does not change any stored field values.

5. Schema unchanged

The field remains:

doctorName

not:

tenBacSi
6. API unchanged

API still returns:

{
  "doctorName": "..."
}
7. Database unchanged

No DB schema migration occurs solely because of Admin label localization.

8. Per-user preference

If Strapi supports per-user Admin language preferences, changing one Admin user's language must not force all Admin users to use the same language.

9. Fallback

If a Vietnamese translation is missing:

field → no Vietnamese translation

the existing/default English label must still render correctly.

The UI must not show:

undefined
null
translation.missing.key
10. Nested structures

Verify labels inside at least one component/dynamic zone if the project uses them.

Deliverables

After implementation, provide a concise report containing:

Existing state
Strapi version:
Admin entry file:
Existing locales:
Existing Content i18n usage:
Existing customizations:
Files changed

Example:

src/admin/app.ts
src/admin/translations/en.ts
src/admin/translations/vi.ts
src/admin/utils/resolveFieldTranslation.ts

Only report files actually changed.

Implementation explanation

Explain:

How vi was added to Admin languages.
How the active Admin locale is detected.
How field labels are translated.
How nested/component fields are handled.
How fallback works.
Why content values remain untouched.
Verification

Report the result of:

English Admin UI
Vietnamese Admin UI
Content Manager Edit View
Content Manager List View
Components
Build
API regression check
Explicit Non-Goals

Do NOT implement any of the following unless already required elsewhere in the project:

Automatic English → Vietnamese content translation
OpenAI translation
Google Translate
DeepL
Localized database values
Duplicated locale entries
Frontend website language switching
Frontend i18n
SEO content translation
API property translation
Schema key translation
Database column translation

The requirement is exclusively:

Strapi Admin UI language
+
Content Manager display label localization

not business content localization.

Final Architecture Goal

The final separation should conceptually be:

                         STRAPI
                            │
             ┌──────────────┴──────────────┐
             │                             │
       Admin Presentation              Content/Data
             │                             │
      Admin locale                     Schema/API
        en / vi                            │
             │                             │
    ┌────────┴─────────┐            doctorName
    │                  │            specialty
 English            Vietnamese       biography
    │                  │                   │
Doctor Name       Tên bác sĩ               │
Specialty         Chuyên khoa              │
Biography         Tiểu sử                  │
    │                  │                   │
    └──────── presentation only ───────────┘
                                           │
                                     Value unchanged

Implement the smallest, cleanest, version-compatible solution that satisfies this separation.