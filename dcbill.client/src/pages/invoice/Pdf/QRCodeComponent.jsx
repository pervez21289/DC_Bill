// components/QRCodeComponent.jsx
import React from 'react';
import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';

export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0.00';
    return amount.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
};

// Environment-aware URL generation for Vite
const getQRImageUrl = () => {

    debugger;
    // Browser
    if (typeof window !== 'undefined') {
        // In Vite, public files are served from root
        return '/images/qR.png';
    }

    // Server-side / PDF generation
    // For Vite, use import.meta.env instead of process.env
    const baseUrl = import.meta.env.VITE_BASE_URL ||
        import.meta.env.VITE_SITE_URL ||
        (import.meta.env.MODE === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173');

    return `${baseUrl}/images/qR.png`;
};

export const UPIQRCode = ({
    amount,
    showAmount = true,
    qrSize = 70
}) => {
    const styles = StyleSheet.create({
        qrContainer: {
            alignItems: 'center',
            padding: 8,
            border: '1px solid #000',
            marginTop: 5,
            backgroundColor: '#ffffff',
            minHeight: qrSize + 40,
            justifyContent: 'center',
        },
        qrLabel: {
            fontSize: 7,
            fontWeight: 'bold',
            marginBottom: 4,
        },
        qrAmount: {
            fontSize: 9,
            fontWeight: 'bold',
            marginTop: 4,
        },
        qrImage: {
            width: qrSize,
            height: qrSize,
        },
        noImageText: {
            fontSize: 6,
            color: '#666666',
        }
    });

    const qrImageUrl = getQRImageUrl();

    return (
        <View style={styles.qrContainer}>
            <Text style={styles.qrLabel}>Pay with UPI</Text>

            {qrImageUrl ? (
                <Image src={qrImageUrl} style={styles.qrImage} />
            ) : (
                <Text style={styles.noImageText}>QR Image not available</Text>
            )}

            {showAmount && (
                <Text style={styles.qrAmount}>
                    ₹ {formatCurrency(amount || 0)}
                </Text>
            )}
        </View>
    );
};