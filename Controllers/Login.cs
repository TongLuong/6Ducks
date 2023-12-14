using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Security.Cryptography.Xml;

namespace DA_6Ducks.Controllers
{
    public class Login : Controller
    {
        private SqlConnection conn;

        public Login()
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["dath_database"].ConnectionString);
        }

        public IActionResult Index()
        {
            return View("/Views/user/login/index.cshtml");
        }

        public JsonResult CheckLogin(string username, string email,
            string pwd)
        {
            // TODO
            // check username and pwd using function from model
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand
            (
                "dbo.[checkValid]"
                , conn
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@username", username == null ? DBNull.Value : username);
            cmd.Parameters.AddWithValue("@email", email == null ? DBNull.Value : email);
            cmd.Parameters.AddWithValue("@pass", pwd == null ? DBNull.Value : pwd);

            SqlParameter status = cmd.Parameters.Add("@status",
                SqlDbType.Bit);
            SqlParameter userID = cmd.Parameters.Add("@userID",
                SqlDbType.Int);
            SqlParameter userType = cmd.Parameters.Add("@userType",
                SqlDbType.Int);

            status.Direction = ParameterDirection.Output;
            userID.Direction = ParameterDirection.Output;
            userType.Direction = ParameterDirection.Output;

            cmd.ExecuteNonQuery();

            conn.Close();

            return new JsonResult
            (
                new
                {
                    status = status.Value,
                    userID = userID.Value,
                    userType = userType.Value
                }
            );
        }
    }
}
