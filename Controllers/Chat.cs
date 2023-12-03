using Microsoft.AspNetCore.Mvc;
using System;
using System.Data.SqlClient;
using System.Runtime.InteropServices;

namespace DA_6Ducks.Controllers
{
    public class Chat : Controller
    {
        public IActionResult Index()
        {
            return View("/Views/user/chat/index.cshtml");
        }

        public IActionResult IndexIframe()
        {
            return View("/Views/user/chat/Chat-iframe/index.cshtml");
        }

        public JsonResult GetRate(int sellerID)
        {
            List<int> star = new List<int>(5);
            SqlConnection conn = new SqlConnection(StaticVariable.sqlConnectionString);

            SqlCommand cmd = new SqlCommand("select dbo.numberOfSellerRatings(@SellerID);", conn);

            cmd.Parameters.AddWithValue("@SellerID", sellerID);

            conn.Open();

            SqlDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i = 0; i < 5; i++)
                        star[i] = dr.GetInt32(i);
                }
            }
            conn.Close();

            return new JsonResult
            (
                new { numberOfStars = star.Average() }
            );
        }
    }
}
