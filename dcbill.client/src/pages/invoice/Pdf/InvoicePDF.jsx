// components/InvoicePDF.jsx
import { Page, Document, StyleSheet, View, Text } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottom: '1px solid #000',
        paddingBottom: 5
    },
    headerLeft: {
        flexDirection: 'row',
        gap: 5
    },
    headerRight: {
        flexDirection: 'row',
        gap: 5
    },
    companyName: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        marginTop: 10
    },
    address: {
        fontSize: 9,
        textAlign: 'center',
        marginBottom: 3
    },
    invoiceDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    partySection: {
        marginBottom: 15,
        border: '1px solid #000',
        padding: 8
    },
    partyRow: {
        flexDirection: 'row',
        marginBottom: 4
    },
    partyLabel: {
        width: 80,
        fontWeight: 'bold'
    },
    partyValue: {
        flex: 1
    },
    table: {
        width: '100%',
        marginBottom: 15,
        border: '1px solid #000'
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #000',
        fontWeight: 'bold'
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #eee'
    },
    tableCell: {
        padding: 5,
        fontSize: 9
    },
    col1: { width: '8%', textAlign: 'center' },
    col2: { width: '32%', textAlign: 'left' },
    col3: { width: '12%', textAlign: 'center' },
    col4: { width: '10%', textAlign: 'center' },
    col5: { width: '15%', textAlign: 'right' },
    col6: { width: '23%', textAlign: 'right' },
    summarySection: {
        marginTop: 10,
        width: '60%',
        alignSelf: 'flex-end'
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
        paddingHorizontal: 5
    },
    summaryLabel: {
        width: '60%',
        fontWeight: 'bold'
    },
    summaryValue: {
        width: '40%',
        textAlign: 'right'
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        paddingTop: 5,
        paddingHorizontal: 5,
        borderTop: '1px solid #000',
        borderBottom: '1px solid #000',
        fontWeight: 'bold',
        fontSize: 12
    },
    footer: {
        marginTop: 20,
        textAlign: 'center',
        borderTop: '1px solid #ccc',
        paddingTop: 10
    },
    termsSection: {
        marginTop: 15,
        fontSize: 8,
        borderTop: '1px solid #ccc',
        paddingTop: 8
    },
    eoe: {
        textAlign: 'center',
        fontSize: 8,
        marginTop: 5
    }
});

export const InvoicePDF = ({ invoiceData }) => {
    // Format currency
    const formatCurrency = (amount) => {
        if (!amount) return '0';
        return amount.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-GB');
    };

    // Calculate CGST and SGST (always half of GST percent)
    const gstPercent = invoiceData?.gstPercent || 18;
    const cgstPercent = gstPercent / 2;
    const sgstPercent = gstPercent / 2;
    const totalGST = invoiceData?.totalGST || (invoiceData?.subtotal * gstPercent) / 100;
    const cgstAmount = totalGST / 2;
    const sgstAmount = totalGST / 2;

    // Get values with fallbacks
    const gstin = invoiceData?.gstin || '';
    const mobile = invoiceData?.mobile || '';
    const companyName = invoiceData?.companyName || '';
    const address = invoiceData?.address || '';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text>GSTIN : {gstin}</Text>
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>TAX INVOICE</Text>
                    <View style={styles.headerRight}>
                        <Text>MOB. : {mobile}</Text>
                    </View>
                </View>

                {/* Company Details - Only show if company name exists */}
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

                {/* Summary Section - Always show CGST & SGST */}
                <View style={styles.summarySection}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(invoiceData?.subtotal)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Discount</Text>
                        <Text style={styles.summaryValue}>-</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total</Text>
                        <Text style={styles.summaryValue}>{formatCurrency(invoiceData?.subtotal)}</Text>
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
                        <Text style={styles.summaryValue}>{formatCurrency(invoiceData?.grandTotal)}</Text>
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