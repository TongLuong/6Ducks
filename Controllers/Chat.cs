using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Runtime.InteropServices;

namespace DA_6Ducks.Controllers
{
    public class Chat : Controller
    {
        
        public IActionResult Index()
        {
            return View("/Views/user/chat/index.cshtml");
        }

        public IActionResult IndexIframe()
        {
            return View("/Views/user/chat/Chat-iframe/index.cshtml");
        }
        [HttpPost]
        public IActionResult Rating1()
        {
            GetRate(1);
            return null;
        }
        [HttpPost]
        public IActionResult Rating2()
        {
            GetRate(2);
            return null;
        }
        [HttpPost]
        public IActionResult Rating3()
        {
            GetRate(3);
            return null;
        }
        [HttpPost]
        public IActionResult Rating4()
        {
            GetRate(4);
            return null;
        }
        [HttpPost]
        public IActionResult Rating5()
        {
            GetRate(5);
            return null;
        }

        public void GetRate(int rate)
        {
            
            List<int> star = new List<int>(5);
            SqlConnection conn = new SqlConnection(StaticVariable.sqlConnectionString);

            SqlCommand cmd = new SqlCommand("select dbo.numberOfSellerRatings(@SellerID);", conn);
            SqlParameter param = new SqlParameter();
            param.ParameterName = "@SellerID";
            param.SqlDbType = System.Data.SqlDbType.Int;
            param.Value = rate;

            cmd.Parameters.Add(param);

            conn.Open();

            SqlDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i=0;i<5;i++)
                        star[i] = dr.GetInt32(i);

                }
            }

            conn.Close();
        }
    }
}
