﻿using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Net.NetworkInformation;
using System.Security.Cryptography.Xml;

namespace DA_6Ducks.Controllers
{
    public static class Session
    {
        public static string sessionID = "";
        public static string sessionTypeID = "";
        public static int sessionType = -1; // 0: buyer, 1: seller, 2: admin
        public static string sessionName = "";
    }

    public class Login : Controller
    {
        private SqlConnection conn;

        public Login()
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["dath_database"].ConnectionString);
        }

        public IActionResult Index()
        {
            return View("/Views/user/login/index.cshtml");
        }

        public IActionResult Logout()
        {
            Session.sessionID = "";
            Session.sessionType = -1;
            return RedirectToAction("Index");
        }

        [HttpGet]
        public JsonResult GetSession()
        {
            var userID = Session.sessionID;
            var userType = Session.sessionType;
            var name = Session.sessionName;
            return new JsonResult
            (
                new
                {
                    id = userID,
                    name = name,
                    type = userType
                }
            );
        }
        public JsonResult CheckLogin(string username, string email,
            string pwd)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand
            (
                "dbo.[checkValid]"
                , conn
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@username", username == null ? DBNull.Value : username);
            cmd.Parameters.AddWithValue("@email", email == null ? DBNull.Value : email);
            cmd.Parameters.AddWithValue("@pass", pwd == null ? DBNull.Value : pwd);

            SqlParameter status = cmd.Parameters.Add("@status",
                SqlDbType.Bit);
            SqlParameter userID = cmd.Parameters.Add("@userID",
                SqlDbType.Int);
            SqlParameter userType = cmd.Parameters.Add("@userType",
                SqlDbType.Int);

            status.Direction = ParameterDirection.Output;
            userID.Direction = ParameterDirection.Output;
            userType.Direction = ParameterDirection.Output;

            cmd.ExecuteNonQuery();

            Session.sessionID = userID.Value.ToString() ?? "";

            string type = userType.Value.ToString() ?? "";
            if (type == "22") // buyer
                Session.sessionType = 0;
            else if (type == "21") // seller
                Session.sessionType = 1;
            /*else if (response.userType == 23) // admin
                pass*/

            conn.Close();

            Session.sessionTypeID = GetTypeID(Session.sessionID);

            return new JsonResult
            (
                new
                {
                    status = status.Value,
                    userID = userID.Value,
                    userType = userType.Value
                }
            );
        }

        public string GetTypeID(string userID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand
            (
                "SELECT dbo.[get_type_id] (@user_id)"
                , conn
            );

            cmd.Parameters.AddWithValue("@user_id", userID == null ? DBNull.Value : userID);

            string result = cmd.ExecuteScalar().ToString() ?? "";

            conn.Close();
            return result;
        }

        public string ConvertToUserID(string userID)
        {         
            string userType = userID.Substring(0, 2);

            if (userType == "21")
            {
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                SqlCommand cmd = new SqlCommand("select userID from Sellers where sellerID=@userID", conn);
                cmd.Parameters.AddWithValue("@userID", userID);

                string newUID = cmd.ExecuteScalar().ToString();
                conn.Close();
                return newUID;
            }
            else if (userType == "22")
            {
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                SqlCommand cmd = new SqlCommand("select userID from Buyers where buyerID=@userID", conn);
                cmd.Parameters.AddWithValue("@userID", userID);

                string newUID = cmd.ExecuteScalar().ToString();
                conn.Close();
                return newUID;
            }
            else return userID;

            
        }
    }
}
