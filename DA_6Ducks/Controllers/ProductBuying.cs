using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class ProductBuying : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/ProductBuying/index.cshtml");
        }
    }
}
