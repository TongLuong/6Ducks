using DA_6Ducks.Models.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using static System.Net.Mime.MediaTypeNames;

namespace DA_6Ducks.Controllers
{
    public class SellerInfoSeller : Controller
    {
        private SqlConnection conn;
        private string wwwPath;
        private Microsoft.AspNetCore.Hosting.IWebHostEnvironment Environment;

        public SellerInfoSeller(Microsoft.AspNetCore.Hosting.IWebHostEnvironment _environment)
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["dath_database"].ConnectionString);
            Environment = _environment;
            wwwPath = this.Environment.WebRootPath;
        }

        public IActionResult Index()
        {
            return View("/Views/user/info/seller-information(seller)/index.cshtml");
        }

        public JsonResult DisplayRating()
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();
            string userID = Session.sessionID;

            SqlCommand cmd = new SqlCommand("Select sellerId From dbo.Sellers Where userId = @userId", conn);
            cmd.Parameters.AddWithValue("@userId", userID);
            SqlDataReader dr = cmd.ExecuteReader();
            string sellerID = "";
            var id = 0;

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    id = dr.GetInt32(0);
                }
            }

            sellerID = id.ToString();

            conn.Close();
            conn.Open();

            cmd = new SqlCommand("select * from dbo.numberOfSellerRatings(@sellerID)", conn);
            cmd.Parameters.AddWithValue("@sellerID", sellerID);
            List<int> stars = new List<int>();
            int sumStar = 0;


            dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i = 0; i < 5; i++)
                    {
                        stars.Add(dr.GetInt32(i));
                        sumStar += dr.GetInt32(i);
                    }
                }
            }
            double avgStar = 0, starDisplay = 0;
            int totalStar = stars[0] + stars[1] + stars[2] + stars[3] + stars[4];
            if (totalStar > 0)
            {
                avgStar = (stars[0] + stars[1] * 2 + stars[2] * 3 + stars[3] * 4 + stars[4] * 5) * 1.0 / (stars[0] + stars[1] + stars[2] + stars[3] + stars[4]);
                starDisplay = Math.Round(avgStar, 1);
            }


            conn.Close();

            return new JsonResult(  
                new
                {
                    sum = sumStar,
                    star = stars,
                    numberOfStars = avgStar,
                    avgRating = starDisplay
                });
        }
    }
}
