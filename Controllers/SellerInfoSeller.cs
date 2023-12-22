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

        public JsonResult DisplayBills()
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();
            string userID = Session.sessionID;
            SqlCommand cmdConvert = new SqlCommand("select sellerID from Sellers where userID=@userID", conn);
            cmdConvert.Parameters.AddWithValue("@userID", userID);
            string sellerID = cmdConvert.ExecuteScalar().ToString();
            SqlCommand cmd = new SqlCommand("Select billID,billStatus,time,totalPrice from Bills where sellerID = @sellerID", conn);
            cmd.Parameters.AddWithValue("@sellerId", sellerID);
            SqlDataReader dr = cmd.ExecuteReader();
            List<int> billIDs = new List<int>();
            List<int> statuss = new List<int>();
            List<string> times = new List<string>();
            List<int> totalPrices = new List<int>();

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    billIDs.Add(dr.GetInt32(0));
                    string stat = dr.GetString(1);
                    switch (stat)
                    {
                        case "Confirming":statuss.Add(0); break;
						case "Waiting pickup": statuss.Add(1); break;
						case "Delivering": statuss.Add(2); break;
						case "Done": statuss.Add(3); break;
						case "Cancelled": statuss.Add(4); break;
						case "Refund": statuss.Add(5); break;
					}
                    times.Add(dr.GetDateTime(2).ToString("yyyy'-'MM'-'dd' 'HH':'mm':'ss"));
                    totalPrices.Add(dr.GetInt32(3));
                }
            }

            conn.Close();

            return new JsonResult(new
            {
                num = billIDs.Count,
                billID = billIDs,
                status = statuss,
                time = times,
                totalPrice = totalPrices
            });
        }
        [HttpPost]
        public void UpdateBillStatus(string billID,string status)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand("update Bills set billStatus=@status where billID=@billID", conn);

            if (status == "Waiting")
                status = "Waiting pickup";

			cmd.Parameters.AddWithValue("@billID", billID);
			cmd.Parameters.AddWithValue("@status", status);

            cmd.ExecuteNonQuery();

            conn.Close();
		}

        public JsonResult DisplayProduct()
        {
			if (conn.State == ConnectionState.Closed)
				conn.Open();
			string userID = Session.sessionID;

			SqlCommand cmd = new SqlCommand
		   (
			   "SELECT " +
			   "p.productID, p.name, p.price, p.avgStar, p.numbersLeft, " +
			   "pi.imgLink " +
			   "FROM dbo.Products p, dbo.ProductIMGs pi,Sellers s " +
			   "WHERE p.productID = pi.productID and p.sellerID = s.sellerID and s.userID = @userID"
			   , conn
		   );

			cmd.Parameters.AddWithValue("@userID", userID);

			SqlDataReader dr = cmd.ExecuteReader();
            int num = 0;
            List<int> pages = new List<int>();
			List<int> productIDs = new List<int>();
            List<string> names =    new List<string>();
            List<int> prices = new List<int>();
            List<double> rates = new List<double>();
            List<int> numberLeft = new List<int>();
            List<string> imgPaths = new List<string>();
			if (dr.HasRows)
			{
				while (dr.Read())
				{
                    num++;
                    pages.Add(num / 4 + 1);
                    productIDs.Add(dr.GetInt32 (0));
                    names.Add(dr.GetString (1));
                    prices.Add(dr.GetInt32 (2));
                    rates.Add(Math.Floor(dr.GetDouble(3)));
                    numberLeft.Add(dr.GetInt32 (4));
                    imgPaths.Add(dr.GetString(5) +"/book-1.png");
				}
			}

			

			return new JsonResult
			(
				new
				{
                    len = num,
                    page = pages,
					productID = productIDs,
					name = names,
					price = prices,
					rate= rates,
					numbersLeft = numberLeft,
					imgLink = imgPaths
				}
			);

		}

        [HttpPost]
        public void DeleteProduct(int productID)
        {
			if (conn.State == ConnectionState.Closed)
				conn.Open();

			SqlCommand cmd = new SqlCommand("delete from Products where productID=@productID", conn);

			cmd.Parameters.AddWithValue("@productID", productID);

			cmd.ExecuteNonQuery();

			conn.Close();
		}
    }
}
