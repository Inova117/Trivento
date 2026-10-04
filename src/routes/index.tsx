import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { contactSchema, submitContact } from "@/lib/contact.functions";
import { financing, places, typologies } from "@/lib/trivento-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trivento | Vive entre los valles" },
      { name: "description", content: "Departamentos con vista a los valles en San Martín Bolívar, junto a la UIDE." },
      { property: "og:title", content: "Trivento | Vive entre los valles" },
      { property: "og:description", content: "Arquitectura contemporánea y espacios para vivir frente a los valles de Quito." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const interiors = [
  { src: "/renders/trivento-interior-tv.jpeg", alt: "Sala y comedor de un departamento Trivento" },
  { src: "/renders/trivento-interior-isla.jpeg", alt: "Cocina con isla y ventanal panorámico" },
  { src: "/renders/trivento-interior-sala.jpeg", alt: "Sala cálida con cocina integrada" },
  { src: "/renders/trivento-interior-ventanal.jpeg", alt: "Sala comedor iluminada por un gran ventanal" },
  { src: "/renders/trivento-interior-comedor.jpeg", alt: "Comedor y cocina de acabados claros" },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        node.dataset["visible"] = "true";
        observer.disconnect();
      }
    }, { threshold: 0.14 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a href="#inicio" aria-label="Ir al inicio" className="inline-flex items-center gap-3">
      <span className={`grid size-9 place-items-center rounded-full border ${light ? "border-background/55" : "border-accent"}`}>
        <span className="text-lg leading-none">✣</span>
      </span>
      <span className="text-[0.78rem] font-semibold uppercase tracking-[0.34em]">Trivento</span>
    </a>
  );
}

