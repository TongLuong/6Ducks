using DA_6Ducks.Models.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace DA_6Ducks.Controllers
{
    public class Product : Controller
    {
        SqlConnection conn = new SqlConnection(StaticVariable.sqlConnectionString);

        public IActionResult Index()
        {
            return View("/Views/product/info/index.cshtml");
        }

        public JsonResult DisplayRating(int productID)
        {
            int[] star = new int[5];
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT * FROM dbo.numberOfProductRatings(@productID)", conn);

            cmd.Parameters.AddWithValue("@productID", productID);

            SqlDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i = 0; i < 5; i++)
                    {
                        star[i] = dr.GetInt32(i);
                    }    
                }
            }

            conn.Close();

            return new JsonResult(new { numberOfStars = star.Average() });
        }
    }
}
