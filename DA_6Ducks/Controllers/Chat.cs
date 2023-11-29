using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class Chat : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/user/chat/index.cshtml");
        }

        public IActionResult IndexIframe()
        {
            return View("~/Views/user/chat/Chat-iframe/index.cshtml");
        }
    }
}
