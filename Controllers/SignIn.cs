using Microsoft.AspNetCore.Mvc;

namespace DA_6Ducks.Controllers
{
    public class SignIn : Controller
    {
        public IActionResult Index()
        {
            return View("/Views/user/signin/index.cshtml");
        }
    }
}
