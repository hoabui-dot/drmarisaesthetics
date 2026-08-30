type ExpectationItem = { step: string; title: string; description: string }

const defaults: ExpectationItem[] = [
  { step: '01', title: 'Send Your Request', description: 'Fill out our detailed form to help us understand your unique aesthetic goals and concerns.' },
  { step: '02', title: 'Speak With Our Team', description: 'Our patient coordinator will contact you to review your request and arrange an appointment.' },
  { step: '03', title: 'Meet Your Doctor', description: 'Enjoy a comprehensive, private consultation with our medical specialists to design your roadmap.' },
]

export function ContactExpectationSection({ data }: { data: { title?: string; items?: ExpectationItem[] } }) {
  const items = data.items?.length ? data.items : defaults
  return <section className="contact-expectation" data-contact-section="expectation" aria-labelledby="contact-expectation-title">
    <h2 id="contact-expectation-title">{data.title || 'What to Expect'}</h2>
    <div className="contact-expectation-grid">{items.map((item) => <article key={item.step}>
      <span>{item.step}</span><h3>{item.title}</h3><p>{item.description}</p>
    </article>)}</div>
  </section>
}
