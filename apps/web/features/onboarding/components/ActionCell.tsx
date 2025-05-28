"use client";

import { Button } from "@repo/ui";
import { Row } from "@tanstack/react-table";
import { useFormContext } from "../context/FormContext";
import { ProductStatus } from "../types/productStatus";

type ActionCellProps = {
  row: Row<ProductStatus>;
};

export function ActionCell({ row }: ActionCellProps) {
  const { updateFormData, goToStepFour } = useFormContext();

  if (
    row.getValue("status") === "COMPLETED" ||
    row.getValue("status") === "DELETED"
  ) {
    const taxcode = row.getValue("taxcode") as string;
    const subunit = row.getValue("subunit") as "Apicale" | "AOO" | "UO";
    const subunitCode = row.getValue("subunitCode") as string;
    const businessName = row.getValue("businessName") as string;
    const productId = row.getValue("product") as
      | ""
      | "prod-pagopa"
      | "prod-io"
      | "prod-pn"
      | "prod-interop"
      | "prod-io-sign";

    return (
      <Button
        variant="pagopaprimary"
        onClick={() => {
          updateFormData({
            taxcode,
            productId,
            subunit,
            subunitCode,
            businessName,
          });
          goToStepFour();
        }}
      >
        Carica contratto
      </Button>
    );
  }
  return null;
}
