import React, { useEffect, useRef } from "react";

export default function Dialog({
  showDialog,
  children,
}: {
  className: string;

  showDialog: boolean;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (!dialogElement) {
      return;
    }

    if (showDialog) {
      dialogElement.showModal();
    } else {
      dialogElement.close();
    }
  }, [showDialog]);
  return <dialog ref={dialogRef}>{children}</dialog>;
}
