// components/InvoiceGrid/InvoiceGridTable.jsx
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useInvoiceColumns } from './InvoiceGridColumns';

export default function InvoiceGridTable({
    invoices,
    loading,
    paginationModel,
    setPaginationModel,
    totalCount
}) {
    const columns = useInvoiceColumns();

    return (
        <DataGrid
            rows={invoices}
            columns={columns}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            rowCount={totalCount}
            paginationMode="server"
            filterMode="server"
            sortingMode="server"
            checkboxSelection={false}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            sx={{
                [`& .${gridClasses.cell}`]: {
                    fontSize: '0.75rem',
                    borderBottom: '1px solid #f0f0f0',
                    py: 0.5,
                },
                [`& .${gridClasses.columnHeader}`]: {
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    backgroundColor: '#f5f5f5',
                    borderBottom: '2px solid #e0e0e0',
                },
                [`& .${gridClasses.columnHeaderTitle}`]: {
                    fontWeight: 'bold',
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f9f9f9',
                },
                border: 'none',
            }}
        />
    );
}