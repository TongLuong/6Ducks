using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class UserInfo : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/user/info/user-information/index.cshtml");
        }
    }
}
