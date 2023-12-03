using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using DA_6Ducks.Models.Domain;

namespace DA_6Ducks.Controllers
{
    public class MainPage : Controller
    {
        SqlConnection conn = new SqlConnection(StaticVariable.sqlConnectionString);

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
    }
}
