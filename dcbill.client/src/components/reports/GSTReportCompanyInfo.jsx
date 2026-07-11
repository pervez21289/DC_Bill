import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { Business, LocationOn, Email, Phone, CreditCard, AccountBalance } from '@mui/icons-material';

const GSTReportCompanyInfo = ({ company }) => {
  if (!company) return null;

  const formatAddress = () => {
    const parts = [
      company.address,
      company.state,
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <Paper sx={{ mt: 3, p: 3, variant: 'outlined', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Business sx={{ fontSize: 24 }} />
            Company Information
          </Typography>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {company.companyName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formatAddress()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip icon={<AccountBalance />} label="GST Registered" size="small" color="primary" variant="outlined" />
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <AccountBalance sx={{ mt: 0.5, color: 'primary.main' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">GSTIN</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                {company.gstin}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <CreditCard sx={{ mt: 0.5, color: 'primary.main' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">PAN</Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                {company.pan}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <LocationOn sx={{ mt: 0.5, color: 'primary.main' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">State</Typography>
              <Typography variant="body2">
                {company.state} ({company.stateCode})
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Email sx={{ mt: 0.5, color: 'primary.main' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Email</Typography>
              <Typography variant="body2">{company.email}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Phone sx={{ mt: 0.5, color: 'primary.main' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Phone</Typography>
              <Typography variant="body2">{company.phone}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Business sx={{ mt: 0.5, color: 'primary.main' }} />
            <Box>
              <Typography variant="caption" color="text.secondary">Business Type</Typography>
              <Typography variant="body2">Regular</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GSTReportCompanyInfo;