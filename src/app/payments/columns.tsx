import { ColumnDef } from "@tanstack/react-table";


// Define the type for the data
export type Transaction = {
  date: string;
  scrip: string;
  costPrice: number;
  qty: number;
  sellPrice: number;
  pl: number;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "scrip",
    header: "Scrip",
  },
  {
    accessorKey: "costPrice",
    header: "Cost Price",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "sellPrice",
    header: "Sell Price",
  },
  {
    accessorKey: "pl",
    header: "P/L",
  },
];
