/**
 * Conteúdo e configuração global do site.
 * Itens marcados com [PREENCHER] precisam de dados reais antes da publicação.
 */

export const site = {
  name: "Gamma Jr. Engenharia",
  shortName: "Gamma Jr.",
  description:
    "Empresa júnior da EEL-USP que desenvolve sites institucionais, dashboards em Power BI, identidade visual e capacitações tecnológicas.",
  // [PREENCHER] domínio definitivo. Pode ser definido via NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "pt_BR",
} as const;

export const navItems = [
  { label: "Quem somos", href: "#quem-somos" },
  { label: "Serviços", href: "#servicos" },
  { label: "Como trabalhamos", href: "#como-trabalhamos" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contato", href: "#contato" },
] as const;

export const services = [
  { index: "01", label: "Sites institucionais" },
  { index: "02", label: "Dashboards Power BI" },
  { index: "03", label: "Identidade visual" },
  { index: "04", label: "Capacitações" },
] as const;

export const contact = {
  // [PREENCHER] e-mail que recebe os contatos do formulário (ex.: contato@dominio.com.br).
  email: "",
  location: "Lorena, SP",
} as const;

export type SocialKind = "instagram" | "linkedin" | "email";

export const socials: { kind: SocialKind; label: string; href: string }[] = [
  { kind: "instagram", label: "Instagram", href: "https://www.instagram.com/gammajrengenharia/" },
  { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/gammajrengenharia/" },
  {
    kind: "email",
    label: contact.email ? `E-mail: ${contact.email}` : "E-mail [PREENCHER]",
    href: contact.email ? `mailto:${contact.email}` : "#",
  },
];
