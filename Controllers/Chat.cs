﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using DA_6Ducks.Models.Domain;

namespace DA_6Ducks.Controllers
{
    public class Chat : Controller
    {
        private SqlConnection conn;

        public Chat()
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["dath_database"].ConnectionString);
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
            SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT * FROM dbo.numberOfSellerRatings(@SellerID)", conn);

            cmd.Parameters.AddWithValue("@SellerID", sellerID);

            SqlDataReader dr = cmd.ExecuteReader();
            double avg = 0;
            double dividend = 0.0;
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i = 0; i < 5; i++)
                        if (!dr.IsDBNull(i))
                        {
                            avg += dr.GetInt32(i);

                            if (dr.GetInt32(i) != 0)
                                dividend++;
                        }
                }
            }
            conn.Close();

            return new JsonResult
            (
                new { numberOfStars = (int)(avg / dividend) }
            );
        }

        public JsonResult DisplayLogChat(int userID, int sellerID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT * FROM dbo.loadLogChat(@userID,@sellerID) ORDER BY [time] asc", conn);

            cmd.Parameters.AddWithValue("@userID", userID);
            cmd.Parameters.AddWithValue("@sellerID", sellerID);

            SqlDataReader dr = cmd.ExecuteReader();
            List<string> poss = new List<string>();
            List<string> msgs = new List<string>();
            List<string> times = new List<string>();

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    poss.Add((dr.GetInt32(0) == userID) ? "right" : "left");
                    msgs.Add(dr.GetString(1));
                    times.Add(dr.GetDateTime(2).ToString("yyyy'-'MM'-'dd' 'HH':'mm':'ss"));
                }
            }

            cmd = new SqlCommand("select displayName from Users where userID = @userID", conn);
            cmd.Parameters.AddWithValue("@userID", userID);
            string username = (string)cmd.ExecuteScalar();

            cmd = new SqlCommand("select displayName from Users where userID = @userID", conn);
            cmd.Parameters.AddWithValue("@userID", sellerID);
            string sellername = (string)cmd.ExecuteScalar();

            conn.Close();

            return new JsonResult
            (
                new { userName = username,sellerName = sellername,number = msgs.Count, pos = poss,msg = msgs,time = times }
            );
        }

        [HttpPost]
        public void SaveLogChat(int buyerID, int sellerID, string msg)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand
            (
                "dbo.saveLog",
                conn
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@snd_id", buyerID);
            cmd.Parameters.AddWithValue("@rcv_id", sellerID);
            cmd.Parameters.AddWithValue("@msg", msg);

            cmd.ExecuteNonQuery();

            conn.Close();
        }
    }
}
