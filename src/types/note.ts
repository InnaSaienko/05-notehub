// General interfaces related to the Note entity

export interface NoteTag {
  id: string;
  name: string;
  color?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag?: string;
}

export type NoteFormData = Omit<Note, "id" | "createdAt" | "updatedAt" | "tag"> & {
  tags: NoteTag[];
};

export interface NoteSearchParams {
  search?: string;
  tagIds?: string[];
}
