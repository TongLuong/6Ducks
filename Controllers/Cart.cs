using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class Cart : Controller
    {
        public IActionResult Index()
        {
            return View("/Views/Cart/Index.cshtml");
        }
    }
}
