import ReactPaginateImport from "react-paginate";
import css from "./Pagination.module.css";

// react-paginate's UMD bundle double-wraps its default export under this bundler's CJS interop.
const ReactPaginate =
    (ReactPaginateImport as unknown as { default?: typeof ReactPaginateImport }).default ?? ReactPaginateImport;


interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
};

export default Pagination;
