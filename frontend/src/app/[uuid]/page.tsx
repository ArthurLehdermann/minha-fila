import { redirect } from 'next/navigation'

export default function RedirectPage({ params }: { params: { uuid: string } }) {
  // Simple redirect from /[uuid] to /fila/[uuid]
  redirect(`/fila/${params.uuid}`)
}
