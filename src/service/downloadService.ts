import fs from "fs";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class DownloadService {
  #ids: Record<string, string> = {};

  public addDownloadId(path: fs.PathLike) {
    const id = crypto.randomUUID();
    this.#ids[id] = path.toString();

    sleep(60 * 1e3).then(() => {
      delete this.#ids[id];
    });

    return id;
  }

  public getFilePath(id: string) {
    return this.#ids[id];
  }
}

export const downloadService = new DownloadService();
