using DA_6Ducks.Models.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace DA_6Ducks.Controllers
{
    public class Product : Controller
    {
        private static string connectionString = "Data Source=TONGKHANGTE;Initial Catalog=dath_database;Integrated Security=True;Encrypt=True;TrustServerCertificate=True";
        private SqlConnection conn;

        public Product() 
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(ConnectionString.sqlConnectionString);
        }

        public IActionResult Index()
        {
            return View("/Views/product/info/index.cshtml");
        }

        public JsonResult DisplayRating(int productID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT * FROM dbo.numberOfProductRatings(@productID)", conn);

            cmd.Parameters.AddWithValue("@productID", productID);

            SqlDataReader dr = cmd.ExecuteReader();
            double avg = 0;
            double dividend = 0.0;
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i = 0; i < 5; i++)
                    {
                        if (!dr.IsDBNull(i))
                        {
                            avg += dr.GetInt32(i);

                            if (dr.GetInt32(i) != 0)
                                dividend++;
                        }
                    }
                }
            }
            conn.Close();

            return new JsonResult
            (
                new { numberOfStars = (int)(avg / dividend) }
            );
        }

        public JsonResult LoadFeedback(int productID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();
            int num = 0;
            List<string> usernames = new List<string>();
            List<int> stars = new List<int>();
            List<string> details = new List<string>();

            SqlCommand cmd = new SqlCommand("SELECT username,ratingStar,detail FROM Ratings JOIN Users ON buyerID = userID WHERE productID = @productID", conn);

            cmd.Parameters.AddWithValue("@productID", productID);

            SqlDataReader dr = cmd.ExecuteReader();
            
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    num++;
                    usernames.Add(dr.GetString(0));
                    stars.Add(dr.GetInt32(1));
                    details.Add(dr.GetString(2));
                }
            }
            conn.Close();

            return new JsonResult
            (
                new {number = num, username = usernames,star = stars,detail = details }
            );
        }

        public JsonResult LoadProductInfo(string productID)
        {
            return null;
        }
    }
}
