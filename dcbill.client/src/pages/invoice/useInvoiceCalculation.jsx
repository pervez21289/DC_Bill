import { useMemo } from 'react';

export default function useInvoiceCalculation(items) {
    const calculations = useMemo(() => {
        // Ensure items is an array
        if (!items || !Array.isArray(items) || items.length === 0) {
            return {
                subtotal: 0,
                totalGST: 0,
                cgst: 0,
                sgst: 0,
                grandTotal: 0,
                itemsCount: 0,
                gstRates: []
            };
        }

        // Calculate subtotal (without GST)
        const subtotal = items.reduce((sum, item) => {
            const amount = Number(item.amount) || 0;
            return sum + amount;
        }, 0);

        // Calculate total GST based on each item's GST rate
        const totalGST = items.reduce((sum, item) => {
            const amount = Number(item.amount) || 0;
            const gstRate = Number(item.gst) || 0;
            const itemGST = (amount * gstRate) / 100;
            return sum + itemGST;
        }, 0);

        // Calculate CGST and SGST (half of total GST each)
        const cgst = totalGST / 2;
        const sgst = totalGST / 2;

        // Grand total including GST
        const grandTotal = subtotal + totalGST;

        return {
            subtotal: Number(subtotal.toFixed(2)),
            totalGST: Number(totalGST.toFixed(2)),
            cgst: Number(cgst.toFixed(2)),
            sgst: Number(sgst.toFixed(2)),
            grandTotal: Number(grandTotal.toFixed(2)),
            itemsCount: items.length,
            // Get unique GST rates from items (for display)
            gstRates: [...new Set(items.map(item => Number(item.gst)).filter(gst => gst > 0))]
        };
    }, [items]);

    return calculations;
}