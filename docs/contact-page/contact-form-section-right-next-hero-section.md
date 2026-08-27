UI Implementation Spec — Homepage Hero
1. Identity
Field	Value
Route	/
Section ID	home-hero
Section name	Homepage Hero
Screenshot scope	OBSERVED: một section biểu mẫu đặt lịch/tư vấn kết hợp khối thông tin liên hệ Smilux Dental
Target viewport	OBSERVED: screenshot 1316 × 581 px; phần section hiển thị gần toàn bộ chiều cao ảnh
Primary implementation goal	Reproduce the supplied desktop screenshot with maximum visual fidelity
Overall evidence quality	High cho desktop layout/copy; Medium cho typography, màu chính xác và asset

Identity phía trên được giữ theo INPUT CỐ ĐỊNH của tài liệu nguồn. Screenshot thực tế thể hiện section đặt lịch/tư vấn, không có bằng chứng thị giác cho một hero marketing truyền thống.

2. Scope Boundary
Included in this spec
OBSERVED: card trái chứa form Đặt lịch hẹn / Gửi yêu cầu tư vấn.
OBSERVED: card phải chứa Thông tin Smilux Dental.
OBSERVED: advisor/doctor callout.
OBSERVED: Hotline, Zalo OA, WhatsApp và Email.
OBSERVED: trust/security callout ở cuối card phải.
OBSERVED: toàn bộ input, select, textarea, consent checkbox và CTA nằm trong screenshot.
OBSERVED: nền trắng/off-white xung quanh hai card.
Excluded from this spec
UNKNOWN: header/navigation phía trên.
UNKNOWN: footer hoặc section kế tiếp.
UNKNOWN: backend/API của form.
UNKNOWN: validation/error/success UI.
UNKNOWN: dropdown menu khi select được mở.
UNKNOWN: hover/active states.
UNKNOWN: nội dung ngoài screenshot.
Section start and end
Start: INFERRED — mép trên vùng trắng của screenshot; card bắt đầu cách mép trên khoảng 16 px estimated.
End: INFERRED — mép dưới screenshot, sau hai card khoảng 15 px estimated.
Cropped/partially visible content: UNKNOWN — không thấy section kế tiếp hoặc section trước; screenshot có thể đã crop sát section.
3. Evidence and Confidence
Item	Status	Evidence / reason
Section boundary	INFERRED	Hai card nằm trọn trong screenshot nhưng không có neighboring section để xác định DOM boundary
Desktop layout	OBSERVED	Hai card đặt ngang trong centered container
Copy/text content	OBSERVED	Phần lớn text đủ rõ để đọc trực tiếp
Typography values	INFERRED	Có thể ước lượng hierarchy/size nhưng không xác định font metadata từ bitmap
Colors	INFERRED	Có thể lấy màu gần đúng từ pixel screenshot nhưng không có design tokens
Assets	OBSERVED / UNKNOWN	Avatar bác sĩ và nhiều icon hiện rõ; source asset gốc không được cung cấp
Interaction states	UNKNOWN	Screenshot chỉ thể hiện default state
Responsive behavior	UNKNOWN	Chỉ có desktop screenshot
4. OCR Content Inventory

Preserve all readable text exactly as shown. Mark uncertainty explicitly.

