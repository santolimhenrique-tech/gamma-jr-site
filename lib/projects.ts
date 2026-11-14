/**
 * Projetos exibidos na seção "Nossos projetos". A seção mostra apenas SITES,
 * o serviço principal da Gamma Jr.
 * TODOS os itens abaixo são placeholders [PREENCHER] — substituir por cases reais.
 *
 * - image: caminho em /public (ex.: "/projetos/nome.jpg"), proporção 4:3.
 *   Sem imagem, a prévia mostra um placeholder marcado.
 * - href: link do site publicado (opcional). Sem link, a linha não é clicável.
 */

export type Project = {
  name: string;
  client: string;
  type: string;
  year: string;
  image?: string;
  href?: string;
};

export const projects: Project[] = [
  {
    name: "[PREENCHER] Nome do site",
    client: "[PREENCHER] Cliente",
    type: "Site institucional",
    year: "[ANO]",
  },
  {
    name: "[PREENCHER] Nome do site",
    client: "[PREENCHER] Cliente",
    type: "Site institucional",
    year: "[ANO]",
  },
  {
    name: "[PREENCHER] Nome do site",
    client: "[PREENCHER] Cliente",
    type: "Site institucional",
    year: "[ANO]",
  },
];

// [PREENCHER] link do portfólio completo (o kit menciona um "Nosso portfólio").
export const portfolioUrl = "#";
