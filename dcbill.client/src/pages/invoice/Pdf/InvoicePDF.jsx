// components/InvoicePDF.jsx
import { Page, Document, StyleSheet, View, Text, Font } from '@react-pdf/renderer';
import { useInvoiceSummary } from './../useInvoiceSummary';

// Register Noto Sans font for proper Unicode support including ₹ symbol
Font.register({
    family: 'Noto Sans',
    src: '/fonts/NotoSans-Regular.ttf',
    fontWeight: 'normal',
});

Font.register({
    family: 'Noto Sans',
    src: '/fonts/NotoSans-Bold.ttf',
    fontWeight: 'bold',
});

Font.register({
    family: 'NotoSansLightItalic',
    src: '/fonts/NotoSans-LightItalic.ttf',
});

// Helper function to get page settings from localStorage
const getPageSettings = () => {
    if (typeof window !== 'undefined') {
        const savedSettings = localStorage.getItem('invoicePageSettings');
        if (savedSettings) {
            try {
                return JSON.parse(savedSettings);
            } catch (error) {
                console.error('Error parsing page settings:', error);
            }
        }
    }
    return {
        pageSize: 'A5',
        orientation: 'portrait',
        marginTop: 20,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 20,
        fontSize: 8,
    };
};

// Get page settings
const pageSettings = getPageSettings();

// Create styles with dynamic values from localStorage
const createStyles = (settings) => {
    return StyleSheet.create({
        page: {
            paddingTop: settings.marginTop,
            paddingRight: settings.marginRight,
            paddingBottom: settings.marginBottom,
            paddingLeft: settings.marginLeft,
            fontSize: settings.fontSize,
            fontFamily: 'Noto Sans'
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
            borderBottom: '1px solid #000',
            paddingBottom: 3,
            fontSize: Math.max(6, settings.fontSize - 1)
        },
        headerLeft: {
            flexDirection: 'row',
            gap: 3
        },
        headerRight: {
            flexDirection: 'row',
            gap: 3
        },
        companyName: {
            fontSize: Math.max(9, settings.fontSize + 3),
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 3,
            marginTop: 5
        },
        address: {
            fontSize: Math.max(6, settings.fontSize - 1),
            textAlign: 'center',
            marginBottom: 2
        },
        invoiceDetails: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            fontSize: settings.fontSize
        },
        partySection: {
            marginBottom: 10,
            border: '1px solid #000',
            padding: 5
        },
        partyRow: {
            flexDirection: 'row',
            marginBottom: 2,
            fontSize: Math.max(6, settings.fontSize - 1)
        },
        partyLabel: {
            width: 70,
            fontWeight: 'bold'
        },
        partyValue: {
            flex: 1
        },
        table: {
            width: '100%',
            marginBottom: 10,
            border: '1px solid #000'
        },
        tableHeader: {
            flexDirection: 'row',
            backgroundColor: '#f0f0f0',
            borderBottom: '1px solid #000',
            fontWeight: 'bold',
            fontSize: Math.max(6, settings.fontSize - 1)
        },
        tableRow: {
            flexDirection: 'row',
            borderBottom: '1px solid #eee',
            fontSize: Math.max(6, settings.fontSize - 1)
        },
        tableCell: {
            padding: 3,
            fontSize: Math.max(6, settings.fontSize - 1)
        },
        col1: { width: '6%', textAlign: 'center' },
        col2: { width: '34%', textAlign: 'left' },
        col3: { width: '10%', textAlign: 'center' },
        col4: { width: '8%', textAlign: 'center' },
        col5: { width: '15%', textAlign: 'right' },
        col6: { width: '27%', textAlign: 'right' },
        summarySection: {
            marginTop: 8,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        summaryLeft: {
            width: '45%'
        },
        summaryRight: {
            width: '45%'
        },
        amountInWords: {
            fontSize: Math.max(6, settings.fontSize - 1),
            border: '1px solid #000',
            padding: 5,
            marginTop: 5
        },
        amountInWordsTitle: {
            fontWeight: 'bold',
            marginBottom: 3,
            fontSize: Math.max(6, settings.fontSize - 1)
        },
        amountInWordsText: {
            fontSize: Math.max(6, settings.fontSize - 1),
            lineHeight: 1.3,
            fontFamily: 'NotoSansLightItalic',
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 2,
            paddingHorizontal: 3,
            fontSize: Math.max(6, settings.fontSize - 1)
        },
        summaryLabel: {
            fontWeight: 'bold'
        },
        summaryValue: {
            textAlign: 'right'
        },
        grandTotalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 3,
            paddingTop: 3,
            paddingHorizontal: 3,
            borderTop: '1px solid #000',
            borderBottom: '1px solid #000',
            fontWeight: 'bold',
            fontSize: Math.max(8, settings.fontSize + 1)
        },
        footer: {
            marginTop: 15,
            textAlign: 'center',
            borderTop: '1px solid #ccc',
            paddingTop: 8,
            fontSize: Math.max(6, settings.fontSize - 1)
        },
        termsSection: {
            marginTop: 10,
            fontSize: Math.max(5, settings.fontSize - 2),
            borderTop: '1px solid #ccc',
            paddingTop: 5
        },
        eoe: {
            textAlign: 'center',
            fontSize: Math.max(5, settings.fontSize - 2),
            marginTop: 3
        }
    });
};