Element ID	Visible text	Text type	OCR confidence	Notes
form-title	Đặt lịch hẹn / Gửi yêu cầu tư vấn	Heading	High	Card trái
form-intro	Vui lòng điền thông tin để chúng tôi liên hệ hỗ trợ bạn sớm nhất.	Paragraph	High	Intro dưới heading
label-name	Họ và tên *	Label	High	Dấu * màu đỏ
placeholder-name	Nhập họ và tên	Placeholder	High	Input
label-phone	Số điện thoại *	Label	High	Dấu * màu đỏ
placeholder-phone	Nhập số điện thoại	Placeholder	High	Input
label-email	Email	Label	High	Không thấy dấu required
placeholder-email	Nhập email của bạn	Placeholder	High	Input
label-service	Dịch vụ quan tâm *	Label	High	Select
service-selected	Tư vấn cấy ghép Implant	Select value	High	Default visible value
label-location	Chọn cơ sở *	Label	High	Select full-width
location-selected	Smilux - Phú Nhuận	Select value	High	Default visible value
label-message	Nội dung tư vấn	Label	High	Textarea
placeholder-message	Bạn đang quan tâm điều gì? Tình trạng răng hiện tại của bạn?	Placeholder	High	Textarea
consent-prefix	Tôi đồng ý với	Legal	High	Checkbox row
consent-link	Chính sách bảo mật	Link	High	Màu xanh
consent-suffix	của Smilux Dental	Legal	High	Cùng dòng
submit-label	GỬI YÊU CẦU	CTA	High	Uppercase
info-title	Thông tin Smilux Dental	Heading	High	Card phải
info-description	Phòng khám chuyên sâu Implant và phục hình thẩm mỹ với công nghệ hiện đại, bác sĩ giàu kinh nghiệm.	Paragraph	High	Hiển thị thành nhiều dòng
advisor-title	Bạn sẽ được tư vấn 1:1 cùng bác sĩ	Heading / callout	High	Màu xanh
advisor-body	Giải đáp chi tiết về tình trạng răng miệng, phương án điều trị và chi phí minh bạch.	Paragraph	High	Trong advisor card
contact-hotline-label	Hotline 24/7	Label	High	Contact row
contact-hotline-value	1800 8888	Contact value	High	Màu xanh
contact-zalo-label	Zalo OA	Label	High	Contact row
contact-zalo-value	Smilux Dental Clinic	Contact value	High	Màu xanh
contact-whatsapp-label	WhatsApp	Label	High	Contact row
contact-whatsapp-value	(+84) 90 123 4567	Contact value	High	Màu xanh
contact-email-label	Email	Label	High	Contact row
contact-email-value	info@smiluxdental.vn	Contact value	High	Màu xanh
trust-title	Tư vấn Implant miễn phí - Không áp lực	Heading / badge	High	Bottom callout
trust-body	Cam kết bảo mật thông tin - Hỗ trợ tận tâm	Paragraph	High	Bottom callout
5. Layout Anatomy
5.1 Global geometry
Property	Specification	Status
Section width	Screenshot width 1316 px; content container ~1075 px estimated	OBSERVED / INFERRED
Section height	Screenshot 581 px; cards ~550 px estimated	OBSERVED / INFERRED
Background behavior	Full-bleed solid white/off-white	OBSERVED
Content container	Centered, ~82% screenshot width	INFERRED
Horizontal gutters	~120 px estimated left/right	INFERRED
Main layout model	Two-column split	OBSERVED
Vertical alignment	Both primary cards top- and bottom-aligned	OBSERVED
Overflow / cropping	No visible internal overflow	OBSERVED
5.2 Structure tree
Section: home-hero
├── Main centered container
│   ├── Appointment / consultation card
│   │   ├── Heading
│   │   ├── Intro paragraph
│   │   └── Consultation form
│   │       ├── Name + phone row
│   │       ├── Email + service row
│   │       ├── Location select
│   │       ├── Consultation textarea
│   │       ├── Privacy consent row
│   │       └── Primary submit CTA
│   └── Smilux information card
│       ├── Heading
│       ├── Description
│       ├── Doctor/advisor callout
│       │   ├── Portrait
│       │   └── Copy
│       ├── Contact list
│       │   ├── Hotline row
│       │   ├── Zalo OA row
│       │   ├── WhatsApp row
│       │   └── Email row
│       └── Trust/security callout
5.3 Spatial relationships
Element	Position and dimensions	Alignment relationship	Spacing relationship	Status
Main container	~1075 × 550 px estimated	Centered horizontally	~16 px estimated vertical outer margin	INFERRED
Left card	~605 px estimated wide	Left edge of container	~18 px estimated gap to right card	INFERRED
Right card	~452 px estimated wide	Right edge of container	Same height as left card	INFERRED
Card content	Internal padding ~27 px estimated	Consistent left alignment	Repeated vertical rhythm	INFERRED
Form heading	Top-left of left card	Aligns with form controls	~16 px estimated from intro	OBSERVED / INFERRED
Two-column input rows	Each field ~half available width	Equal-height controls	~26 px estimated horizontal gap	INFERRED
Location select	Full form width	Same left/right bounds as two-column grid	Below second input row	OBSERVED
Textarea	Full form width	Same form bounds	Below location select	OBSERVED
CTA	Full form width	Same form bounds	Near bottom after consent row	OBSERVED
Advisor callout	Full inner width of right card	Below description	~16 px estimated below paragraph	INFERRED
Contact list	Full inner width	Rows vertically stacked	Thin separators between rows	OBSERVED
Trust callout	Full inner width	Bottom of right card	After contact list	OBSERVED
5.4 Layering and overlap
Layer order	Element	Behavior	Status
1	Section background	Static white/off-white surface	OBSERVED
2	Two primary cards	Elevated above section via border/shadow	OBSERVED
3	Form controls / inner callouts	Contained within cards	OBSERVED
4	Icons / portrait / text	Foreground content	OBSERVED

