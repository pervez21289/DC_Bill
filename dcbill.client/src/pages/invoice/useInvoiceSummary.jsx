// hooks/useInvoiceSummary.js
import { useMemo } from 'react';

export const useInvoiceSummary = (items, gstPercent = 18) => {
    return useMemo(() => {
        // Calculate subtotal (sum of all item amounts)
        const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
        const itemsCount = items.length;

        // Calculate GST amounts
        const totalGST = (subtotal * gstPercent) / 100;
        const cgstAmount = totalGST / 2;
        const sgstAmount = totalGST / 2;
        const grandTotal = subtotal + totalGST;

        // Calculate percentages
        const cgstPercent = gstPercent / 2;
        const sgstPercent = gstPercent / 2;

        // Format currency
        const formatCurrency = (amount) => {
            const numAmount = Number(amount) || 0;
            return numAmount % 1 === 0 ? numAmount.toString() : numAmount.toFixed(2);
        };

        // Format date
        const formatDate = (date) => {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-GB');
        };

        return {
            // Raw values
            subtotal,
            totalGST,
            cgstAmount,
            sgstAmount,
            grandTotal,
            itemsCount,
            cgstPercent,
            sgstPercent,
            gstPercent,

            // Formatted values
            formattedSubtotal: formatCurrency(subtotal),
            formattedTotalGST: formatCurrency(totalGST),
            formattedCgstAmount: formatCurrency(cgstAmount),
            formattedSgstAmount: formatCurrency(sgstAmount),
            formattedGrandTotal: formatCurrency(grandTotal),

            // Helper functions
            formatCurrency,
            formatDate,

            // Check if has items
            hasItems: itemsCount > 0,
            isEmpty: itemsCount === 0
        };
    }, [items, gstPercent]);
};