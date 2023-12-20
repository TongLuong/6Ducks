using DA_6Ducks.Models.Domain;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.Runtime.Intrinsics.X86;

namespace DA_6Ducks.Controllers
{
    public class Product : Controller
    {
        private SqlConnection conn;
        private string wwwPath;
        private Microsoft.AspNetCore.Hosting.IWebHostEnvironment Environment;

        public Product(Microsoft.AspNetCore.Hosting.IWebHostEnvironment _environment) 
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["dath_database"].ConnectionString);
            Environment = _environment;
            wwwPath = this.Environment.WebRootPath;
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

        public JsonResult ShowRatingTable(string productID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand("select * from dbo.numberOfProductRatings(@productID)",conn);
            cmd.Parameters.AddWithValue("@productID", productID);
            List<int> stars = new List<int>();
            int sumStar = 0;

            SqlDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i=0;i<5;i++)
                    {
                        stars.Add(dr.GetInt32(i));
                        sumStar += dr.GetInt32(i);
                    }
                }
            }

            conn.Close();

            return new JsonResult
            (
                new { star= stars ,sum=sumStar}
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
                "SELECT p.*, c.name, g.name, pi.imgLink, s.sellerID " +
                "FROM dbo.Products p, dbo.ProductIMGs pi, dbo.Categories c, dbo.Genres g, dbo.Sellers s " +
                "WHERE p.productID = pi.productID " +
                "AND p.productID = @productID " +
                "AND p.categoryID = c.categoryID " +
                "AND p.genreID = g.genreID " +
                "AND p.sellerID = s.sellerID"
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
            
            List<string> imgs = new List<string>();
            DirectoryInfo di = new DirectoryInfo(wwwPath + "\\" + temp[15]);
            FileInfo[] files = di.GetFiles();
            foreach (FileInfo file in files)
            {
                imgs.Add(temp[15] + "/" + file.Name);
            }

            conn.Close();

            return new JsonResult
            (
                new
                {
                    productID = temp[0],
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
                    imgLink = imgs,
                    sellerID = temp[16],
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
                "WHERE s.userID = @sellerID " +
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

        public JsonResult LoadShippingMethods()
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            List<JsonResult> result = new List<JsonResult>();
            SqlCommand cmd = new SqlCommand
            (
                "SELECT * " +
                "FROM dbo.[ShippingMethods]"
                , conn
            );

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
                    result.Add
                    (
                        new JsonResult
                        (
                            new
                            {
                                smethodID = temp[0],
                                name = temp[1],
                                price = temp[2]
                            }
                        )
                    );
                }
            }
            conn.Close();

            return new JsonResult
            (
                new
                {
                    data = result
                }
            );
        }

        public JsonResult LoadPaymentMethods()
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            List<JsonResult> result = new List<JsonResult>();
            SqlCommand cmd = new SqlCommand
            (
                "SELECT * " +
                "FROM dbo.[PaymentMethods]"
                , conn
            );

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
                    result.Add
                    (
                        new JsonResult
                        (
                            new
                            {
                                pmethodID = temp[0],
                                name = temp[1]
                            }
                        )
                    );
                }
            }
            conn.Close();

            return new JsonResult
            (
                new
                {
                    data = result
                }
            );
        }

        public JsonResult CreateBill(string buyerID, string sellerID,
            string billStatus, string totalPrice, string address, 
            string pmethodID, string smethodID, string discountVoucher, 
            string freeshipVoucher)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            List<JsonResult> result = new List<JsonResult>();
            SqlCommand cmd = new SqlCommand
            (
                "dbo.[insert_Bill]"
                , conn
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@buyerID", Session.sessionTypeID);
            cmd.Parameters.AddWithValue("@sellerID", sellerID);
            cmd.Parameters.AddWithValue("@totalPrice", totalPrice);
            cmd.Parameters.AddWithValue("@address", address);
            cmd.Parameters.AddWithValue("@pmethod", pmethodID);
            cmd.Parameters.AddWithValue("@smethod", smethodID);
            cmd.Parameters.AddWithValue("@discountVchID", discountVoucher);
            cmd.Parameters.AddWithValue("@freeShipVchID", freeshipVoucher);

            SqlParameter billID_param = cmd.Parameters.Add("@billID", SqlDbType.Int);
            billID_param.Direction = ParameterDirection.Output;
            
            cmd.ExecuteNonQuery();

            string bill_id = billID_param.Value.ToString() ?? "";

            conn.Close();

            return new JsonResult(new { billID = bill_id });
        }

        public void AddBillItems(string billID,
            string productID, string quantity, string price)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand
            (
                "dbo.[insert_BillItems]"
                , conn
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@BillID", billID);
            cmd.Parameters.AddWithValue("@ProductID", productID);
            cmd.Parameters.AddWithValue("@quantity", quantity);
            cmd.Parameters.AddWithValue("@price", price);

            cmd.ExecuteNonQuery();

            conn.Close();
        }
    }
}
