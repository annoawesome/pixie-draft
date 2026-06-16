type Story = {
  id: string;
  title: string;
  content: string;

  time: {
    created: number;
    accessed: number;
    modified: number;
  };

  history: unknown;
  historyIndex: number;
};

export default Story;
