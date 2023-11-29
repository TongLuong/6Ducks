using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class SellerInfoBuyer : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/user/info/seller-information(buyer)/index.cshtml");
        }
    }
}
