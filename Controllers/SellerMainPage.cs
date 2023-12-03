using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class SellerMainPage : Controller
    {
        public IActionResult Index()
        {
            return View("/Views/user/seller-mainpage/index.cshtml");
        }
    }
}
