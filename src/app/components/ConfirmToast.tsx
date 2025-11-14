// components/ConfirmToast.tsx
import React from "react";
import { toast, Id } from "react-toastify";

interface ConfirmToastProps {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  toastId: Id;
}

export const ConfirmToast: React.FC<ConfirmToastProps> = ({
  message,
  onConfirm,
  onCancel,
  toastId,
}) => {
  return (
    <div>
      <p>{message}</p>
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => {
            onConfirm();
            toast.dismiss(toastId);
          }}
        >
          Confirmar
        </button>
        <button
          onClick={() => {
            onCancel?.();
            toast.dismiss(toastId);
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
