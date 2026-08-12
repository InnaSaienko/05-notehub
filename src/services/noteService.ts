import axios, {type AxiosResponse, AxiosError} from 'axios';
import type {Note, NoteFormData, NoteSearchParams} from '../types/note';

// API Note type that matches the server response
export interface ApiNote {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    tag?: string;
}

// HTTP Response Interfaces
export interface FetchNotesResponse {
    notes: ApiNote[];
    totalPages: number;
}

export interface CreateNoteResponse {
    data: Note;
    message?: string;
}

export interface DeleteNoteResponse {
    message: string;
    id: string;
    data?: Note;
}

// HTTP Request Parameters Interfaces
export interface FetchNotesParams extends NoteSearchParams {
    page?: number;
    perPage?: number;
    search?: string;
}

export interface CreateNoteParams {
    noteData: NoteFormData;
}

export interface DeleteNoteParams {
    id: string;
}

// Axios Response Types
export type AxiosFetchNotesResponse = AxiosResponse<FetchNotesResponse>;
export type AxiosCreateNoteResponse = AxiosResponse<CreateNoteResponse>;
export type AxiosDeleteNoteResponse = AxiosResponse<DeleteNoteResponse>;

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const notesEndpoint = `${API_BASE_URL}/notes`;
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const notesApi = axios.create({
        baseURL: notesEndpoint,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
);

// HTTP Request Functions
export const fetchNotes = async (
    params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
    try {
        const response: AxiosFetchNotesResponse = await notesApi.get("", {
            params: {
                page: params.page,
                perPage: params.perPage,
                ...(params.search && { search: params.search }),
            },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(
            axiosError.response?.data?.message || axiosError.message || 'Failed to fetch notes'
        );
    }
};

export const createNote = async (
    params: CreateNoteParams
): Promise<CreateNoteResponse> => {
    try {
        const response: AxiosCreateNoteResponse = await axios.post(notesEndpoint, {
            title: params.noteData.title,
            content: params.noteData.content,
            tag: params.noteData.tags[0]?.name,
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(
            axiosError.response?.data?.message || axiosError.message || 'Failed to create note'
        );
    }
};

export const deleteNote = async (
    id: string
): Promise<DeleteNoteResponse> => {
    try {
        const response: AxiosDeleteNoteResponse = await axios.delete(
            `${notesEndpoint}/${id}`
        );
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(
            axiosError.response?.data?.message || axiosError.message || 'Failed to delete note'
        );
    }
};

