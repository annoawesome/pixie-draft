import { useEffect } from "react";

export default function DocumentTitleRef({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <></>;
}
