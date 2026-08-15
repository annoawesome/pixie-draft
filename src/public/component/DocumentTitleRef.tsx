import { useEffect } from "react";

/**
 * Does not actually return a populated React node,
 * but does update the document title to match the state.
 */
export default function DocumentTitleRef({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <></>;
}
