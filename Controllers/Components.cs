using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class Components : Controller
    {
        public IActionResult Index()
        {
            return View("components/successPopUp.html");
        }

        public IActionResult upload()
        {
            return View("components/uploadPopUp.html");
        }
    }
}
