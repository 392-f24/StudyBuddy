import { useState } from 'react';

const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return { currentData, currentPage, totalPages, handlePageChange };
};

export default usePagination;
