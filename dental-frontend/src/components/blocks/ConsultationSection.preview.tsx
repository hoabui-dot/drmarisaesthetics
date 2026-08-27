import { ConsultationSection } from "./ConsultationSection";

export function ConsultationSectionPreview() {
  return <ConsultationSection data={{
    blockType: "consultation",
    id: 0,
    title: "Book a Consultation",
    formHeading: "Book a Consultation",
    clinicEyebrow: "SMILUX DENTAL CLINIC",
    contactHeading: "Consult With Our Experts",
    description: "Our team of experienced dentists uses advanced technology and a personalized approach to deliver safe, effective, and beautiful results for every patient.",
    address: "233 – 233A Nguyễn Trọng Tuyển, Phường Phú Nhuận, TP. Hồ Chí Minh, Việt Nam",
    phone: "0866 251 379",
    openingHours: "Mon - Sat: 8:00 AM - 7:00 PM",
    internationalPatients: "We provide consultation support in English and flexible scheduling for overseas patients.",
    submitLabel: "REQUEST CONSULTATION",
    serviceOptions: [{ value: "general-consultation", label: "General Consultation" }],
  }} />;
}
