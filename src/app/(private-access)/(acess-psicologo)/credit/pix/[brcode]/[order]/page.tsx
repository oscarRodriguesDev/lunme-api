// page.tsx
import PixClient from "../../PixClient"

export default function PixPage({ params }: any) {
  // Aqui usamos `any` só para satisfazer o Next no build
  return <PixClient brcode={params.brcode} />
}
