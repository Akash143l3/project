"use client"
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

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
}

export type { ColumnDef };
export function DataTable({
    columns,
    data,
}: DataTableProps<TableData>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);
    const [filteredData, setFilteredData] = React.useState<TableData[]>([]); // State variable for filtered data
    const [filterValue, setFilterValue] = React.useState<string>(""); // State variable for filter value

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
            setColumnFilters([{ id: "date", value: [start, end] }]);
        } else {
            // Reset filter if no date range selected
            setFilteredData([]);
            setColumnFilters([]);
        }
    };

    const handleFilterValueChange = (value: string | null) => {
        if (value) {
            setFilterValue(value.toLowerCase());
        } else {
            setFilterValue("");
        }
    };

    const filterFn = (row: any, columnFilters: any) => {
        const dateFilter = columnFilters.some((filter: any) => {
            const [start, end] = filter.value as [Date, Date];
            const itemDate = new Date(row.original.date);
            return itemDate >= start && itemDate <= end;
        });

        const textFilter = row.original.scrip.toLowerCase().includes(filterValue);

        return dateFilter && textFilter;
    };

    const table = useReactTable({
        data: filteredData.length > 0 ? filteredData : data, // Use filteredData if available, otherwise use original data
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
                        {table.getRowModel().rows?.length? (
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
