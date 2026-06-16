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

  history: unknown;
  historyIndex: number;
};

export default Story;
