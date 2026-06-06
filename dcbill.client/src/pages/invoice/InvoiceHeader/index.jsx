import { Box, Paper, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchBillingSettings, updateBillingSettings } from './../../../store/billingSettingsSlice';
import { fetchParties, selectParty, addParty, updateParty } from './../../../store/partySlice';
import HeaderBar from './HeaderBar';
import CompanyDetails from './CompanyDetails';
import PartySection from './PartySection';
import PartyDialog from './PartyDialog';

export default function InvoiceHeader() {
    const dispatch = useDispatch();
    const { data: billingData, loading: billingLoading } = useSelector(state => state.billingSettings);
    const { parties, selectedParty, loading: partiesLoading } = useSelector(state => state.parties);

    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPartyDialogOpen, setIsPartyDialogOpen] = useState(false);
    const [isEditingParty, setIsEditingParty] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [newParty, setNewParty] = useState({});
    const [editingPartyData, setEditingPartyData] = useState(null);

    const [invoiceData, setInvoiceData] = useState({
        gstin: '', mobile: '', companyName: '', address: '', city: '', pinCode: '', state: '', country: '',
        dated: new Date().toLocaleDateString('en-GB'), invoiceNo: '048',
        partyName: '', partyAddress: '', partyCity: '', partyState: '', partyPinCode: '', partyGstin: '', partyMobile: ''
    });

    useEffect(() => {
        dispatch(fetchBillingSettings());
        dispatch(fetchParties());
    }, [dispatch]);

    useEffect(() => {
        if (billingData) {
            const data = {
                gstin: billingData.gstin || '', mobile: billingData.mobileNumber || '',
                companyName: billingData.companyName || '', address: billingData.address || '',
                city: billingData.city || '', pinCode: billingData.pinCode || '',
                state: billingData.state || '', country: billingData.country || ''
            };
            setInvoiceData(prev => ({ ...prev, ...data }));
            setEditedData(data);
        }
    }, [billingData]);

    useEffect(() => {
        if (selectedParty) {
            setInvoiceData(prev => ({
                ...prev,
                partyName: selectedParty.partyName || '',
                partyAddress: selectedParty.address || '',
                partyCity: selectedParty.city || '',
                partyState: selectedParty.state || '',
                partyPinCode: selectedParty.pinCode || '',
                partyGstin: selectedParty.gstin || '',
                partyMobile: selectedParty.mobile || ''
            }));
        }
    }, [selectedParty]);

    const handleChange = (field, value) => {
        setInvoiceData(prev => ({ ...prev, [field]: value }));
    };

    const handleEditChange = (field, value) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (newDate) => {
        setInvoiceData(prev => ({
            ...prev,
            dated: newDate
        }));
    };

    const handlePartySelect = (event, newValue) => {
        if (newValue) {
            dispatch(selectParty(newValue));
        } else {
            dispatch(selectParty(null));
            setInvoiceData(prev => ({
                ...prev,
                partyName: '', partyAddress: '', partyCity: '', partyState: '', partyPinCode: '', partyGstin: '', partyMobile: ''
            }));
        }
    };

    const handleSaveCompanyDetails = () => {
        const billingSettings = {
            companyName: editedData.companyName || invoiceData.companyName,
            gstin: editedData.gstin || invoiceData.gstin,
            mobileNumber: editedData.mobile || invoiceData.mobile,
            address: editedData.address || invoiceData.address,
            city: editedData.city || invoiceData.city,
            pinCode: editedData.pinCode || invoiceData.pinCode,
            state: editedData.state || invoiceData.state,
            country: editedData.country || invoiceData.country
        };

        setInvoiceData(prev => ({ ...prev, ...billingSettings }));
        dispatch(updateBillingSettings(billingSettings));
        setIsEditMode(false);
    };

    const handleCancelEdit = () => {
        setEditedData({
            gstin: invoiceData.gstin, mobile: invoiceData.mobile,
            companyName: invoiceData.companyName, address: invoiceData.address,
            city: invoiceData.city, pinCode: invoiceData.pinCode,
            state: invoiceData.state, country: invoiceData.country
        });
        setIsEditMode(false);
    };

    const handleOpenAddPartyDialog = () => {
        setIsEditingParty(false);
        setNewParty({ partyName: '', address: '', city: '', state: '', pinCode: '', gstin: '', mobile: '', email: '' });
        setIsPartyDialogOpen(true);
    };

    const handleOpenEditPartyDialog = () => {
        if (selectedParty) {
            setIsEditingParty(true);
            setEditingPartyData({ ...selectedParty });
            setIsPartyDialogOpen(true);
        } else {
            alert('Please select a party first');
        }
    };

    const handleSaveParty = () => {
        if (isEditingParty) {
            dispatch(updateParty({ id: editingPartyData.id, partyData: editingPartyData }));
            dispatch(selectParty(editingPartyData));
        } else {
            if (!newParty.partyName || !newParty.gstin) {
                alert('Please fill Party Name and GSTIN');
                return;
            }
            dispatch(addParty(newParty));
        }

        setIsPartyDialogOpen(false);
        setEditingPartyData(null);
        setNewParty({});
    };

    if (billingLoading) {
        return (
            <Paper sx={{ p: 2, mb: 2, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem' }}>Loading company details...</Typography>
            </Paper>
        );
    }

    return (
        <>
            <Paper sx={{ mb: 2, borderRadius: 1, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                <HeaderBar
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                    invoiceData={invoiceData}
                    setEditedData={setEditedData}
                />

                <CompanyDetails
                    isExpanded={isExpanded}
                    isEditMode={isEditMode}
                    invoiceData={invoiceData}
                    editedData={editedData}
                    handleEditChange={handleEditChange}
                    handleSaveCompanyDetails={handleSaveCompanyDetails}
                    handleCancelEdit={handleCancelEdit}
                    onDateChange={handleDateChange}
                />

                <PartySection
                    isExpanded={isExpanded}
                    parties={parties}
                    selectedParty={selectedParty}
                    partiesLoading={partiesLoading}
                    invoiceData={invoiceData}
                    handleChange={handleChange}
                    handlePartySelect={handlePartySelect}
                    handleOpenAddPartyDialog={handleOpenAddPartyDialog}
                    handleOpenEditPartyDialog={handleOpenEditPartyDialog}
                />
            </Paper>

            <PartyDialog
                open={isPartyDialogOpen}
                onClose={() => setIsPartyDialogOpen(false)}
                isEditing={isEditingParty}
                partyData={isEditingParty ? editingPartyData : newParty}
                setPartyData={isEditingParty ? setEditingPartyData : setNewParty}
                onSave={handleSaveParty}
            />
        </>
    );
}