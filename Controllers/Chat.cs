using Microsoft.AspNetCore.Mvc;
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

        public IActionResult Seller()
        {
            return View("/Views/Seller-chat/index.cshtml");
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

        public JsonResult DisplayLogChat(string receiverID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();
            Login login = new Login();
            string temp = login.ConvertToUserID(receiverID);
            receiverID = temp;

            SqlCommand cmd = new SqlCommand("SELECT * FROM dbo.loadLogChat(@sndID,@rcvID) ORDER BY [time] asc", conn);

            int senderID = Int32.Parse(Session.sessionID);

            cmd.Parameters.AddWithValue("@sndID", senderID);
            cmd.Parameters.AddWithValue("@rcvID", receiverID);

            SqlDataReader dr = cmd.ExecuteReader();
            List<string> poss = new List<string>();
            List<string> msgs = new List<string>();
            List<string> times = new List<string>();

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    var x = dr.GetInt32(0) == senderID;
                    poss.Add((dr.GetInt32(0) == senderID) ? "right" : "left");
                    msgs.Add(dr.GetString(1));
                    times.Add(dr.GetDateTime(2).ToString("yyyy'-'MM'-'dd' 'HH':'mm':'ss"));
                }
            }

            conn.Close();
            conn.Open();

            cmd = new SqlCommand("select displayName from Users where userID = @userID", conn);
            cmd.Parameters.AddWithValue("@userID", senderID);
            string username = (string)cmd.ExecuteScalar();

            conn.Close();
            conn.Open();

            cmd = new SqlCommand("select displayName from Users where userID = @userID", conn);
            cmd.Parameters.AddWithValue("@userID", receiverID);
            string sellername = (string)cmd.ExecuteScalar();

            conn.Close();

            return new JsonResult
            (
                new { userName = username, sellerName = sellername, number = msgs.Count, pos = poss, msg = msgs, time = times }
            );
        }

        [HttpPost]
        public void SaveLogChat(string receiverID, string msg)
        {

            if (conn.State == ConnectionState.Closed)
                conn.Open();
            if (receiverID[0] != '1')
            {
                Login login = new Login();
                receiverID = login.ConvertToUserID(receiverID);
            }

            SqlCommand cmd = new SqlCommand
            (
                "dbo.saveLog",
                conn
            );

            string senderID = Session.sessionID;

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@sndID", senderID);
            cmd.Parameters.AddWithValue("@rcvID", receiverID);
            cmd.Parameters.AddWithValue("@msg", msg);

            cmd.ExecuteScalar();

            conn.Close();
        }

        public JsonResult DisplayConversation()
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT * FROM dbo.display_conversation(@userID)", conn);

            int userID = Int32.Parse(Session.sessionID);

            cmd.Parameters.AddWithValue("@userID", userID);

            SqlDataReader dr = cmd.ExecuteReader();
            List<string> buyerIDs = new List<string>();
            List<string> buyerName = new List<string>();
            List<string> msgs = new List<string>();
            List<string> times = new List<string>();

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    buyerIDs.Add(dr.GetInt32(0).ToString());
                    buyerName.Add(dr.GetString(1));
                    msgs.Add(dr.GetString(2));
                    times.Add(dr.GetDateTime(3).ToString("yyyy'-'MM'-'dd' 'HH':'mm':'ss"));
                }
            }

            conn.Close();

            return new JsonResult
            (
                new { id = buyerIDs,name = buyerName, msg = msgs, time = times,num=msgs.Count }
            );
        }

        static string currentConversation = "";//only used for seller chat
        public void SaveCurrentConversation(string receiverID)
        {
            currentConversation = receiverID;
        }

        public JsonResult SaveLogChatSeller(string msg)//only used for seller chat
        {

            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand
            (
                "dbo.saveLog",
                conn
            );

            string senderID = Session.sessionID;
            SqlParameter time = cmd.Parameters.Add("@time", SqlDbType.DateTime);
            time.Direction = ParameterDirection.Output;

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@sndID", senderID);
            cmd.Parameters.AddWithValue("@rcvID", currentConversation);
            cmd.Parameters.AddWithValue("@msg", msg);

            cmd.ExecuteNonQuery();

            conn.Close();

            string timeVal = ((DateTime)time.Value).ToString("yyyy'-'MM'-'dd' 'HH':'mm':'ss");

            return new JsonResult(new
            {
                buyerID = currentConversation,
                timeSave = timeVal
            });
        }

        //only for user chat 
        public JsonResult ProfileInfo(string sellerID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            Login login = new Login();

            string userID = login.ConvertToUserID(sellerID);
            SqlCommand cmd = new SqlCommand("select displayName,startingTime,productSale from Users u join Sellers s on u.userID = s.userID and u.userId = @userID", conn);
            cmd.Parameters.AddWithValue("@userID", userID);

            string uname = "", utime = "", uproduct = "";
            SqlDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    uname = dr.GetString(0);
                    utime = dr.GetDateTime(1).ToString("yyyy'-'MM'-'dd");
                    uproduct = dr.GetInt32(2).ToString();
                }
            }

            conn.Close();

            return new JsonResult
            (
                new
                {
                    name = uname,
                    time = utime,
                    product = uproduct
                }
            );
        }
    }
}
