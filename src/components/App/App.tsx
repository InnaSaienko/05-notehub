import css from "./App.module.css";
import {useState} from "react";
import SearchBox from "../SearchBox/SearchBox.tsx";
import {useDebouncedCallback} from "use-debounce";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {fetchNotes} from "../../services/noteService.ts";
import Loader from "../Loader/Loader.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import NoteList from "../NoteList/NoteList.tsx";
import Modal from "../Modal/Modal.tsx";
import NoteForm from "../NoteForm/NoteForm.tsx";
import Pagination from "../Pagination/Pagination.tsx";

const PER_PAGE = 12;
const App = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {data, isLoading, isError} = useQuery({
        queryKey: ['notes', page, search],
        queryFn: () => fetchNotes({page, perPage: PER_PAGE, search}),
        placeholderData: keepPreviousData,
    });

    const handleSearch = useDebouncedCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, 500);

    const notes = data?.notes ?? [];
    const totalPages = data?.totalPages ?? 1;


    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onSearch={handleSearch}/>
                {totalPages > 1 && <Pagination/>}
                <button className={css.button} onClick={() => setIsModalOpen(true)}>
                    Create note +
                </button>
            </header>
            <main className={css.main}>
                {isLoading && (
                    <div className={css.loaderWrapper}>
                        <Loader/>
                    </div>
                )}
                {isError && (
                    <ErrorMessage message="Something went wrong while fetching notes. Please try again later."/>
                )}
                {!isLoading && !isError && notes.length === 0 && <p className={css.empty}>No notes found.</p>}
                {!isLoading && !isError && <NoteList notes={notes}/>}
            </main>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm/>
                </Modal>
            )}
        </div>
    );
};

export default App;
