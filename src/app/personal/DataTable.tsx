"use client"

// Import necessary dependencies and interfaces
import * as React from "react";
import DatePicker from "@/components/ui/datepicker";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Define the data structure interface for the table
interface TableData {
    date: string;
    scrip: string;
    costPrice: number;
    qty: number;
    sellPrice: number;
    pl: number;
}

// Define props interface for DataTable component
interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
}

// DataTable component
export function DataTable({ columns, data }: DataTableProps<TableData>) {
    // State variables
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);
    const [filteredData, setFilteredData] = React.useState<TableData[]>(data); // Initialize with original data
    const [filterValue, setFilterValue] = React.useState<string>(""); // State variable for filter value

    // Handler for filter value change
    const handleFilterValueChange = (value: string | null) => {
        if (value) {
            setFilterValue(value.toLowerCase());
            updateFilteredData();
        } else {
            setFilterValue("");
            setFilteredData(data);
        }
    };

    // Handler for date range change
    const handleDateRangeChange = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);

        // Filter data based on date range
        if (start && end) {
            const filteredData = data.filter((item) => {
                const itemDate = new Date(item.date);
                return itemDate >= start && itemDate <= end;
            });
            // Update table data
            setFilteredData(filteredData);
            setColumnFilters([{ id: "Date", value: [start, end] }]);
        } else {
            // Reset filter if no date range selected
            setFilteredData(data);
            setColumnFilters([]);
        }
    };

    // Filter function
    const filterFn = (row: any, columnFilters: any) => {
        const dateFilter = columnFilters.some((filter: any) => {
            const [start, end] = filter.value as [Date, Date];
            const itemDate = new Date(row.original.date);
            return itemDate >= start && itemDate <= end;
        });

        const textFilter = typeof filterValue === 'string' ? row.original.scrip.toLowerCase().includes(filterValue) : true;

        return dateFilter && textFilter;
    };

    // Update filtered data based on filter value
    const updateFilteredData = () => {
        const filteredData = data.filter((item) =>
            item.scrip.toLowerCase().includes(filterValue)
        );
        setFilteredData(filteredData);
    };

    // React table instance
    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        filterFns: {
            filterFn: (row: any) => filterFn(row, columnFilters),
        },
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div>
            <div className="flex items-center py-4">
                {/* Date picker for filtering */}
                <DatePicker
                    startDate={startDate}
                    endDate={endDate}
                    onDateChange={(start, end) => handleDateRangeChange(start, end)}
                />
                {/* Scrip filter */}
                <input
                    type="text"
                    placeholder="Filter by scrip"
                    value={filterValue}
                    onChange={(e) => handleFilterValueChange(e.target.value)}
                    className="ml-4 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export type { ColumnDef };