No meaningful element overlap is visible.

6. Visual Specification
6.1 Color and surface
Token candidate	Usage	Value / description	Status
color/surface/page	Section background	White to very light cool gray	INFERRED
color/surface/card	Main cards	Near-white	OBSERVED / INFERRED
color/surface/callout	Advisor/trust callouts	Very pale blue	OBSERVED / INFERRED
color/text/primary	Headings/labels	Dark navy	OBSERVED / INFERRED
color/text/secondary	Body/placeholder	Muted slate/navy	OBSERVED / INFERRED
color/action/primary	CTA, contact values, links	Saturated royal/electric blue	OBSERVED / INFERRED
color/action/gradient	Submit CTA	Blue gradient, lighter toward center/right than dark edge areas	OBSERVED
color/border/default	Inputs/cards	Very light cool gray-blue	OBSERVED / INFERRED
color/border/callout	Advisor/trust callouts	Pale blue	OBSERVED / INFERRED
color/status/required	Required *	Red	OBSERVED

Exact HEX/RGB values: UNKNOWN.

6.2 Typography
Element	OCR text reference	Font family	Weight	Size	Line-height	Letter spacing	Color	Status
Main card heading	form-title, info-title	UNKNOWN	~700	~20 px estimated	~26 px estimated	UNKNOWN	Dark navy	INFERRED
Intro/body	form-intro, info-description	UNKNOWN	~400–500	~12–13 px estimated	~19 px estimated	UNKNOWN	Muted navy	INFERRED
Form label	Form labels	UNKNOWN	~600	~12 px estimated	~16 px estimated	UNKNOWN	Dark navy	INFERRED
Input text	Form values/placeholders	UNKNOWN	~400	~12 px estimated	Control-centered	UNKNOWN	Slate/navy	INFERRED
Advisor title	advisor-title	UNKNOWN	~600–700	~13 px estimated	~18 px estimated	UNKNOWN	Blue	INFERRED
Contact label	Contact row labels	UNKNOWN	~600	~12 px estimated	~18 px estimated	UNKNOWN	Dark navy	INFERRED
Contact value	Contact row values	UNKNOWN	~600–700	~14 px estimated	~18 px estimated	UNKNOWN	Blue	INFERRED
Primary CTA	submit-label	UNKNOWN	~700	~15 px estimated	Centered	UNKNOWN	White	INFERRED
Trust title	trust-title	UNKNOWN	~600	~12–13 px estimated	~17 px estimated	UNKNOWN	Blue	INFERRED
6.3 Borders, radius, effects
Element	Border	Radius	Shadow / blur	Opacity	Status
Main cards	~1 px estimated light gray-blue	~12–14 px estimated	Very soft cool-gray outer shadow	100%	INFERRED
Text inputs/selects	~1 px estimated light gray	~8 px estimated	Minimal/subtle inset or outer depth	100%	INFERRED
Textarea	Same as inputs	~8 px estimated	Minimal	100%	INFERRED
CTA	No distinct border visible	Pill-like, ~half control height	Subtle blue shadow possible	100%	OBSERVED / INFERRED
Advisor callout	Pale-blue thin border	~10 px estimated	None or extremely subtle	100%	INFERRED
Contact icon circles	UNKNOWN border	Circular	None visible	100%	OBSERVED / UNKNOWN
Trust callout	Pale-blue thin border	~10 px estimated	None visible	100%	INFERRED
6.4 Icons and decoration
Element ID	Description	Asset type	Size / placement	Source required	Status
submit-icon	Outline person/consultation icon trước CTA label	SVG / UNKNOWN	~18 px estimated, left of label	Asset library / recreate	OBSERVED
advisor-portrait	Chân dung bác sĩ mặc blouse trắng, áo xanh	Raster	Circular crop ~75 px estimated	Figma export / supplied asset	OBSERVED
hotline-icon	Phone handset inside pale circular holder	SVG / UNKNOWN	~28 px estimated holder	Asset library / recreate	OBSERVED
zalo-icon	Messaging/Zalo-style icon inside circle	SVG / UNKNOWN	~28 px estimated holder	Asset library / recreate	OBSERVED
whatsapp-icon	WhatsApp-style communication icon inside circle	SVG / UNKNOWN	~28 px estimated holder	Asset library / recreate	OBSERVED
email-icon	Envelope inside circle	SVG / UNKNOWN	~28 px estimated holder	Asset library / recreate	OBSERVED
trust-shield-icon	Shield outline with check mark	SVG / UNKNOWN	~42 px estimated holder/graphic	Asset library / recreate	OBSERVED
select-chevron	Downward chevron	SVG / CSS / UNKNOWN	Right-aligned inside selects	Existing form icon preferred	OBSERVED
7. Asset Manifest
Asset ID	Visible description	Required format	Aspect ratio / crop	Placement	Alt text requirement	Status
doctor-advisor	Portrait of dental doctor/advisor	PNG / WebP / UNKNOWN	Circular crop from portrait	Left side of advisor callout	Informative only if doctor identity/content is meaningful; exact alt UNKNOWN	OBSERVED
icon-consultation	CTA consultation/person icon	SVG preferred	Square	Inside submit button	Decorative if CTA label already conveys action	OBSERVED
icon-phone	Hotline icon	SVG preferred	Square	Contact list	Decorative if row label exists	OBSERVED
icon-zalo	Zalo/messaging icon	SVG preferred	Square	Contact list	Decorative if row label exists	OBSERVED
icon-whatsapp	WhatsApp icon	SVG preferred	Square	Contact list	Decorative if row label exists	OBSERVED
icon-email	Envelope icon	SVG preferred	Square	Contact list	Decorative if row label exists	OBSERVED
icon-shield-check	Trust/security shield	SVG preferred	Square	Trust callout	Decorative if adjacent copy conveys meaning	OBSERVED
icon-chevron-down	Select dropdown indicator	SVG preferred	Square	Right side of selects	Decorative	OBSERVED
Asset handling rules
Do not substitute the doctor portrait with a generic stock image if visual fidelity is required.
Prefer existing project assets/icons where they visually match the screenshot.
Exact original assets are UNKNOWN and should be exported from Figma or supplied by the project if available.
Do not infer doctor identity from the bitmap.
8. Component Contract
8.1 Recommended component boundary
Component	Responsibility	Reusable?	Evidence	Status
ConsultationSection	Two-column section composition	No / Unknown	Entire screenshot	INFERRED
ConsultationFormCard	Heading, intro and complete form	Yes	Distinct left card	INFERRED
FormField	Consistent label/control treatment	Yes	Repeated controls	INFERRED
AdvisorCallout	Portrait + consultation copy	Yes	Distinct bounded pattern	INFERRED
ContactList	Collection of contact rows	Yes	Four repeated rows	INFERRED
ContactRow	Icon + label + value	Yes	Repeated four times	OBSERVED / INFERRED
TrustCallout	Shield + trust copy	Yes / Unknown	Distinct bounded pattern	INFERRED
8.2 Data model
// This is an interface contract only, not implementation code.
// Include only properties supported by visible evidence.

