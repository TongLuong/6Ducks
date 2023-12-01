using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class Product : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/product/info/index.cshtml");
        }
    }
}
