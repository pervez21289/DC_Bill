// components/QRCodeComponent.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';

// Export the formatCurrency function so it can be imported elsewhere
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0.00';
    return amount.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
};

export const QRCodeComponent = ({
    amount,
    qrSize = 70,
    showAmount = true,
    showLabel = true,
    backgroundColor = '#ffffff',
    foregroundColor = '#000000'
}) => {
    const [qrImage, setQrImage] = useState(null);

    useEffect(() => {
        const generateQR = async () => {
            try {
                const data = `₹${formatCurrency(amount || 0)}`;

                const dataUrl = await QRCode.toDataURL(data, {
                    width: qrSize,
                    margin: 2,
                    errorCorrectionLevel: 'H',
                    color: {
                        dark: foregroundColor,
                        light: backgroundColor
                    }
                });
                setQrImage(dataUrl);
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        };

        if (amount !== undefined && amount !== null) {
            generateQR();
        }
    }, [amount, qrSize, backgroundColor, foregroundColor]);

    const styles = StyleSheet.create({
        qrContainer: {
            alignItems: 'center',
            padding: 8,
            border: '1px solid #000',
            marginTop: 5,
            backgroundColor: backgroundColor,
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
        }
    });

    return (
        <View style={styles.qrContainer}>
            {showLabel && (
                <Text style={styles.qrLabel}>Scan to Pay</Text>
            )}

            {qrImage ? (
                <Image src={qrImage} style={styles.qrImage} />
            ) : (
                <Text style={{ fontSize: 6 }}>Generating QR...</Text>
            )}

            {showAmount && (
                <Text style={styles.qrAmount}>
                    ₹ {formatCurrency(amount || 0)}
                </Text>
            )}
        </View>
    );
};

// UPI Payment QR Code Component
export const UPIQRCode = ({
    upiId ,
    amount,
    payeeName,
    invoiceNo,
    qrSize = 70,
    showAmount = true
}) => {
    const [qrImage, setQrImage] = useState(null);

    useEffect(() => {
        debugger;
        const generateUPIQR = async () => {
            try {
                const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName || '')}&am=${amount || 0}&cu=INR&tn=INV${invoiceNo || ''}`;
                debugger;
                const dataUrl = await QRCode.toDataURL(upiString, {
                    width: qrSize,
                    margin: 2,
                    errorCorrectionLevel: 'H',
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    }
                });
                setQrImage(dataUrl);
            } catch (error) {
                console.error('Error generating UPI QR code:', error);
            }
        };

        if (upiId && amount !== undefined) {
            generateUPIQR();
        }
    }, [upiId, amount, payeeName, invoiceNo, qrSize]);

    const styles = StyleSheet.create({
        qrContainer: {
            alignItems: 'center',
            padding: 8,
            border: '1px solid #000',
            marginTop: 5,
            backgroundColor: '#ffffff',
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
        }
    });

    return (
        <View style={styles.qrContainer}>
            <Text style={styles.qrLabel}>Pay with UPI</Text>
            {qrImage ? (
                <Image src={qrImage} style={styles.qrImage} />
            ) : (
                <Text style={{ fontSize: 6 }}>Generating QR...</Text>
            )}
            {showAmount && (
                <Text style={styles.qrAmount}>
                    ₹ {formatCurrency(amount || 0)}
                </Text>
            )}
        </View>
    );
};