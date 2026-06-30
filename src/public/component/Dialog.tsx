import React, { useEffect, useRef } from "react";

export default function Dialog({
  showDialog,
  setShowDialog,
  children,
}: {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const onCloseDialog = () => setShowDialog(false);

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
  return (
    <dialog ref={dialogRef} onClose={onCloseDialog}>
      {children}
    </dialog>
  );
}