interface ConsultationSectionData {
  formTitle: string;
  formIntro: string;
  serviceOptions: string[];
  locationOptions: string[];
  privacyPolicyLabel: string;
  submitLabel: string;

  infoTitle: string;
  infoDescription: string;

  advisorTitle: string;
  advisorDescription: string;
  advisorImage: string;

  contacts: Array<{
    type: string;
    label: string;
    value: string;
    icon: string;
  }>;

  trustTitle: string;
  trustDescription: string;
}
Field	Type	Required	Visible evidence	Notes
formTitle	string	Yes	Visible heading	Configurable copy
formIntro	string	Yes	Visible paragraph	Configurable copy
serviceOptions	string[]	Yes	Select exists	Only one visible option is known
locationOptions	string[]	Yes	Select exists	Only one visible option is known
privacyPolicyLabel	string	Yes	Visible legal row	URL UNKNOWN
submitLabel	string	Yes	Visible CTA	Action UNKNOWN
infoTitle	string	Yes	Visible heading	Configurable copy
infoDescription	string	Yes	Visible paragraph	Configurable copy
advisorTitle	string	Yes	Visible callout	Configurable
advisorDescription	string	Yes	Visible callout	Configurable
advisorImage	string	Yes	Portrait visible	Asset source UNKNOWN
contacts	array	Yes	Four rows visible	Destination/link behavior UNKNOWN
trustTitle	string	Yes	Visible callout	Configurable
trustDescription	string	Yes	Visible callout	Configurable
8.3 Content behavior
Static content: OBSERVED — screenshot shows all copy in a stable/default state.
Configurable content: INFERRED — headings, descriptions, service/location options, contact values and portrait should be data/config driven rather than duplicated in presentation.
Unknown data/API behavior: form submission, service list source, branch list source, tracking, CRM integration, validation, consent persistence and contact-link destinations are UNKNOWN.
9. Interaction States
Element	Default evidence	Hover	Active	Focus	Disabled	Link/action destination	Status
Name input	Empty placeholder	UNKNOWN	UNKNOWN	Must be accessible	UNKNOWN	Text entry	OBSERVED / UNKNOWN
Phone input	Empty placeholder	UNKNOWN	UNKNOWN	Must be accessible	UNKNOWN	Text/phone entry	OBSERVED / UNKNOWN
Email input	Empty placeholder	UNKNOWN	UNKNOWN	Must be accessible	UNKNOWN	Email entry	OBSERVED / UNKNOWN
Service select	Tư vấn cấy ghép Implant	UNKNOWN	UNKNOWN	Must be accessible	UNKNOWN	Options UNKNOWN	OBSERVED / UNKNOWN
Location select	Smilux - Phú Nhuận	UNKNOWN	UNKNOWN	Must be accessible	UNKNOWN	Options UNKNOWN	OBSERVED / UNKNOWN
Textarea	Empty placeholder	UNKNOWN	UNKNOWN	Must be accessible	UNKNOWN	Text entry	OBSERVED / UNKNOWN
Consent checkbox	Unchecked	UNKNOWN	UNKNOWN	Must be accessible	UNKNOWN	Toggles consent	OBSERVED
Privacy policy	Blue link-like text	UNKNOWN	UNKNOWN	Must be accessible	UNKNOWN	UNKNOWN	OBSERVED / UNKNOWN
Submit CTA	Blue gradient	UNKNOWN	UNKNOWN	Must be accessible	UNKNOWN	Form submission UNKNOWN	OBSERVED / UNKNOWN
Contact values	Blue link-like values	UNKNOWN	UNKNOWN	Must be accessible if actionable	UNKNOWN	UNKNOWN	OBSERVED / UNKNOWN
Interaction constraints
Do not invent animation, carousel behavior, modal behavior, form submission, or navigation destination.
If an element visually resembles a button but behavior is not known, classify it as action destination UNKNOWN.
Do not infer that phone, Zalo, WhatsApp or email values are clickable solely from their blue styling.
Native semantic form behavior is preferred where compatible with product requirements.
10. Responsive Specification
10.1 Evidence available
Desktop evidence: OBSERVED — 1316 × 581 px screenshot with two side-by-side cards.
Tablet evidence: UNKNOWN.
Mobile evidence: UNKNOWN.
10.2 Required desktop behavior
Preserve centered two-card composition.
Preserve left card as the wider column.
Keep both cards visually equal in height at the supplied viewport.
Preserve two-column arrangement for the first four form fields.
Preserve full-width branch select, textarea, consent and CTA.
Preserve right-card advisor, contacts and trust callout vertical sequence.
Target screenshot fidelity applies only to this supplied desktop viewport, consistent with the source requirement.
10.3 Proposed responsive behavior
Breakpoint range	Layout behavior	Typography behavior	Image/asset behavior	Status and rationale
Desktop	Two cards side-by-side; left ~56%, right ~42%, remainder gap	Preserve screenshot hierarchy	Portrait remains circular	OBSERVED / INFERRED
Tablet	UNKNOWN; likely cards require stacking or altered ratio	UNKNOWN	UNKNOWN	UNKNOWN — no screenshot evidence
Mobile	UNKNOWN; likely single-column form/cards	UNKNOWN	UNKNOWN	UNKNOWN — no screenshot evidence
10.4 Responsive assumptions requiring approval
Whether main cards stack on tablet.
Exact breakpoint values.
Whether paired form fields become single-column.
Mobile card padding.
Mobile contact-row wrapping.
Mobile CTA height/width.
Whether advisor portrait remains left-aligned or moves above text.
11. Semantic HTML and Accessibility
Recommended structure
Landmark: section containing one form region and one informational aside/region.
Heading hierarchy: card headings should use an appropriate heading level based on surrounding page hierarchy; exact level UNKNOWN.
Interactive elements: semantic input, select, textarea, checkbox, link and button elements.
Image semantics: advisor portrait needs purposeful alt only if it conveys meaningful identity/content; otherwise empty alt.
Keyboard behavior: every form control and actionable contact/link must be reachable in logical visual order.
Focus visibility: explicit high-contrast focus indicator required.
Contrast risks: blue-on-pale-blue secondary copy and placeholder text must be checked against WCAG contrast requirements.
Screen-reader-only content required: UNKNOWN; may be needed for validation/error messages once behavior is specified.
Form labels, if applicable: all visible labels must be programmatically associated with their controls; required state must not rely solely on red *.
Accessibility constraints
Use semantic HTML; do not use clickable div elements.
All interactive elements require visible keyboard focus.
Decorative images must use empty alt text; informative images require purposeful alt text.
Do not use OCR-derived text as alt text unless it describes the image accurately.
Consent checkbox and privacy-policy link must remain separately keyboard operable where applicable.
Form errors, if later implemented, must be programmatically associated with affected controls.
12. Implementation Constraints
Use existing semantic design tokens if the codebase provides them.
Do not hard-code colors, arbitrary spacing, font sizes, radius, shadows, or image URLs when a project token/asset exists.
Do not invent missing UI states.
Keep section-specific styles scoped to this section.
Build reusable primitives only where repeated evidence exists.
Preserve copy exactly as recorded in the OCR inventory unless a product owner provides corrected copy.
If an item is marked UNKNOWN, stop and request clarification rather than silently deciding.
Do not infer DOM structure, component props, API behavior or interactions solely from the bitmap.
Exact font family must come from the existing project/Figma rather than visual guessing.
Existing form primitives should be reused only if they can reproduce the screenshot geometry closely.
13. Visual Acceptance Criteria

