import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService } from 'services/authService';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

export default function AuthRegister() {
    const navigate = useNavigate();
    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('');
    }, []);

    const handleSubmit = async (values, { setErrors, setSubmitting }) => {
        setServerError(null);
        setIsSubmitting(true);

        try {
            const response = await authService.register(values);

            if (response.success) {
                // Navigate to login page with success message
                navigate('/login', { state: { message: 'Registration successful! Please login.' } });
            } else {
                setServerError(response.message || 'Registration failed');
                if (response.errors) {
                    const formErrors = {};
                    response.errors.forEach(error => {
                        if (error.toLowerCase().includes('email')) formErrors.email = error;
                        if (error.toLowerCase().includes('username')) formErrors.username = error;
                    });
                    setErrors(formErrors);
                }
            }
        } catch (error) {
            setServerError(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    return (
        <>
            {serverError && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setServerError(null)}>
                    {serverError}
                </Alert>
            )}

            <Formik
                initialValues={{
                    firstname: '',
                    lastname: '',
                    email: '',
                    company: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    firstname: Yup.string().max(255).required('First Name is required'),
                    lastname: Yup.string().max(255).required('Last Name is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string()
                        .required('Password is required')
                        .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
                        .min(6, 'Password must be at least 6 characters')
                })}
                onSubmit={handleSubmit}
            >
                {({ errors, handleBlur, handleChange, touched, values, isSubmitting, submitForm }) => (
                    <form noValidate>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Stack sx={{ gap: 1 }}>
                                    <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                                    <OutlinedInput
                                        id="firstname-signup"
                                        type="text"
                                        value={values.firstname}
                                        name="firstname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="John"
                                        fullWidth
                                        error={Boolean(touched.firstname && errors.firstname)}
                                        disabled={isSubmitting}
                                    />
                                </Stack>
                                {touched.firstname && errors.firstname && (
                                    <FormHelperText error id="helper-text-firstname-signup">
                                        {errors.firstname}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Stack sx={{ gap: 1 }}>
                                    <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.lastname && errors.lastname)}
                                        id="lastname-signup"
                                        type="text"
                                        value={values.lastname}
                                        name="lastname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        disabled={isSubmitting}
                                    />
                                </Stack>
                                {touched.lastname && errors.lastname && (
                                    <FormHelperText error id="helper-text-lastname-signup">
                                        {errors.lastname}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid size={12}>
                                <Stack sx={{ gap: 1 }}>
                                    <InputLabel htmlFor="company-signup">Company</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.company && errors.company)}
                                        id="company-signup"
                                        value={values.company}
                                        name="company"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Demo Inc."
                                        disabled={isSubmitting}
                                    />
                                </Stack>
                                {touched.company && errors.company && (
                                    <FormHelperText error id="helper-text-company-signup">
                                        {errors.company}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid size={12}>
                                <Stack sx={{ gap: 1 }}>
                                    <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                        id="email-signup"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="demo@company.com"
                                        disabled={isSubmitting}
                                    />
                                </Stack>
                                {touched.email && errors.email && (
                                    <FormHelperText error id="helper-text-email-signup">
                                        {errors.email}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid size={12}>
                                <Stack sx={{ gap: 1 }}>
                                    <InputLabel htmlFor="password-signup">Password*</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.password && errors.password)}
                                        id="password-signup"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    color="secondary"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="******"
                                        disabled={isSubmitting}
                                    />
                                </Stack>
                                {touched.password && errors.password && (
                                    <FormHelperText error id="helper-text-password-signup">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid>
                                            <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                                        </Grid>
                                        <Grid>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </Grid>
                            <Grid size={12}>
                                <Typography variant="body2">
                                    By Signing up, you agree to our &nbsp;
                                    <Link variant="subtitle2" component={RouterLink} to="#">
                                        Terms of Service
                                    </Link>
                                    &nbsp; and &nbsp;
                                    <Link variant="subtitle2" component={RouterLink} to="#">
                                        Privacy Policy
                                    </Link>
                                </Typography>
                            </Grid>
                            {errors.submit && (
                                <Grid size={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid size={12}>
                                <AnimateButton>
                                    <Button
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        color="primary"
                                        onClick={submitForm}
                                        disabled={isSubmitting}
                                        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
                                    >
                                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
}