// Helper function to convert number to words
const numberToWords = (num) => {
    if (!num || num === 0) return 'Zero Rupees Only';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convertToWords = (n) => {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertToWords(n % 100) : '');
        if (n < 100000) return convertToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convertToWords(n % 1000) : '');
        if (n < 10000000) return convertToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convertToWords(n % 100000) : '');
        return convertToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convertToWords(n % 10000000) : '');
    };

    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);

    let result = convertToWords(rupees) + ' Rupees';
    if (paise > 0) {
        result += ' and ' + convertToWords(paise) + ' Paise';
    }
    return result + ' Only';
};

export const InvoicePDF = ({ invoiceData }) => {
    // Get fresh page settings for this render
    const currentPageSettings = getPageSettings();
    const styles = createStyles(currentPageSettings);

    // Determine page size and orientation
    const pageSize = currentPageSettings.pageSize || 'A5';
    const orientation = currentPageSettings.orientation || 'portrait';

    // Convert items to the format expected by useInvoiceSummary
    const itemsForSummary = invoiceData?.items?.map(item => ({
        amount: item.amount,
        quantity: item.quantity,
        rate: item.rate
    })) || [];

    // Use the hook for calculations
    const gstPercent = invoiceData?.gstPercent || 18;
    const {
        subtotal,
        totalGST,
        cgstAmount,
        sgstAmount,
        grandTotal,
        itemsCount,
        cgstPercent,
        sgstPercent
    } = useInvoiceSummary(itemsForSummary, gstPercent);

    // Format currency without Rupee symbol
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '0.00';
        return amount.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
    };

    // Format grand total with Indian Rupee symbol (₹) using Unicode \u20B9
    const formatGrandTotal = (amount) => {
        if (!amount && amount !== 0) return '\u20B9 0.00';
        return `\u20B9 ${amount.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        })}`;
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-GB');
    };

    // Get values
    const gstin = invoiceData?.gstin || '';
    const mobile = invoiceData?.mobile || '';
    const companyName = invoiceData?.companyName || '';
    const address = invoiceData?.address || '';

    // Get amount in words using calculated grandTotal
    const amountInWords = numberToWords(grandTotal);

    return (
        <Document>
            <Page size={pageSize} orientation={orientation} style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text>GSTIN : {gstin}</Text>
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: Math.max(8, currentPageSettings.fontSize + 2) }}>TAX INVOICE</Text>
                    <View style={styles.headerRight}>
                        <Text>MOB. : {mobile}</Text>
                    </View>
                </View>

                {/* Company Details */}
                {companyName && (
                    <>
                        <Text style={styles.companyName}>{companyName}</Text>
                        <Text style={styles.address}>{address}</Text>
                    </>
                )}

                {/* Invoice Date and No */}
                <View style={styles.invoiceDetails}>
                    <Text>Dated: {formatDate(invoiceData?.invoiceDate)}</Text>
                    <Text>No.: {invoiceData?.invoiceNo}</Text>
                </View>

                {/* Party Details */}
                <View style={styles.partySection}>
                    <View style={styles.partyRow}>
                        <Text style={styles.partyLabel}>M/s.:</Text>
                        <Text style={styles.partyValue}>{invoiceData?.partyName}</Text>
                    </View>
                    <View style={styles.partyRow}>
                        <Text style={styles.partyLabel}>Address:</Text>
                        <Text style={styles.partyValue}>{invoiceData?.partyAddress}</Text>
                    </View>
                    <View style={styles.partyRow}>
                        <Text style={styles.partyLabel}>City/Pin/State:</Text>
                        <Text style={styles.partyValue}>
                            {invoiceData?.partyCity} - {invoiceData?.partyPinCode} - {invoiceData?.partyState}
                        </Text>
                    </View>
                    <View style={styles.partyRow}>
                        <Text style={styles.partyLabel}>Party GSTIN:</Text>
                        <Text style={styles.partyValue}>{invoiceData?.partyGstin}</Text>
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableCell, styles.col1]}>S.No.</Text>
                        <Text style={[styles.tableCell, styles.col2]}>Description</Text>
                        <Text style={[styles.tableCell, styles.col3]}>HSN Code</Text>
                        <Text style={[styles.tableCell, styles.col4]}>Qty.</Text>
                        <Text style={[styles.tableCell, styles.col5]}>Rate (₹)</Text>
                        <Text style={[styles.tableCell, styles.col6]}>Amount (₹)</Text>
                    </View>

                    {invoiceData?.items?.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
                            <Text style={[styles.tableCell, styles.col2]}>{item.itemName}</Text>
                            <Text style={[styles.tableCell, styles.col3]}>{item.hsnCode}</Text>
                            <Text style={[styles.tableCell, styles.col4]}>{item.quantity}</Text>
                            <Text style={[styles.tableCell, styles.col5]}>{formatCurrency(item.rate)}</Text>
                            <Text style={[styles.tableCell, styles.col6]}>{formatCurrency(item.amount)}</Text>
                        </View>
                    ))}
                </View>

                {/* Summary Section with Amount in Words on Left */}
                <View style={styles.summarySection}>
                    {/* Left Side - Amount in Words */}
                    <View style={styles.summaryLeft}>
                        <View style={styles.amountInWords}>
                            <Text style={styles.amountInWordsTitle}>Amount in Words:</Text>
                            <Text style={styles.amountInWordsText}>{amountInWords}</Text>
                        </View>
                    </View>

                    {/* Right Side - Financial Summary */}
                    <View style={styles.summaryRight}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Discount</Text>
                            <Text style={styles.summaryValue}>-</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                        </View>

                        {/* Always show CGST and SGST */}
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>CGST ({cgstPercent}%)</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(cgstAmount)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>SGST ({sgstPercent}%)</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(sgstAmount)}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Advance</Text>
                            <Text style={styles.summaryValue}>-</Text>
                        </View>

                        <View style={styles.grandTotalRow}>
                            <Text style={styles.summaryLabel}>GRAND TOTAL</Text>
                            <Text style={styles.summaryValue}>{formatGrandTotal(grandTotal)}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={{ fontWeight: 'bold' }}>{companyName || 'Authorised Signatory'}</Text>
                    <Text>Authorised Signature</Text>
                </View>

                <Text style={styles.eoe}>E &amp; O.E.</Text>

                {/* Terms and Conditions */}
                <View style={styles.termsSection}>
                    <Text style={{ fontWeight: 'bold' }}>TERMS &amp; CONDITIONS:</Text>
                    <Text>1. All Disputes subject to Dehradun Jurisdiction only.</Text>
                </View>
            </Page>
        </Document>
    );
};