The implementation is acceptable only if screenshot comparison at the target desktop viewport confirms:

 Section boundary matches the reference screenshot.
 Container alignment and horizontal gutters match.
 Column proportions and major whitespace match.
 Both primary cards align at top and bottom.
 Left card remains visibly wider than right card.
 All OCR-confirmed copy matches exactly.
 Heading hierarchy, line breaks, and visual weight match as closely as available evidence permits.
 First two form rows use the same paired-field geometry as the screenshot.
 Branch select, textarea, consent and CTA match the screenshot width/alignment.
 Primary CTA position, dimensions, gradient, radius, icon and label match.
 Doctor portrait uses the correct circular crop and placement.
 Advisor and trust callout dimensions, borders and pale-blue surfaces match.
 Four contact rows preserve icon/label/value alignment and separators.
 Images/assets use the correct crop, aspect ratio, and object position.
 Background, borders, radius, and shadows match.
 No unsupported UI, text, asset, or interaction has been invented.
 All unresolved items are still listed under Open Questions.
14. Visual Risks
Risk	Why it affects fidelity	Mitigation	Priority
Original font family unavailable	Text width, line wrapping and vertical rhythm may diverge	Retrieve typography token/font from project or Figma	High
Doctor portrait asset unavailable	Generic replacement will materially change screenshot match	Export exact portrait asset	High
Exact colors unavailable	CTA gradient, navy text and pale-blue surfaces are visually prominent	Sample from design source/project tokens before final comparison	Medium
Exact container/card dimensions inferred	Small width differences alter form and paragraph wrapping	Calibrate against 1316 × 581 reference screenshot	High
Main identity says Homepage Hero while screenshot depicts consultation UI	May cause incorrect placement/component naming	Confirm whether fixed ID/name intentionally map to this section	High
Icon set unknown	Stroke weight/shape may visibly differ	Locate exact existing project/Figma icons	Medium
Form control browser defaults	Native select/input appearance can diverge significantly	Use existing project form primitives and match screenshot states	Medium
Unknown responsive design	Desktop reconstruction cannot establish mobile fidelity	Obtain tablet/mobile references before claiming responsive match	Medium
Contact behavior unknown	Styling may accidentally imply unsupported links/actions	Keep behavior configurable and obtain product confirmation	Low
15. Open Questions
ID	Question	Blocking level	Suggested owner
Q1	SECTION_ID=home-hero và SECTION_NAME=Homepage Hero có chủ ý cho UI đặt lịch/tư vấn trong screenshot hay cần đổi identity?	Blocking	Designer / Product
Q2	Font family, exact weights và typography tokens là gì?	Blocking	Designer / Developer
Q3	Có thể cung cấp asset portrait bác sĩ gốc không?	Blocking	Designer
Q4	Bộ icon chính xác cho CTA, Hotline, Zalo, WhatsApp, Email và shield nằm ở đâu?	Blocking	Designer / Developer
Q5	Exact design tokens cho blue CTA/links, navy text, border và pale-blue surfaces là gì?	Non-blocking	Designer / Developer
Q6	Các option còn lại của Dịch vụ quan tâm là gì?	Blocking for functional form	Product
Q7	Các option còn lại của Chọn cơ sở là gì?	Blocking for functional form	Product
Q8	Chính sách bảo mật dẫn tới URL nào?	Blocking for production behavior	Product
Q9	Submit form gửi dữ liệu tới đâu và validation rules là gì?	Blocking for production behavior	Product / Developer
Q10	Hotline, Zalo OA, WhatsApp và Email có phải clickable actions không? Nếu có, destination/protocol chính xác là gì?	Blocking for production behavior	Product
Q11	Có tablet/mobile design reference không?	Blocking for responsive fidelity	Designer
Q12	Required/error/success/disabled/loading states của form được thiết kế như thế nào?	Blocking for complete interaction	Designer / Product
Q13	CTA gradient có token/definition chính xác nào trong design system không?	Non-blocking	Designer / Developer
16. Handoff Summary
Safe to implement now
Desktop two-card composition at the supplied screenshot viewport.
Relative left/right column hierarchy.
Form field grouping and visual ordering.
Advisor callout composition.
Four-row contact list composition.
Trust/security callout composition.
All high-confidence OCR copy recorded above.
Default unchecked consent state.
Default visible values Tư vấn cấy ghép Implant and Smilux - Phú Nhuận.
Requires asset export
Exact doctor/advisor portrait.
Exact CTA icon.
Exact Hotline/Zalo/WhatsApp/Email icons if not already available in project assets.
Exact shield/check icon if not already available.
Requires design/product decision
Identity mismatch between Homepage Hero and screenshot content.
Font and design tokens.
Exact responsive behavior.
Select option datasets.
Form validation/submission behavior.
Privacy-policy destination.
Contact-row destinations.
Hover, focus, error, loading, disabled and success designs.
Do not assume
API or CRM integration.
Form validation rules beyond visible required markers.
Exact responsive breakpoints.
Mobile/tablet layout.
Contact rows are clickable.
Privacy-policy URL.
Hidden select options.
Doctor identity.
Hover or animation behavior.
Exact font family.
Exact HEX colors.
DOM/component architecture beyond the implementation recommendations above
