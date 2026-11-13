import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        {/* A hero é sticky: a seção seguinte (About) desliza por cima dela.
            Mantenha About como irmã imediata da Hero. */}
        <Hero />
        <About />
        <Services />
        <Process />
        <Projects />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
