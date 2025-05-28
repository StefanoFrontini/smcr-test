"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProductStatus } from "../types/productStatus";
import { dateFormat } from "../utils/dateFormat";
import { ActionCell } from "./ActionCell";
import StatusStepOne from "./StatusStepOne";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ProductStatus>[] = [
  {
    accessorKey: "product",
    header: () => <div className="font-bold">Prodotto</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="font-bold">Status</div>,
    cell: ({ row }) => <StatusStepOne status={row.getValue("status")} />,
  },
  {
    accessorKey: "updatedAt",
    header: () => <div className="font-bold">Aggiornato</div>,
    cell: ({ row }) => dateFormat(new Date(row.getValue("updatedAt"))),
  },
  {
    accessorKey: "taxcode",
    header: () => <></>,
    cell: () => <></>,
  },
  {
    accessorKey: "subunit",
    header: () => <></>,
    cell: () => <></>,
  },
  {
    accessorKey: "action",
    header: () => <></>,
    cell: ({ row }) => <ActionCell row={row} />,
  },
  {
    accessorKey: "subunitCode",
    header: () => <></>,
    cell: () => <></>,
  },
  {
    accessorKey: "businessName",
    header: () => <></>,
    cell: () => <></>,
  },
];
