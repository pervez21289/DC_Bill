
using LMS.Core.Entities;

namespace LMS.API.Repositories.Interfaces
{
    public interface IInvoiceRepository
    {
        /// <summary>
        /// Get all invoices
        /// </summary>
        Task<(IEnumerable<InvoiceMaster> Invoices, int TotalCount)> GetAllAsync(
            int pageNumber, int pageSize, string search, DateTime? startDate, DateTime? endDate, int companyId);

        /// <summary>
        /// Get invoice by ID with details
        /// </summary>
        Task<InvoiceMaster> GetByIdAsync(long id);

       
        /// <summary>
        /// Get invoices by party ID
        /// </summary>
        Task<IEnumerable<InvoiceMaster>> GetByPartyIdAsync(long partyId);

        /// <summary>
        /// Create new invoice
        /// </summary>
        Task<long> CreateInvoiceAsync(CreateInvoiceRequest request);

        /// <summary>
        /// Create invoice details
        /// </summary>
        Task<long> CreateInvoiceDetailAsync(long invoiceId, CreateInvoiceDetailRequest detail);

        /// <summary>
        /// Update existing invoice
        /// </summary>
        Task<int> UpdateInvoiceAsync(UpdateInvoiceRequest request);

        /// <summary>
        /// Delete invoice (soft delete)
        /// </summary>
        Task<int> DeleteInvoiceAsync(long id);

        /// <summary>
        /// Check if invoice exists
        /// </summary>
        Task<bool> InvoiceExistsAsync(long id);

        /// <summary>
        /// Get invoice number by ID
        /// </summary>
        Task<string> GetInvoiceNumberAsync(long id);
    }
}