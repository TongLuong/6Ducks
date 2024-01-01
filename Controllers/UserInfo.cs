using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Diagnostics;
using System;

namespace DA_6Ducks.Controllers
{
    public class UserInfo : Controller
    {
        private SqlConnection conn;
        private string wwwPath;
        private Microsoft.AspNetCore.Hosting.IWebHostEnvironment Environment;

        public UserInfo(Microsoft.AspNetCore.Hosting.IWebHostEnvironment _environment)
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["dath_database"].ConnectionString);
            Environment = _environment;
            wwwPath = this.Environment.WebRootPath;
        }

        public IActionResult Index()
        {
            if (Session.sessionType == 0)
                return View("/Views/user/info/user-information/index.cshtml");
            else if (Session.sessionType == 1)
                return View("/Views/user/info/seller-information(seller)/index.cshtml");
            return View();
        }

        public IActionResult SellerInfo()
        {
            return View("/Views/user/info/seller-information(buyer)/index.cshtml");
        }

        public IActionResult IndexPopup()
        {
            return View("/Views/user/info/user-information/popup.cshtml");
        }

        public JsonResult DisplayBills()
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();
            string buyerID = Session.sessionTypeID;
            SqlCommand cmd = new SqlCommand("Select b.billID,b.billStatus,b.time,bi.price,b.totalPrice,bi.productID from Bills b join BillItems bi on b.billID=bi.billID where buyerID = @buyerID", conn);
            cmd.Parameters.AddWithValue("@buyerId", buyerID);
            SqlDataReader dr = cmd.ExecuteReader();
            List<int> billIDs = new List<int>();
            List<string> statuss = new List<string>();
            List<string> times = new List<string>();
            List<int> prices = new List<int>();
            List<int> totalPrices = new List<int>();
            List<int> productIDs = new List<int>();
            int confirmBill = 0, doneBill = 0;
            List<int> pageNum = new List<int>();
            int count = 0;
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    billIDs.Add(dr.GetInt32(0));
                    string stat = dr.GetString(1);
                    switch (stat)
                    {
                        case "Confirming": statuss.Add("Chưa xác nhận"); confirmBill++; break;
                        case "Waiting pickup": statuss.Add("Chờ lấy hàng"); break;
                        case "Delivering": statuss.Add("Đang vận chuyển"); break;
                        case "Done": statuss.Add("Đã nhận");doneBill++; break;
                        case "Cancelled": statuss.Add("Huỷ đơn hàng"); break;
                        case "Refund": statuss.Add("Hoàn trả hàng"); break;
                    }
                    times.Add(dr.GetDateTime(2).ToString("yyyy'-'MM'-'dd' 'HH':'mm':'ss"));
                    prices.Add(dr.GetInt32(3));
                    totalPrices.Add(dr.GetInt32(4));
                    productIDs.Add(dr.GetInt32(5));
                    count++;
                    pageNum.Add((int)(Math.Floor((double)count / 9) + 1));
                }
            }

            conn.Close();

            return new JsonResult(new
            {
                num = count,
                billID = billIDs,
                status = statuss,
                time = times,
                price = prices,
                totalPrice = totalPrices,
                productID = productIDs,
                confirm = confirmBill,
                done = doneBill,
                page = pageNum
            });
        }

        public JsonResult DisplayProductWhenRating(int productID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            SqlCommand cmd = new SqlCommand("select p.name, p.price,pi.imgLink from Products p, ProductIMGs pi where p.productID = pi.productID and p.productID = @productID", conn);

            cmd.Parameters.AddWithValue("@productID", productID);

            SqlDataReader dr = cmd.ExecuteReader();
            int num = 0;
            List<string> names = new List<string>();
            List<int> prices = new List<int>();
            List<string> imgPaths = new List<string>();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    num++;
                    names.Add(dr.GetString(0));
                    prices.Add(dr.GetInt32(1));
                    imgPaths.Add(dr.GetString(2) + "/book-1.png");
                }
            }

            return new JsonResult
            (
                new
                {
                    len = num,
                    name = names,
                    price = prices,
                    imgLink = imgPaths
                }
            );
        }

        [HttpPost]
        public void Rate(int productID, int nostar, string feedback)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            string buyerID = Session.sessionTypeID;

            SqlCommand cmd = new SqlCommand
            (
                "dbo.[insert_or_update_feedbacks]"
                , conn
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@productID", productID);
            cmd.Parameters.AddWithValue("@buyerID", buyerID);
            cmd.Parameters.AddWithValue("@detail", feedback);
            cmd.Parameters.AddWithValue("@ratingStar", nostar);

            cmd.ExecuteNonQuery();

            conn.Close();
        }

        public JsonResult DisplayUserInfo()
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();


            string userID = Session.sessionID;
            SqlCommand cmd = new SqlCommand("select pass,email,dob,address,phoneNumber from Users where userId = @userID", conn);
            cmd.Parameters.AddWithValue("@userID", userID);

            string upass="", uemail="", udob = "", uaddress = "", uphoneNumber = "";
            SqlDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    upass=dr.GetString(0);
                    uemail = dr.GetString(1);
                    udob = dr.GetDateTime(2).ToString("yyyy'-'MM'-'dd");
                    uaddress = dr.GetString(3);
                    uphoneNumber = dr.GetString(4);
                }
            }

            return new JsonResult
            (
                new
                {
                    pass = upass,
                    email = uemail,
                    dob = udob,
                    address = uaddress,
                    phoneNumber = uphoneNumber
                }
            );
        }

        [HttpPost]
        public void UpdateUserInfo(string pass, string email, string dob,string address, string phoneNumber)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            string userID = Session.sessionID;

            SqlCommand cmd = new SqlCommand("update Users set pass=@pass,email=@email,dob=@dob,address=@address,phoneNumber=@phoneNumber where userId = @userID", conn);
            cmd.Parameters.AddWithValue("@userID", userID);
            cmd.Parameters.AddWithValue("@pass", pass);
            cmd.Parameters.AddWithValue("@email", email);
            cmd.Parameters.AddWithValue("@dob", dob);
            cmd.Parameters.AddWithValue("@address", address);
            cmd.Parameters.AddWithValue("@phoneNumber", phoneNumber);

            cmd.ExecuteNonQuery();

            conn.Close();
        }

        public JsonResult ProfileInfo()
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();


            string userID = Session.sessionID;
            SqlCommand cmd = new SqlCommand("select displayName,address,email,phoneNumber from Users where userId = @userID", conn);
            cmd.Parameters.AddWithValue("@userID", userID);

            string uname="", uaddr="", uemail="",uphone="";
            SqlDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    uname = dr.GetString(0);
                    uaddr = dr.GetString(1);
                    uemail = dr.GetString(2);
                    uphone = dr.GetString(3);
                }
            }

            return new JsonResult
            (
                new
                {
                    name = uname,
                    email = uemail,
                    address = uaddr,
                    phoneNumber = uphone
                }
            );
        }
    }
}
