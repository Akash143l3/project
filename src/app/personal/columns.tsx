import { ColumnDef } from "@tanstack/react-table";


// Define the type for the data
export type Transaction = {
  
  scrip_type: number;
  buy_qty: number;
  buy_price: number;
  sell_qty: number;
  sell_price: number;
  sellPrice: number;
  buy_date: Date,
  sell_date: Date,
  pl: number;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "scrip_type",
    header: "Scrip type",
  },
  {
    accessorKey: "buy_qty",
    header: "Buy qty",
  },
  {
    accessorKey: "buy_price",
    header: "Buy Price",
  },
  {
    accessorKey: "sell_qty",
    header: "Sell Qty",
  },
  {
    accessorKey: "sell_price",
    header: "Sell Price",
  },
  {
    accessorKey: "pl",
    header: "Profit/Loss",
  },
];
