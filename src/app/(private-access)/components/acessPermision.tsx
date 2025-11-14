"use client";

import { useAccessControl } from "@/app/context/AcessControl";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
};

export default function AccessWrapper({
  children,
  allowedRoles,
  fallback = null,
  loadingComponent = null,
}: Props) {
  const { role } = useAccessControl();

  // Se ainda estiver carregando o role (caso role seja undefined)
  if (role === undefined) {
    return <>{loadingComponent}</>;
  }

  // Se não tiver role (usuário não autenticado ou sem perfil)
  if (role === null) {
    return <>{fallback}</>;
  }

  // Se permitido
  if (!allowedRoles || allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  // Não permitido
  return <>{fallback}</>;
}
