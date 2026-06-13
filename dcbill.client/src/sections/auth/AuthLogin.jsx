import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from 'services/authService';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

// icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// project imports
import {
    loginStart,
    loginSuccess,
    loginFailure,
    clearError,
    selectAuthLoading,
    selectAuthError
} from 'store/authSlice';

export default function AuthLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const loading = useSelector(selectAuthLoading);
    const authError = useSelector(selectAuthError);

    const from = location.state?.from?.pathname || '/dashboard';

    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const savedIdentifier = localStorage.getItem('remembered_user');
        if (savedIdentifier) {
            setEmailOrUsername(savedIdentifier);
            setRememberMe(true);
        }
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!emailOrUsername.trim()) {
            newErrors.emailOrUsername = 'Email or Username is required';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        // Prevent page refresh
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Clear previous errors
        dispatch(clearError());

        // Validate form
        if (!validate()) return;

        // Start loading
        dispatch(loginStart());

        try {
            // Call login - now returns response object (doesn't throw)
            const response = await authService.login(emailOrUsername, password);

            // Check if login was successful
            if (response && response.success) {
                const { token, user } = response.data;

                // Dispatch success
                dispatch(loginSuccess({
                    token: token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        fullName: user.fullName,
                        company: user.company,
                        role: user.role,
                        isActive: user.isActive
                    }
                }));

                // Save remember me preference
                if (rememberMe) {
                    localStorage.setItem('remembered_user', emailOrUsername);
                } else {
                    localStorage.removeItem('remembered_user');
                }

                // Navigate to dashboard
                navigate(from, { replace: true });
            } else {
                // Show error message from backend
                const errorMessage = response?.message || 'Invalid email/username or password';
                dispatch(loginFailure(errorMessage));
            }
        } catch (error) {
            // This catch is now for unexpected errors only
            console.error('Unexpected error:', error);
            dispatch(loginFailure('An unexpected error occurred. Please try again.'));
        }
    };

    const handleEmailOrUsernameChange = (e) => {
        setEmailOrUsername(e.target.value);
        if (errors.emailOrUsername) setErrors((prev) => ({ ...prev, emailOrUsername: '' }));
        if (authError) dispatch(clearError());
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
        if (authError) dispatch(clearError());
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
                {/* Display error from backend */}
                {authError && (
                    <Alert
                        severity="error"
                        onClose={() => dispatch(clearError())}
                        sx={{ mb: 2 }}
                    >
                        {authError}
                    </Alert>
                )}

                <FormControl fullWidth error={Boolean(errors.emailOrUsername)}>
                    <InputLabel htmlFor="emailOrUsername">Email or Username</InputLabel>
                    <OutlinedInput
                        id="emailOrUsername"
                        type="text"
                        value={emailOrUsername}
                        onChange={handleEmailOrUsernameChange}
                        label="Email or Username"
                        autoComplete="username"
                        autoFocus
                        disabled={loading}
                    />
                    {errors.emailOrUsername && (
                        <FormHelperText>{errors.emailOrUsername}</FormHelperText>
                    )}
                </FormControl>

                <FormControl fullWidth error={Boolean(errors.password)}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <OutlinedInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        label="Password"
                        autoComplete="current-password"
                        disabled={loading}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    edge="end"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    disabled={loading}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {errors.password && (
                        <FormHelperText>{errors.password}</FormHelperText>
                    )}
                </FormControl>

                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                color="primary"
                                size="small"
                                disabled={loading}
                            />
                        }
                        label={<Typography variant="body2">Remember me</Typography>}
                    />
                    <Typography
                        component={Link}
                        to="/forgot-password"
                        variant="body2"
                        sx={{ textDecoration: 'none', color: 'primary.main' }}
                    >
                        Forgot password?
                    </Typography>
                </Stack>

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                    sx={{ mt: 2 }}
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </Button>
            </Stack>
        </Box>
    );
}