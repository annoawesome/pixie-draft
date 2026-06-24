import { DiffOp } from "../util/rawDiff";

export interface HistoryNode {
  content: string;
  patch?: DiffOp[];
  treePrev: number;
  attributes: {
    generatedByLlm: boolean;
  };
}

type Story = {
  id: string;
  version: string;
  title: string;
  desc: string;
  tags: string[];
  content: string;

  attributes: Record<string, string>;
  encyclopedia: Record<string, string>;

  time: {
    created: number;
    accessed: number;
    modified: number;
  };

  history: HistoryNode[];
  historyIndex: number;
};

export default Story;

export interface StoryPreview {
  id: string;
  title: string;
  time: {
    created: number;
    accessed: number;
    modified: number;
  };
}
