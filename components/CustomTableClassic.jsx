import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
} from "@nextui-org/react";
import PropTypes from "prop-types";

export default function CustomTableClassic({
  columns,
  data,
  renderFunction,
  rowsPerPage = 10,
  searchInColumn = false,
  defaultColumn = 0,
}) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const defaultColumnIndex = columns[defaultColumn].key;
  const [selectedColumn, setSelectedColumn] = useState(defaultColumnIndex);

  useEffect(() => {
    setPage(1); // รีเซ็ตไปที่หน้าแรกทุกครั้งเมื่อมีการเปลี่ยนแปลง searchQuery หรือ selectedColumn
  }, [searchQuery, selectedColumn]);



  if (!renderFunction) {
    renderFunction = (item, key) => {
      return item[key];
    };
  }

  // กรองข้อมูลตามการค้นหา
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    if (searchInColumn) {
      return data.filter((item) =>
        item[selectedColumn]
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    } else {
      return data.filter((item) =>
        columns.some((column) =>
          item[column.key]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, selectedColumn, data, searchInColumn, columns]);

  // คำนวณจำนวนหน้าทั้งหมด
  const pages = useMemo(
    () => Math.ceil(filteredData.length / rowsPerPage),
    [filteredData.length, rowsPerPage]
  );

  // Slice data ให้ตรงกับหน้าปัจจุบัน
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [page, filteredData, rowsPerPage]);

  return (
    <div>
      {/* Search and Column Select */}
      <div className="flex justify-between items-center mb-4 w-full md:w-1/4">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          endContent={
            <div className="flex items-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-default-400 hover:text-default-600"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              {searchInColumn && (
                <div className="flex items-center">
                  <label className="sr-only" htmlFor="column">
                    Search in column
                  </label>
                  <select
                    id="column"
                    name="column"
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                    className="outline-none border-0 bg-transparent text-default-400 text-small"
                  >
                    {columns.map((column) => (
                      <option key={column.key} value={column.key}>
                        {column.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          }
        />
      </div>

      <Table isCompact aria-label="Custom table with pagination">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align={column.align || "start"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={paginatedData}>
          {(item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {renderFunction(item, column.key)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-small text-default-400 hidden md:block">
          Total {paginatedData.length} of {filteredData.length} items
        </span>
        <Pagination
          isCompact
          total={pages}
          page={page}
          onChange={setPage}
          showControls
          color="default"
        />
      </div>
    </div>
  );
}

CustomTableClassic.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  renderFunction: PropTypes.func,
  rowsPerPage: PropTypes.number,
  searchInColumn: PropTypes.bool,
  defaultColumn: PropTypes.string,
};
