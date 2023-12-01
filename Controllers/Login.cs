using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class Login : Controller
    {
        public IActionResult Index()
        {
            return View("/Views/user/login/index.cshtml");
        }

        [HttpPost]
        public IActionResult CheckLogin(string username, string pwd)
        {
            // TODO
            // check username and pwd using function from model
            return View("/Views/user/user-mainpage/index.cshtml");
        }
    }
}
