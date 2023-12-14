﻿using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;

namespace DA_6Ducks.Controllers
{
    public class SellerMainPage : Controller
    {
        private SqlConnection conn;

        public SellerMainPage()
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["dath_database"].ConnectionString);
        }

        public IActionResult Index()
        {
            return View("/Views/user/seller-mainpage/index.cshtml");
        }

        public JsonResult DisplayProducts(int n)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            List<JsonResult> result = new List<JsonResult>();
            SqlCommand cmd = new SqlCommand
            (
                "SELECT " +
                "p.productID, p.name, p.price, p.ratingCount, p.numbersLeft, " +
                "pi.imgLink " +
                "FROM dbo.Products p, dbo.ProductIMGs pi " +
                "WHERE p.productID = pi.productID"
                , conn
            );

            SqlDataReader dr = cmd.ExecuteReader();
            string[] temp = new string[dr.FieldCount];
            if (dr.HasRows)
            {
                while (dr.Read() && n > 0)
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
                                productID = temp[0],
                                name = temp[1],
                                price = temp[2],
                                ratingCount = temp[3],
                                numbersLeft = temp[4],
                                imgLink = temp[5]
                            }
                        )
                    );
                    n--;
                }
            }
            conn.Close();

            return new JsonResult
            (
                new { data = result }
            );
        }

        [HttpPost]
        public void Upload(int sellerID,string imgPath, string bookName, int quantity, string genre, int price, string category,string author, string publisher)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand("select genreID from Genres where name = @genre", conn);
            cmd.Parameters.AddWithValue("@seller_id", sellerID);

            SqlDataReader dr = cmd.ExecuteReader();
            int genreID = -1;
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    genreID = dr.GetInt32(0);
                }
            }

            cmd = new SqlCommand("select categoryID from Categories where name = @category", conn);
            cmd.Parameters.AddWithValue("@category", category);

            dr = cmd.ExecuteReader();
            int categoryID = -1;
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    categoryID = dr.GetInt32(0);
                }
            }

            cmd = new SqlCommand("dbo.upload",conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@seller_id", sellerID);
            cmd.Parameters.AddWithValue("@img_path", imgPath);
            cmd.Parameters.AddWithValue("@book_name", bookName);
            cmd.Parameters.AddWithValue("@quantity", quantity);
            cmd.Parameters.AddWithValue("@genre_id", genreID);
            cmd.Parameters.AddWithValue("@price", price);
            cmd.Parameters.AddWithValue("@category_id", categoryID);
            cmd.Parameters.AddWithValue("@author", author);
            cmd.Parameters.AddWithValue("@publisher", publisher);

            cmd.ExecuteNonQuery();

            conn.Close();
        }
    }
}
