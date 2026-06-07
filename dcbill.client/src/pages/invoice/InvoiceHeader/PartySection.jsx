import { Box, Typography, Autocomplete, TextField, IconButton, Tooltip, Collapse } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PartyDetails from './PartyDetails';

const textFieldStyles = {
    '& .MuiInputBase-root': { fontSize: '0.7rem', minHeight: '28px' },
    '& .MuiInputBase-input': { py: 0.3, px: 0.5 }
};

const labelStyles = { fontSize: '0.7rem', fontWeight: 'bold', minWidth: '70px' };

export default function PartySection({
    isExpanded, parties, selectedParty, partiesLoading, invoiceData,
    handleChange, handlePartySelect, handleOpenAddPartyDialog, handleOpenEditPartyDialog
}) {
    // Ensure parties is always an array
    const partyList = Array.isArray(parties) ? parties : [];

    return (
        <Collapse in={isExpanded}>
            <Box sx={{ p: 1.5, pt: 0 }}>
                {/* Party Selection */}
                <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={labelStyles}>Select Party:</Typography>
                        <Autocomplete
                            options={partyList}
                            getOptionLabel={(option) => {
                                if (!option) return '';
                                return `${option.partyName || ''} (${option.gstin || ''})`;
                            }}
                            value={selectedParty || null}
                            onChange={handlePartySelect}
                            loading={partiesLoading}
                            size="small"
                            fullWidth
                            isOptionEqualToValue={(option, value) => {
                                return option?.id === value?.id;
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Search or select party"
                                    size="small"
                                    sx={textFieldStyles}
                                    InputProps={{
                                        ...params.InputProps,
                                        style: { fontSize: '0.7rem' }
                                    }}
                                />
                            )}
                        />
                        <Tooltip title="Add New Party">
                            <IconButton
                                size="small"
                                onClick={handleOpenAddPartyDialog}
                                sx={{ border: '1px solid #ccc', borderRadius: 1, minWidth: '30px' }}
                            >
                                <AddIcon sx={{ fontSize: '16px' }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Selected Party">
                            <IconButton
                                size="small"
                                onClick={handleOpenEditPartyDialog}
                                sx={{ border: '1px solid #ccc', borderRadius: 1, minWidth: '30px' }}
                                disabled={!selectedParty}
                            >
                                <EditNoteIcon sx={{ fontSize: '16px' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Party Details Display */}
                <PartyDetails invoiceData={invoiceData} />
            </Box>
        </Collapse>
    );
}