export type Status = 'done' | 'todo';

export interface Topic {
  section: string;
  slug: string;
  title: string;
  summary: string;
  status: Status;
  complexity: string;
  tags: string[];
  order: number;
  body: string;
}

export interface Section {
  slug: string;
  title: string;
  part: string;
  summary: string;
  order: number;
  topics: Topic[];
}
