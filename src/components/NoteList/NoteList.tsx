import type {Note} from "../../types/note.ts";
import css from "./NoteList.module.css"
import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteNote} from "../../services/noteService.ts";

interface NoteListProps {
    notes: Note[];
}
const NoteList = ({notes}: NoteListProps) => {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const deleteNoteMutation = useMutation({
        mutationFn: deleteNote,
        onMutate: (id: string) => setDeletingId(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
        onSettled: () => {
            setDeletingId(null);
        },
    });

    return <ul className={css.list}>
        {notes.map(note => (
            <li key={note.id} className={css.listItem}>
                <h2 className={css.title}>{note.title}</h2>
                <p className={css.content}>{note.content}</p>
                <div className={css.footer}>
                    <span className={css.tag}>{note.tag}</span>
                    <button className={css.button}
                            disabled={deletingId === note.id}
                            onClick={() => deleteNoteMutation.mutate(note.id)}
                    >
                        Delete
                    </button>
                </div>
            </li>
        ))}
    </ul>
        ;
};

export default NoteList;
