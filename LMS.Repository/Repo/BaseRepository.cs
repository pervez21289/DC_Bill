using Dapper;
using LMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace LMS.Repo.Repository
{
    public class BaseRepository
    {
        public static string ConnectionString { get; set; }
  

        public object Query<T>(object gET_ALL_STATUS, object p, CommandType text)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<T>> Query<T>(string sql, object param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var conn = new SqlConnection(ConnectionString))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                else if (conn.State == ConnectionState.Broken || conn.State == ConnectionState.Connecting || conn.State == ConnectionState.Executing || conn.State == ConnectionState.Fetching)
                {
                    conn.Close();
                    conn.Open();
                }
                try
                {
                    return await conn.QueryAsync<T>(sql, param, commandType: commandType);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var conn = new SqlConnection(ConnectionString))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                else if (conn.State == ConnectionState.Broken || conn.State == ConnectionState.Connecting || conn.State == ConnectionState.Executing || conn.State == ConnectionState.Fetching)
                {
                    conn.Close();
                    conn.Open();
                }

                return await conn.QueryAsync<T>(sql, param, commandType: commandType);
            }
        }

        public async Task<(T1 First, List<T2> Second)> QueryMultipleAsync<T1, T2>(string sql, object param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var conn = new SqlConnection(ConnectionString))
            {
                await conn.OpenAsync();

                using (var reader = await conn.QueryMultipleAsync(sql, param, commandType: commandType))
                {
                    var first = await reader.ReadFirstOrDefaultAsync<T1>();
                    var second = (await reader.ReadAsync<T2>()).ToList();

                    return (first, second);
                }
            }
        }

        public async Task<(T1 First, T2 Second)> QueryMultipleStringAsync<T1, T2>(string sql, object param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var conn = new SqlConnection(ConnectionString))
            {
                await conn.OpenAsync();

                using (var reader = await conn.QueryMultipleAsync(sql, param, commandType: commandType))
                {
                    var first = await reader.ReadFirstOrDefaultAsync<T1>();
                    var second = await reader.ReadFirstOrDefaultAsync<T2>();

                    return (first, second);
                }
            }
        }


        public async Task<T> QueryFirstOrDefaultAsync<T>(string sql, object param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var conn = new SqlConnection(ConnectionString))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    await conn.OpenAsync();
                }
                else if (conn.State == ConnectionState.Broken || conn.State == ConnectionState.Connecting || conn.State == ConnectionState.Executing || conn.State == ConnectionState.Fetching)
                {
                    conn.Close();
                    conn.Open();
                }

                return await conn.QueryFirstOrDefaultAsync<T>(sql, param, commandType: commandType);
            }
        }


        public void Execute(string sql, object param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var conn = new SqlConnection(ConnectionString))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                else if (conn.State == ConnectionState.Broken || conn.State == ConnectionState.Connecting || conn.State == ConnectionState.Executing || conn.State == ConnectionState.Fetching)
                {
                    conn.Close();
                    conn.Open();
                }

                 conn.Execute(sql, param, commandType: commandType);
            }
        }

        public async Task<int> ExecuteAsync(string sql, object param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var conn = new SqlConnection(ConnectionString))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                else if (conn.State == ConnectionState.Broken || conn.State == ConnectionState.Connecting || conn.State == ConnectionState.Executing || conn.State == ConnectionState.Fetching)
                {
                    conn.Close();
                    conn.Open();
                }

                return await conn.ExecuteAsync(sql, param, commandType: commandType);
            }
        }

        //public int ExecuteWithParameter(string sql, DynamicParameters param = null, CommandType commandType = CommandType.StoredProcedure)
        //{
        //    using (var conn = new SqlConnection(ConnectionString))
        //    {
        //        if (conn.State == ConnectionState.Closed)
        //        {
        //            conn.Open();
        //        }
        //        else if (conn.State == ConnectionState.Broken || conn.State == ConnectionState.Connecting || conn.State == ConnectionState.Executing || conn.State == ConnectionState.Fetching)
        //        {
        //            conn.Close();
        //            conn.Open();
        //        }

        //        return conn.Execute(sql, param, commandType: commandType);
        //    }
        //}

        public async Task<T> ExecuteScalarAsync<T>(string sql, object param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var conn = new SqlConnection(ConnectionString))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                else if (conn.State == ConnectionState.Broken || conn.State == ConnectionState.Connecting || conn.State == ConnectionState.Executing || conn.State == ConnectionState.Fetching)
                {
                    conn.Close();
                    conn.Open();
                }

                return await conn.ExecuteScalarAsync<T>(sql, param, commandType: commandType);
            }
        }

        //public T ExecuteWithReturnValue<T>(string sql, string returnParameter, DynamicParameters param = null, CommandType commandType = CommandType.StoredProcedure)
        //{
        //    using (var conn = new SqlConnection(ConnectionString))
        //    {
        //        if (conn.State == ConnectionState.Closed)
        //        {
        //            conn.Open();
        //        }
        //        else if (conn.State == ConnectionState.Broken || conn.State == ConnectionState.Connecting || conn.State == ConnectionState.Executing || conn.State == ConnectionState.Fetching)
        //        {
        //            conn.Close();
        //            conn.Open();
        //        }

        //        conn.Execute(sql, param, commandType: commandType);
        //        return param.Get<T>(returnParameter);
        //    }
        //}

        public IDataReader GetReader<T>(string sql, object param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var conn = new SqlConnection(ConnectionString))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                else if (conn.State == ConnectionState.Broken || conn.State == ConnectionState.Connecting || conn.State == ConnectionState.Executing || conn.State == ConnectionState.Fetching)
                {
                    conn.Close();
                    conn.Open();
                }

                return conn.ExecuteReader(sql, param, commandType: commandType);
            }
        }

        public DataTable GetReader(string sql, object param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var conn = new SqlConnection(ConnectionString))
            {
                DataTable table = new DataTable();
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                else if (conn.State == ConnectionState.Broken || conn.State == ConnectionState.Connecting || conn.State == ConnectionState.Executing || conn.State == ConnectionState.Fetching)
                {
                    conn.Close();
                    conn.Open();
                }

                table.Load(conn.ExecuteReader(sql, param, commandType: commandType));
                return table;
            }
        }


        public async Task<DataSet> GetMultipleResult(string sql, object param = null, CommandType commandType = CommandType.StoredProcedure)
        {
            DataSet ds = new DataSet();
            using (var conn = new SqlConnection(ConnectionString))
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();

                    SqlCommand sqlComm = new SqlCommand(sql, conn);


                    sqlComm.CommandType = CommandType.StoredProcedure;

                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = sqlComm;

                    da.Fill(ds);
                }
                else if (conn.State == ConnectionState.Broken || conn.State == ConnectionState.Connecting || conn.State == ConnectionState.Executing || conn.State == ConnectionState.Fetching)
                {
                    conn.Close();
                    conn.Open();
                }


            }
            return ds;
        }

        //internal object GetDataTable(object p1, object p2, CommandType text)
        //{
        //    throw new NotImplementedException();
        //}


    }
}
