// app/[locale]/account/page.tsx
import { redirect } from 'next/navigation'

type Props = { params: { locale: string } }

export default function AccountIndexPage({ params }: Props) {
  redirect(`/${params.locale}/account/overview`)
}
