// components/QRCodeGenerator.jsx
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

// Import a QR code generation library (you'll need to install it)
// For example: qrcode or qrcode.react
import QRCode from 'qrcode';

export const QRCodeGenerator = ({ amount, qrSize = 80 }) => {
    const [qrImage, setQrImage] = useState('');

    useEffect(() => {
        // Generate QR code as data URL
        QRCode.toDataURL(String(amount), {
            width: qrSize,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, (err, url) => {
            if (!err) {
                setQrImage(url);
            }
        });
    }, [amount, qrSize]);

    const styles = StyleSheet.create({
        qrContainer: {
            alignItems: 'center',
            padding: 8,
            border: '1px solid #000',
            borderRadius: 4,
            marginTop: 5,
        },
        qrLabel: {
            fontSize: 7,
            fontWeight: 'bold',
            marginBottom: 4,
        },
        qrImage: {
            width: qrSize,
            height: qrSize,
        },
        qrAmount: {
            fontSize: 9,
            fontWeight: 'bold',
            marginTop: 4,
        }
    });

    return (
        <View style={styles.qrContainer}>
            <Text style={styles.qrLabel}>Scan to Pay</Text>
            {qrImage && (
                <Image
                    src={qrImage}
                    style={styles.qrImage}
                />
            )}
            <Text style={styles.qrAmount}>
                ₹ {formatCurrency(amount)}
            </Text>
        </View>
    );
};

// Format currency function
const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0.00';
    return amount.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
};