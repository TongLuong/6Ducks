using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace DA_6Ducks.Controllers
{
    public class Login : Controller
    {
        private static string connectionString = "Data Source=TONGKHANGTE;Initial Catalog=dath_database;Integrated Security=True;Encrypt=True;TrustServerCertificate=True";
        private SqlConnection conn;

        public Login()
        {
            conn = new SqlConnection(connectionString);
        }

        public IActionResult Index()
        {
            return View("/Views/user/login/index.cshtml");
        }

        [HttpPost]
        public IActionResult CheckLogin(string username, string email, string pwd)
        {
            // TODO
            // check username and pwd using function from model
            SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand func = new SqlCommand("SELECT dbo.checkValid(@username, @email, @pass)", 
                conn);

            if (username != null)
            {
                func.Parameters.AddWithValue("@username", username);
                func.Parameters.AddWithValue("@email", email == null ? DBNull.Value : email);
                func.Parameters.AddWithValue("@pass", pwd == null ? DBNull.Value : pwd);
            }
            bool result = (bool)func.ExecuteScalar();
            //return Content("result: " + result.ToString() + " " + username + " " + email + " " + pwd);

            conn.Close();

            if (result)
                return RedirectToAction("Index", "MainPage");
            else
                return RedirectToAction("CheckLogin", "Login");
        }
    }
}
