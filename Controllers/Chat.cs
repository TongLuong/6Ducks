﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Runtime.InteropServices;

namespace DA_6Ducks.Controllers
{
    public class Chat : Controller
    {
        private static string connectionString = "Data Source=TONGKHANGTE;Initial Catalog=dath_database;Integrated Security=True;Encrypt=True;TrustServerCertificate=True";
        private SqlConnection conn;

        public Chat()
        {
            conn = new SqlConnection(connectionString);
        }

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
            SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT * FROM dbo.numberOfSellerRatings(@SellerID)", conn);

            cmd.Parameters.AddWithValue("@SellerID", sellerID);

            SqlDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i = 0; i < 5; i++)
                        star[i] = (int)dr["fiveStar"];
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
