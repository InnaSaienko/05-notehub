// General interfaces related to the Note entity

export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag?: string;
}

export type NoteFormData = Omit<Note, "id"| "createdAt" | "updatedAt" >

export interface NoteSearchParams {
  search?: string;
  tagIds?: string[];
}
