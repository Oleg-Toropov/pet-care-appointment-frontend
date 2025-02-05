import { Pagination } from "react-bootstrap";

const Paginator = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const visiblePages = 5;

  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const generatePageItems = () => {
    let items = [];
    const half = Math.floor(visiblePages / 2);

    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(totalPages, currentPage + half);

    if (endPage - startPage < visiblePages - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + visiblePages - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
      }
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => paginate(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="d-flex justify-content-center">
      <Pagination>
        {totalPages > 1 && (
          <>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              ᐸ
            </Pagination.Prev>
            {generatePageItems()}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              ᐳ
            </Pagination.Next>
          </>
        )}
      </Pagination>
    </div>
  );
};

export default Paginator;
