import React, { createContext, useState } from "react";

interface NotificationContextObject {
  notification: string;
  setNotification: React.Dispatch<React.SetStateAction<string>>;
}

export const NotificationContext = createContext<NotificationContextObject>({
  notification: "",
  setNotification: () => {},
});

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState("");

  return (
    <NotificationContext
      value={{
        notification,
        setNotification,
      }}
    >
      {children}
    </NotificationContext>
  );
}
