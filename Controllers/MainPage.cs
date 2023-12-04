﻿using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using DA_6Ducks.Models.Domain;

namespace DA_6Ducks.Controllers
{
    public class MainPage : Controller
    {
        private static string connectionString = "Data Source=TONGKHANGTE;Initial Catalog=dath_database;Integrated Security=True;Encrypt=True;TrustServerCertificate=True";
        private SqlConnection conn;

        public MainPage()
        {
            conn = new SqlConnection(connectionString);
        }

        public IActionResult Index()
        {
            return View("/Views/user/user-mainpage/index.cshtml");
        }

        public IActionResult SearchBooks(string search)
        {
            List<Products> products = new List<Products>();
            if (search == null || search==string.Empty)
            {
                return View("/Views/user/user-mainpage/index.cshtml");
            }

            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT * FROM Products WHERE name = @search ORDER BY productID", conn);

            cmd.Parameters.AddWithValue("@search", search);

            SqlDataReader dr = cmd.ExecuteReader();

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    //products.Add(new Products(dr.GetInt32(0),dr.GetInt32(1),dr.GetString(3),dr.GetString(4),dr.GetString(5),dr.GetInt32(6),dr.GetInt32(7),dr.get)
                }
            }
            return null;//return trang tim kiem
        }

        public JsonResult DisplayProducts()
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            List<string> result = new List<string>();
            SqlCommand cmd = new SqlCommand("SELECT " +
                "p.productID, p.name, p.price, p.ratingCount, p.numbersLeft, " +
                "pi.img " +
                "FROM dbo.Products p, dbo.ProductIMGs pi " +
                "WHERE p.productID = pi.productID", conn);

            SqlDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i = 0; i < 6; i++)
                        result.Add(dr.GetString(i));
                }
            }
            conn.Close();

            return new JsonResult
            (
                new
                {
                    productID = result[0],
                    name = result[1],
                    price = result[2],
                    ratingCount = result[3],
                    numbersLeft = result[4],
                    img = result[5]
                }
            );
        }
    }
}
