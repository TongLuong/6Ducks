using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class UserInfo : Controller
    {
        public IActionResult Index()
        {
            if (Session.sessionType == 0)
                return View("/Views/user/info/user-information/index.cshtml");
            else if (Session.sessionType == 1)
                return View("/Views/user/info/seller-information(seller)/index.cshtml");
            return View();
        }

        public IActionResult SellerInfo()
        {
            if (Session.sessionType == 0)
                return View("/Views/user/info/seller-information(buyer)/index.cshtml");
            else if (Session.sessionType == 1)
                return View("/Views/user/info/seller-information(seller)/index.cshtml");
            return View();
        }

        public IActionResult IndexPopup()
        {
            return View("/Views/user/info/user-information/popup.cshtml");
        }
    }
}
