import { useMemo } from "react";

export default function useInvoiceCalculation(
    items
) {
    return useMemo(() => {
        const taxableAmount =
            items.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.amount || 0
                    ),
                0
            );

        const cgst =
            taxableAmount * 0.09;

        const sgst =
            taxableAmount * 0.09;

        const grandTotal =
            taxableAmount +
            cgst +
            sgst;

        return {
            taxableAmount,
            cgst,
            sgst,
            grandTotal,
        };
    }, [items]);
}