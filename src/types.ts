export type Status = 'done' | 'todo';
/** codigo = biblioteca de implementações; teoria = material de consulta (fórmulas, conceitos, macetes). */
export type Kind = 'codigo' | 'teoria';

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
  kind: Kind;
  summary: string;
  order: number;
  topics: Topic[];
}
