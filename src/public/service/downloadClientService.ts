export function downloadFromUrl(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "";

  document.body.append(anchor);
  anchor.click();
}
