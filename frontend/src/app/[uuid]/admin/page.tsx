import { redirect } from 'next/navigation';

interface Props {
  params: {
    uuid: string;
  };
}

/**
 * Root-level catch-all redirect for company admin panels.
 * Redirects https://minhafila.meugarcom.app/{uuid}/admin -> /fila/{uuid}/admin
 */
export default async function AdminRedirectPage({ params }: Props) {
  const { uuid } = await params;
  redirect(`/fila/${uuid}/admin`);
}
