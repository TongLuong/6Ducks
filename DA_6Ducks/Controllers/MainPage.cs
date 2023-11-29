using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class MainPage : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/user/user-mainpage/index.cshtml");
        }
    }
}