function Index() {
  const sendContact = useServerFn(submitContact);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form));
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Revisa los datos ingresados.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      await sendContact({ data: parsed.data });
      form.reset();
      const text = [
        "Hola, quiero agendar una visita a Trivento.",
        `Nombre: ${parsed.data.name}`,
        `WhatsApp: ${parsed.data.whatsapp}`,
        `Correo: ${parsed.data.email}`,
        `Me interesa: ${parsed.data.propertyType}`,
      ].join("\n");
      setWhatsappUrl(`https://wa.me/593999011888?text=${encodeURIComponent(text)}`);
      setStatus("success");
      setMessage("Gracias. Recibimos tus datos y pronto nos pondremos en contacto.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No pudimos enviar tu solicitud.");
    }
  }

  return (
    <main className="overflow-clip bg-background text-foreground">
      <section id="inicio" className="relative flex min-h-[92svh] flex-col justify-between overflow-hidden px-5 pb-8 pt-5 sm:px-8 lg:min-h-[96svh] lg:px-12 lg:pb-12">
        <img src={"/renders/trivento-fachada.jpeg"} alt="Fachada contemporánea del proyecto Trivento" className="parallax-image absolute inset-0 h-[112%] w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <nav className="relative z-10 flex items-center justify-between text-background">
          <BrandMark light />
          <a href="#visita" className="group inline-flex items-center gap-2 border-b border-background/60 pb-1 text-xs font-semibold uppercase tracking-[0.14em]">
            Agendar visita <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </nav>
        <div className="relative z-10 max-w-7xl text-background">
          <div className="grid items-end gap-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <h1 className="font-display text-[clamp(5rem,16vw,13rem)] font-normal leading-[0.72]">Trivento</h1>
            <p className="max-w-[32ch] border-l border-background/45 pl-5 text-base leading-relaxed sm:text-lg">
              La arquitectura del silencio frente a la majestuosidad de los valles.
            </p>
          </div>
          <div className="mt-9 flex items-center justify-between border-t border-background/35 pt-4 text-[0.68rem] font-semibold uppercase tracking-[0.16em] sm:text-xs">
            <span>San Martín Bolívar</span><span>Junto a la UIDE</span>
          </div>
        </div>
        <a href="#concepto" aria-label="Descubrir el proyecto" className="absolute bottom-8 right-1/2 z-10 hidden translate-x-1/2 text-background lg:block">
          <ArrowDown className="size-5 animate-bounce" />
        </a>
      </section>

      <section id="concepto" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <Reveal className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7 lg:pt-8">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">01 — El proyecto</p>
            <h2 className="max-w-3xl font-display text-5xl font-normal leading-[0.97] sm:text-6xl lg:text-7xl">Un hogar diseñado para contemplar el paso del tiempo</h2>
            <p className="mt-9 max-w-xl text-base leading-8 text-muted-foreground">Trivento emerge como un diálogo entre la modernidad y el entorno natural. Cada espacio ha sido concebido bajo una premisa de lujo sereno, luz abierta y respeto por el paisaje.</p>
          </div>
          <div className="overflow-hidden lg:col-span-5">
            <img src={"/renders/trivento-vista.jpeg"} alt="Terraza de Trivento con vista panorámica a los valles" className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.025]" loading="lazy" />
          </div>
        </Reveal>
      </section>

      <section className="bg-primary px-5 py-24 text-primary-foreground sm:px-8 lg:px-12 lg:py-32">
        <Reveal className="mx-auto max-w-7xl">
          <p className="mb-10 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/60">A diez minutos de todo</p>
          <div className="grid divide-y divide-primary-foreground/15 md:grid-cols-3 md:divide-x md:divide-y-0">
            {places.map((place, index) => (
              <div key={place} className={`py-10 md:px-10 ${index === 0 ? "md:pl-0" : ""}`}>
              <span className="block font-display text-[8rem] leading-none text-accent lg:text-[10rem]">15</span>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <span className="text-xs uppercase tracking-[0.2em]">{place}</span><span className="text-xs text-primary-foreground/50">min</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-card px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <Reveal className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
            <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">04 — Interiores</p><h2 className="font-display text-5xl sm:text-7xl">Luz, calma y amplitud</h2></div>
            <p className="max-w-lg leading-7 text-muted-foreground lg:justify-self-end">Ambientes integrados, materiales cálidos y grandes ventanales componen una vida cotidiana abierta al paisaje.</p>
          </div>
          <div className="grid auto-rows-[18rem] gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[22rem]">
            {interiors.map((image, index) => (
              <figure key={image.src} className={`group overflow-hidden ${index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : index === 2 ? "lg:col-span-5" : index === 3 ? "lg:col-span-7" : "sm:col-span-2 lg:col-span-12"}`}>
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" loading="lazy" />
              </figure>
            ))}
          </div>
          <p className="mt-4 text-right text-xs text-muted-foreground">Imágenes referenciales</p>
        </Reveal>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <Reveal className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-7 lg:grid-cols-2 lg:items-end"><div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">05 — Tipologías</p><h2 className="font-display text-5xl sm:text-7xl">Cinco formas de vivir Trivento</h2></div><p className="max-w-md leading-7 text-muted-foreground lg:justify-self-end">Departamentos de uno, dos y tres dormitorios, pensados para vivir o invertir.</p></div>
          <div className="border-t border-foreground/25">
            {typologies.map((item) => <div key={item.type} className="grid gap-4 border-b border-foreground/20 py-7 sm:grid-cols-[8rem_1fr_1fr] sm:items-center lg:grid-cols-[10rem_1.2fr_1fr_1fr_1fr]"><span className="font-display text-3xl">{item.type}</span><span>{item.bedrooms}</span><span className="text-muted-foreground">{item.area}</span><span><small className="block text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">Total con parqueadero</small>{item.price}</span><span><small className="block text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">Cuota mensual sin entradas</small>{item.payment}</span></div>)}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Valores e imágenes referenciales según la presentación comercial del proyecto.</p>
          <div className="mt-16 grid gap-7 sm:grid-cols-2">
            {[{ src: "/renders/trivento-planta-1.jpeg", alt: "Planta de departamento de un dormitorio con balcón" }, { src: "/renders/trivento-planta-2.jpeg", alt: "Planta de departamento de un dormitorio con cocina abierta" }].map((planta) => (
              <figure key={planta.src} className="group">
                <div className="overflow-hidden bg-card"><img src={planta.src} alt={planta.alt} className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" /></div>
                <figcaption className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">Planta referencial · 1 dormitorio</figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="relative min-h-[72svh] overflow-hidden">
        <img src={"/renders/trivento-fachada-atardecer.jpeg"} alt="Fachada completa de Trivento al atardecer" className="parallax-image absolute inset-0 h-[115%] w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gallery-overlay" />
        <Reveal className="relative z-10 mx-auto flex min-h-[72svh] max-w-7xl items-end px-5 pb-14 text-background sm:px-8 lg:px-12 lg:pb-20"><div className="max-w-2xl"><p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-background/70">06 — Ubicación</p><h2 className="font-display text-5xl leading-none sm:text-7xl">Naturaleza, a minutos de todo.</h2><p className="mt-6 text-sm uppercase tracking-[0.14em]">Av. Simón Bolívar, junto a la UIDE</p></div></Reveal>
      </section>

      <section className="bg-primary px-5 py-24 text-primary-foreground sm:px-8 lg:px-12 lg:py-32">
        <Reveal className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">07 — Financiamiento</p><h2 className="font-display text-5xl sm:text-7xl">Una forma de pago pensada para avanzar</h2><p className="mt-8 text-lg text-primary-foreground/75">Cuota del crédito desde <strong className="font-medium text-accent">{financing.creditFrom}</strong>.</p></div>
          <div className="grid gap-px bg-primary-foreground/20 sm:grid-cols-2"><div className="bg-secondary p-8 lg:p-10"><span className="font-display text-7xl text-primary-foreground">{financing.downPayment}</span><h3 className="mt-4 font-display text-3xl">Entrada</h3><p className="mt-3 text-primary-foreground/70">{financing.downPaymentTerms}</p></div><div className="bg-card p-8 text-foreground lg:p-10"><span className="font-display text-7xl text-accent">{financing.credit}</span><h3 className="mt-4 font-display text-3xl">Crédito</h3><p className="mt-3 text-muted-foreground">{financing.creditTerms}</p></div></div>
        </Reveal>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-7xl space-y-24 lg:space-y-36">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="overflow-hidden lg:col-span-8"><img src={"/renders/trivento-fogata.jpeg"} alt="Área social exterior con fogata y vegetación" className="aspect-[16/10] w-full object-cover transition-transform duration-700 hover:scale-[1.025]" loading="lazy" /></div>
            <div className="lg:col-span-4 lg:pl-8"><p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">02 — Encuentro</p><h3 className="font-display text-5xl">Social rooftop</h3><p className="mt-6 max-w-sm leading-7 text-muted-foreground">Espacios diseñados para compartir, donde la fogata, la madera y la vista se convierten en protagonistas.</p></div>
          </Reveal>
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="order-2 lg:order-1 lg:col-span-4"><p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">03 — Experiencia</p><h3 className="font-display text-5xl">Cocina exterior</h3><p className="mt-6 max-w-sm leading-7 text-muted-foreground">Una cocina abierta y generosa para que cada encuentro suceda en contacto con el paisaje.</p></div>
            <div className="order-1 overflow-hidden lg:order-2 lg:col-span-8"><img src={"/renders/trivento-cocina.jpeg"} alt="Cocina exterior y comedor de Trivento" className="aspect-[16/10] w-full object-cover transition-transform duration-700 hover:scale-[1.025]" loading="lazy" /></div>
          </Reveal>
        </div>
      </section>

      <section className="relative min-h-[70svh] overflow-hidden">
        <img src={"/renders/trivento-terraza.jpeg"} alt="Terraza social rodeada de vegetación" className="parallax-image absolute inset-0 h-[115%] w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gallery-overlay" />
        <Reveal className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl items-end px-5 pb-14 text-background sm:px-8 lg:px-12 lg:pb-20">
          <div className="max-w-2xl"><p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-background/70">Vive entre los valles</p><h2 className="font-display text-5xl leading-none sm:text-7xl">El exterior también es parte de tu hogar.</h2></div>
        </Reveal>
      </section>

      <section id="visita" className="bg-secondary px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <Reveal className="mx-auto max-w-4xl border-t border-foreground/40 bg-card px-6 py-12 shadow-form sm:px-10 lg:px-16 lg:py-16">
          {status === "success" ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center" role="status">
              <span className="mb-6 grid size-14 place-items-center rounded-full border border-accent text-accent"><Check className="size-6" /></span>
              <h2 className="font-display text-5xl">Tu visita comienza aquí</h2>
              <p className="mt-5 max-w-lg leading-7 text-muted-foreground">{message}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex h-13 items-center justify-center gap-2 bg-primary px-8 text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-secondary">
                Enviar datos por WhatsApp <ArrowUpRight className="size-4" />
              </a>
              <Button type="button" variant="ghost" className="mt-4" onClick={() => setStatus("idle")}>Enviar otra solicitud</Button>
            </div>
          ) : (
            <>
              <div className="mb-12 text-center"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Agenda tu visita</p><h2 className="font-display text-5xl sm:text-6xl">Conoce Trivento</h2><p className="mx-auto mt-5 max-w-lg leading-7 text-muted-foreground">Déjanos tus datos y nos pondremos en contacto contigo por WhatsApp.</p></div>
              <form onSubmit={handleSubmit} className="grid gap-x-8 gap-y-7 md:grid-cols-2" noValidate>
                <Field label="Nombre completo" name="name" type="text" placeholder="María Andrade" autoComplete="name" />
                <Field label="WhatsApp" name="whatsapp" type="tel" placeholder="099 123 4567" autoComplete="tel" />
                <Field label="Correo electrónico" name="email" type="email" placeholder="maria@correo.com" autoComplete="email" />
                <label className="flex flex-col gap-2 text-sm"><span>Me interesa</span><span className="relative"><select name="propertyType" defaultValue="2 dormitorios" className="h-13 w-full appearance-none border border-input bg-card px-4 pr-10 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"><option>1 dormitorio</option><option>2 dormitorios</option><option>3 dormitorios</option></select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2" /></span></label>
                <div className="mt-3 md:col-span-2"><Button type="submit" disabled={status === "sending"} className="group w-full">{status === "sending" ? "Enviando…" : <>Quiero conocer Trivento <ArrowUpRight className="ml-2 size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></>}</Button>{message && status === "error" && <p role="alert" className="mt-4 text-center text-sm text-destructive">{message}</p>}<p className="mt-5 text-center text-xs leading-5 text-muted-foreground">Tus datos se usarán únicamente para atender tu solicitud.</p></div>
              </form>
            </>
          )}
        </Reveal>
      </section>

      <footer className="bg-primary px-5 py-10 text-primary-foreground sm:px-8 lg:px-12"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center"><BrandMark light /><p className="text-xs uppercase tracking-[0.14em] text-primary-foreground/60">San Martín Bolívar · Quito, Ecuador</p></div></footer>
    </main>
  );
}

function Field(props: { label: string; name: string; type: string; placeholder: string; autoComplete: string }) {
  return <label className="flex flex-col gap-2 text-sm"><span>{props.label}</span><input {...props} required className="h-13 border border-input bg-card px-4 outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-1 focus:ring-accent" /></label>;
}