import React, { ChangeEvent } from "react";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { FormSelect } from "../../base-components/Form";

interface PaginationProps {
  darkMode: boolean;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  itemsPerPage: number;
  itemsPerPageOptions: number[];
  handlePageChange: (pageNumber: number) => Promise<void>;
  handleItemsPerPageChange: (
    event: ChangeEvent<HTMLSelectElement>
  ) => Promise<void>;
}

const CustomPagination: React.FC<PaginationProps> = ({
  darkMode,
  currentPage,
  totalPages,
  totalRecords,
  itemsPerPage,
  itemsPerPageOptions,
  handlePageChange,
  handleItemsPerPageChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between col-span-12 mt-5 gap-5 intro-y sm:flex-row mb-10">
      <div className="w-full sm:w-auto flex flex-wrap gap-2 sm:gap-5 sm:mr-auto">
        <Button
          variant={darkMode ? "outline-secondary" : "soft-secondary"}
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <Lucide icon="ChevronsLeft" className="w-4 h-4" />
        </Button>
        {/* Previous page link */}
        {currentPage > 1 && (
          <Button
            variant={darkMode ? "outline-secondary" : "soft-secondary"}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <Lucide icon="ChevronLeft" className="w-4 h-4" />
          </Button>
        )}

        {/* Page numbers */}
        {Array.from({ length: totalPages }).map((_, index) => {
          const currentPageNumber = index + 1;

          // Determine if this page number should be displayed
          const shouldDisplay =
            currentPageNumber <= 2 || // Display the first 2 pages
            currentPageNumber > totalPages - 2 || // Display the last 2 pages
            (currentPageNumber >= currentPage - 1 &&
              currentPageNumber <= currentPage + 1); // Display pages around the current page

          // Render the page number button if it should be displayed
          if (shouldDisplay) {
            return (
              <Button
                key={index}
                variant={darkMode ? "outline-secondary" : "soft-secondary"}
                className={`${
                  currentPageNumber === currentPage
                    ? "!box font-medium dark:bg-darkmode-400"
                    : ""
                } px-[0.9rem] text-xs sm:text-sm`}
                onClick={() => handlePageChange(currentPageNumber)}
              >
                {currentPageNumber}
              </Button>
            );
          }

          // Render '...' for ellipsis
          if (
            (currentPageNumber === 3 && currentPage > 2) ||
            (currentPageNumber === totalPages - 2 &&
              currentPage < totalPages - 1)
          ) {
            return (
              <p key={index} className="mt-1">
                ...
              </p>
            );
          }

          return null; // Don't render anything for other cases
        })}

        {/* Next page link */}
        {currentPage < totalPages && (
          <Button
            variant={darkMode ? "outline-secondary" : "soft-secondary"}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <Lucide icon="ChevronRight" className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant={darkMode ? "outline-secondary" : "soft-secondary"}
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <Lucide icon="ChevronsRight" className="w-4 h-4" />
        </Button>
      </div>
      <h1 className="text-xs sm:text-sm">
        Total Records - <span className="font-semibold">{totalRecords}</span>
      </h1>
      <FormSelect
        className="w-20 !box"
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
        name="lisingPageSelect"
      >
        {itemsPerPageOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </FormSelect>
    </div>
  );
};

export default CustomPagination;
