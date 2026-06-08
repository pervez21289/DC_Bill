import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

export default function LogoIcon() {
    const theme = useTheme();

    return (
        <Box
            component="img"
            src="/images/logo.png"
            alt="Logo"
            sx={{
                width: 60,
                height: 60,
            }}
        />
    );
}