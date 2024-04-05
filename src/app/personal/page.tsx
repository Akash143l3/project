import { columns } from "./columns";
import { DataTable, ColumnDef } from "./DataTable";

// Define the type for your transaction data
interface Transaction {
  date: string;
  scrip: string;
  costPrice: number;
  qty: number;
  sellPrice: number;
  pl: number;
}

async function getData(): Promise<Transaction[]> {
  
  return [
    {
      date: "04-01-2024",
      scrip: "ABC",
      costPrice: 50,
      qty: 100,
      sellPrice: 60,
      pl: 1000,
    },
    {
        date: "2024-04-01",
        scrip: "ABC",
        costPrice: 50,
        qty: 100,
        sellPrice: 60,
        pl: 1000,
      },
      {
        date: "2024-01-01",
        scrip: "ABC",
        costPrice: 50,
        qty: 100,
        sellPrice: 60,
        pl: 1000,
      },
      {
        date: "2024-02-01",
        scrip: "ABC",
        costPrice: 50,
        qty: 100,
        sellPrice: 60,
        pl: 1000,
      },
      {
        date: "2024-03-01",
        scrip: "ABC",
        costPrice: 50,
        qty: 100,
        sellPrice: 60,
        pl: 1000,
      },
      {
        date: "2023-02-01",
        scrip: "ABC",
        costPrice: 50,
        qty: 100,
        sellPrice: 60,
        pl: 1000,
      },
      {
        date: "04-01-2024",
        scrip: "ABC",
        costPrice: 50,
        qty: 100,
        sellPrice: 60,
        pl: 1000,
      },
      {
          date: "2024-04-01",
          scrip: "ABC",
          costPrice: 50,
          qty: 100,
          sellPrice: 60,
          pl: 1000,
        },
        {
          date: "2024-01-01",
          scrip: "ABC",
          costPrice: 50,
          qty: 100,
          sellPrice: 60,
          pl: 1000,
        },
        {
          date: "2024-02-01",
          scrip: "ABC",
          costPrice: 50,
          qty: 100,
          sellPrice: 60,
          pl: 1000,
        },
        {
          date: "2024-03-01",
          scrip: "ABC",
          costPrice: 50,
          qty: 100,
          sellPrice: 60,
          pl: 1000,
        },
        {
          date: "2023-02-01",
          scrip: "ABC",
          costPrice: 50,
          qty: 100,
          sellPrice: 60,
          pl: 1000,
        },
    // Add more transaction objects as needed
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      {/* Pass the updated columns array to the DataTable component */}
      <DataTable columns={columns as ColumnDef<Transaction>[]} data={data} />
    </div>
  );
}
