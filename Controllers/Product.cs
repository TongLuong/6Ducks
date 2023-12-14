using DA_6Ducks.Models.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace DA_6Ducks.Controllers
{
    public class Product : Controller
    {
        private SqlConnection conn;

        public Product() 
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["dath_database"].ConnectionString);
        }

        public IActionResult Index()
        {
            return View("/Views/product/info/index.cshtml");
        }

        public JsonResult DisplayRating(string productID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand
            (
                "SELECT avgStar FROM dbo.Products " +
                "WHERE productID = " + productID, 
                conn
            );

            cmd.Parameters.AddWithValue("@productID", productID);

            SqlDataReader dr = cmd.ExecuteReader();
            double avg = 0;
            int dividend = 0;
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    avg += dr.GetDouble(0);
                    dividend++;
                }
            }
            conn.Close();

            return new JsonResult
            (
                new 
                { 
                    numberOfStars = (int)(avg / dividend),
                    avgRating = Math.Round(avg / (dividend * 1.0), 1)
                }
            );
        }

        public JsonResult LoadFeedback(int productID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();
            int num = 0;
            List<string> usernames = new List<string>();
            List<double> stars = new List<double>();
            List<string> details = new List<string>();

            SqlCommand cmd = new SqlCommand("SELECT username,ratingStar,detail FROM Ratings r JOIN Buyers b ON r.buyerID = b.buyerID JOIN Users u ON u.userID = b.userID WHERE productID = @productID", conn);

            cmd.Parameters.AddWithValue("@productID", productID);

            SqlDataReader dr = cmd.ExecuteReader();
            
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    num++;
                    usernames.Add(dr.GetString(0));
                    stars.Add(dr.GetDouble(1));
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
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand
            (
                "SELECT p.*, c.name, g.name, pi.imgLink " +
                "FROM dbo.Products p, dbo.ProductIMGs pi, dbo.Categories c, dbo.Genres g " +
                "WHERE p.productID = pi.productID " +
                "AND p.productID = @productID " +
                "AND p.categoryID = c.categoryID " +
                "AND p.genreID = g.genreID"
                , conn
            );

            cmd.Parameters.AddWithValue("@productID", productID);

            SqlDataReader dr = cmd.ExecuteReader();
            string[] temp = new string[dr.FieldCount];
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i = 0; i < dr.FieldCount; i++)
                    {
                        if (!dr.IsDBNull(i))
                            temp[i] = dr.GetValue(i).ToString() ?? "";
                        else
                            temp[i] = "";
                    }
                }
            }
            conn.Close();

            return new JsonResult
            (
                new
                {
                    productID = temp[0],
                    sellerID = temp[1],
                    name = temp[2],
                    author = temp[3],
                    publisher = temp[4],
                    genreID = temp[5],
                    categoryID = temp[6],
                    price = temp[7],
                    discount = temp[8],
                    avgStar = temp[9],
                    ratingCount = temp[10],
                    numbersLeft = temp[11],
                    soldNumber = temp[12],
                    catName = temp[13],
                    genreName = temp[14],
                    imgLink = temp[15]
                }
            );
        }

        public JsonResult LoadSellerInfo(string sellerID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand
            (
                "SELECT s.*, u.displayName " +
                "FROM dbo.[Sellers] s, dbo.[Users] u " +
                "WHERE s.sellerID = @sellerID " +
                "AND s.userID = u.userID"
                , conn
            );

            cmd.Parameters.AddWithValue("@sellerID", sellerID);

            SqlDataReader dr = cmd.ExecuteReader();
            string[] temp = new string[dr.FieldCount];
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i = 0; i < dr.FieldCount; i++)
                    {
                        if (!dr.IsDBNull(i))
                        {
                            if (i == 2)
                                temp[i] = ((DateTime)dr.GetValue(i)).ToString("dd/MM/yyyy") ?? "";
                            else
                                temp[i] = dr.GetValue(i).ToString() ?? "";
                        }
                        else
                            temp[i] = "";
                    }
                }
            }
            conn.Close();

            return new JsonResult
            (
                new
                {
                    userID = temp[1],
                    startingTime = temp[2],
                    productSale = temp[3],
                    avgRating = temp[4],
                    displayName = temp[5]
                }
            );
        }
    }
}
