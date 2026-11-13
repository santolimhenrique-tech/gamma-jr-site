/**
 * Projetos exibidos na seção "Projetos".
 * TODOS os itens abaixo são placeholders [PREENCHER] — substituir por cases reais.
 *
 * - image: caminho em /public (ex.: "/projetos/nome.jpg"), proporção 4:3.
 *   Sem imagem, a prévia mostra um placeholder marcado.
 * - href: link do projeto/case (opcional). Sem link, a linha não é clicável.
 */

export type ProjectCategory =
  | "Site institucional"
  | "Dashboard Power BI"
  | "Identidade visual"
  | "Capacitação";

export type Project = {
  name: string;
  client: string;
  category: ProjectCategory;
  year: string;
  image?: string;
  href?: string;
};

export const projects: Project[] = [
  {
    name: "[PREENCHER] Nome do projeto",
    client: "[PREENCHER] Cliente",
    category: "Site institucional",
    year: "[ANO]",
  },
  {
    name: "[PREENCHER] Nome do projeto",
    client: "[PREENCHER] Cliente",
    category: "Dashboard Power BI",
    year: "[ANO]",
  },
  {
    name: "[PREENCHER] Nome do projeto",
    client: "[PREENCHER] Cliente",
    category: "Identidade visual",
    year: "[ANO]",
  },
];

// [PREENCHER] link do portfólio completo (o kit menciona um "Nosso portfólio").
export const portfolioUrl = "#";
