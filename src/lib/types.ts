export type PrototypeStatus = "in-progress" | "complete" | "archived";

export interface PrototypeMeta {
  title: string;
  description: string;
  author: string;
  date: string;
  tags?: string[];
  status?: PrototypeStatus;
  thumbnail?: string;
}

export interface Prototype {
  meta: PrototypeMeta;
  designer: string;
  slug: string;
  path: string;
  type: "local";
}
