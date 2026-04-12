import { redirect } from 'next/navigation';

interface Props {
  params: {
    uuid: string;
  };
}

/**
 * Root-level catch-all redirect for company queue views.
 * Redirects https://minha-fila.meugarcom.app/{uuid} -> /filas/{uuid}
 */
export default async function RedirectPage({ params }: Props) {
  const { uuid } = await params;
  redirect(`/filas/${uuid}`);
}
