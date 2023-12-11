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

            SqlCommand func = new SqlCommand("SELECT dbo.checkValid(@username, @email, @pass)", 
                conn);

            func.Parameters.AddWithValue("@username", username == null ? DBNull.Value : username);
            func.Parameters.AddWithValue("@email", email == null ? DBNull.Value : email);
            func.Parameters.AddWithValue("@pass", pwd == null ? DBNull.Value : pwd);

            int userID = (int)func.ExecuteScalar();
            //return Content("result: " + result.ToString() + " " + username + " " + email + " " + pwd);

            conn.Close();

            return new JsonResult
            (
                new 
                { 
                    userID = userID
                } 
            );
        }
    }
}
