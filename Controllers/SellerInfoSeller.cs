using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class SellerInfoSeller : Controller
    {
        public IActionResult Index()
        {
            return View("/Views/user/info/seller-information(seller)/index.cshtml");
        }
    }
}
