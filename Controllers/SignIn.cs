using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace DA_6Ducks.Controllers
{
    public class SignIn : Controller
    {
        private static string connectionString = "Data Source=TONGKHANGTE;Initial Catalog=dath_database;Integrated Security=True;Encrypt=True;TrustServerCertificate=True";
        private SqlConnection conn;

        public SignIn()
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(ConnectionString.sqlConnectionString);
        }

        public IActionResult Index()
        {
            return View("/Views/user/signin/index.cshtml");
        }

        [HttpPost]
        public IActionResult RegisterNewUser(string username, string email,
               string pwd, string re_pwd, string account_type,
               string address, string code)
        {
            // TODO
            // insert new record into database, call model function
            /*return Content(username + " " + email + " " + pwd + " " +
                re_pwd + " " + account_type + " " + address + " " +
                code);*/


            Login login = new Login();
            return RedirectToAction("Index", "Login");
        }
    }
}
