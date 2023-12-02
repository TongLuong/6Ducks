using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class SignIn : Controller
    {
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
