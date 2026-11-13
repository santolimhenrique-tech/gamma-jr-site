import { Wordmark } from "@/components/brand/Logo";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { navItems, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer data-tone="dark" className="relative z-10 bg-grafite text-creme">
      <div className="container-site grid grid-cols-1 gap-12 pb-10 pt-20 lg:grid-cols-12 lg:gap-x-8 lg:pt-28">
        <div className="lg:col-span-5">
          <a href="#inicio" aria-label="Gamma Jr. Engenharia, voltar ao início" className="inline-block">
            <Wordmark variant="turquesa" alt="" className="h-9 w-auto lg:h-11" />
          </a>
          <p className="mt-6 max-w-[36ch] text-[0.9375rem] leading-relaxed text-areia/65">
            {site.description}
          </p>
        </div>

        <nav aria-label="Rodapé" className="lg:col-span-4 lg:col-start-7">
          <p className="text-label uppercase tracking-[var(--tracking-label)] text-turquesa">Navegação</p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.9375rem]">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-creme/75 transition-colors hover:text-creme">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-2">
          <p className="text-label uppercase tracking-[var(--tracking-label)] text-turquesa">Redes</p>
          <div className="-ml-2.5 mt-3">
            <SocialIcons />
          </div>
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-6 border-t border-creme/10 pt-8 text-[0.8125rem] text-creme/50 sm:flex-row sm:items-center lg:col-span-12 lg:mt-12">
          <p>
            © {year} {site.name} · Empresa Júnior da EEL-USP
          </p>
          <a href="#inicio" className="group inline-flex items-center gap-2 transition-colors hover:text-creme">
            Voltar ao topo
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="size-4 transition-transform duration-300 ease-[var(--ease-expo)] group-hover:-translate-y-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M8 13V3M4 7l4-4 4 4" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
