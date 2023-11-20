﻿using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata;

namespace DA_6Ducks.Controllers
{
    public class MainPage : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/MainPage/index.cshtml");
        }
    }
}
