import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AuthWrapper from 'sections/auth/AuthWrapper';   // adjust path
import { verifyEmail, resendVerification } from 'store/authSlice';

export default function VerifyEmail() {
    const [params] = useSearchParams();
    const dispatch = useDispatch();
    const email = params.get('email');
    const token = params.get('token');
    const [status, setStatus] = useState('loading'); // loading | success | error
    const [message, setMessage] = useState('');
    const called = useRef(false); // StrictMode runs effects twice in dev

    useEffect(() => {
        debugger;
        if (called.current) return;
        called.current = true;

        if (!email || !token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }
        dispatch(verifyEmail({ email, token }))
            .unwrap()
            .then((res) => { setStatus('success'); setMessage(res.message); })
            .catch((err) => { setStatus('error'); setMessage(err); });
    }, [dispatch, email, token]);

    const handleResend = async () => {
        try {
            const res = await dispatch(resendVerification(email)).unwrap();
            setMessage(res.message);
        } catch (err) {
            setMessage(err);
        }
    };

    return (
        <AuthWrapper>
            <Stack spacing={3} alignItems="center" sx={{ p: 2 }}>
                {status === 'loading' && (<><CircularProgress /><Typography>Verifying your email...</Typography></>)}
                {status === 'success' && (
                    <>
                        <Alert severity="success">{message}</Alert>
                        <Button component={RouterLink} to="/login" variant="contained">Go to Login</Button>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <Alert severity="error">{message}</Alert>
                        {email && <Button variant="outlined" onClick={handleResend}>Resend verification email</Button>}
                    </>
                )}
            </Stack>
        </AuthWrapper>
    );
}