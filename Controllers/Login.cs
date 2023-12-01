using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class Login : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/user/login/index.cshtml");
        }
    }
}
