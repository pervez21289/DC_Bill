using Dapper;
using LMS.API.Repositories.Interfaces;
using LMS.Core.Entities;
using LMS.Repo.Repository;
using System.Data;

namespace LMS.Repository.Repo
{
    public class InvoiceRepository : BaseRepository, IInvoiceRepository
    {
        public async Task<(IEnumerable<InvoiceMaster> Invoices, int TotalCount)> GetAllAsync(
            int pageNumber, int pageSize, string search, DateTime? startDate, DateTime? endDate, int companyId)
        {
            var parameters = new
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Search = string.IsNullOrEmpty(search) ? null : search,
                StartDate = startDate,
                EndDate = endDate,
                CompanyId = companyId
            };

            var sql = "USP_GetAllInvoices";

            // Use QueryAsync from BaseRepository
            var result = await QueryAsync<InvoiceMaster>(sql, parameters, CommandType.StoredProcedure);

            var invoiceList = result.AsList();
            var totalCount = invoiceList.FirstOrDefault()?.TotalCount ?? 0;

            return (invoiceList, totalCount);
        }


        public async Task<InvoiceMaster> GetByIdAsync(long id)
        {
            var parameters = new { Id = id };
            var sql = "USP_GetInvoiceById";

            // Using the existing QueryMultipleAsync method from BaseRepository
            var result = await QueryMultipleAsync<InvoiceMaster, InvoiceDetail>(sql, parameters, CommandType.StoredProcedure);

            var invoice = result.First;
            if (invoice != null)
            {
                invoice.Details = result.Second;
            }

            return invoice;
        }


        public async Task<IEnumerable<InvoiceMaster>> GetByPartyIdAsync(long partyId)
        {
            var parameters = new { PartyId = partyId };
            var sql = "USP_GetInvoicesByParty";
            return await QueryAsync<InvoiceMaster>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<long> CreateInvoiceAsync(CreateInvoiceRequest request)
        {
            var parameters = new
            {
                request.InvoiceNo,
                request.InvoiceDate,
                request.PartyId,
                request.PartyName,
                request.PartyAddress,
                request.PartyCity,
                request.PartyState,
                request.PartyPinCode,
                request.PartyGSTIN,
                request.Subtotal,
                request.GSTPercent,
                request.Notes,
                request.CompanyId,
                request.PaymentStatus
                
            };

            var sql = "USP_CreateInvoice";
            return await ExecuteScalarAsync<long>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<long> CreateInvoiceDetailAsync(long invoiceId, CreateInvoiceDetailRequest detail)
        {
            var parameters = new
            {
                InvoiceId = invoiceId,
                detail.ItemId,
                detail.ItemName,
                detail.HsnCode,
                Quantity = detail.Quantity,
                Rate = detail.Rate,
                Amount = detail.Amount,
                GSTPercent = detail.GSTPercent,
                GSTAmount = detail.GSTAmount
            };

            var sql = "USP_CreateInvoiceDetails";
            return await ExecuteScalarAsync<long>(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> UpdateInvoiceAsync(UpdateInvoiceRequest request)
        {
            var parameters = new
            {
                request.Id,
                request.InvoiceNo,
                request.InvoiceDate,
                request.PartyId,
                request.PartyName,
                request.PartyAddress,
                request.PartyCity,
                request.PartyState,
                request.PartyPinCode,
                request.PartyGSTIN,
                request.Subtotal,
                request.TotalGST,
                request.GrandTotal,
                request.Notes
            };

            var sql = "USP_UpdateInvoice";
            return await ExecuteAsync(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<int> DeleteInvoiceAsync(long id)
        {
            var parameters = new { Id = id };
            var sql = "USP_DeleteInvoice";
            return await ExecuteAsync(sql, parameters, CommandType.StoredProcedure);
        }

        public async Task<bool> InvoiceExistsAsync(long id)
        {
            var sql = "SELECT COUNT(1) FROM InvoiceMaster WHERE Id = @Id AND IsDeleted = 0";
            return await ExecuteScalarAsync<int>(sql, new { Id = id }, CommandType.Text) > 0;
        }

        public async Task<string> GetInvoiceNumberAsync(long id)
        {
            var sql = "SELECT InvoiceNo FROM InvoiceMaster WHERE Id = @Id AND IsDeleted = 0";
            return await ExecuteScalarAsync<string>(sql, new { Id = id }, CommandType.Text);
        }
    }
}