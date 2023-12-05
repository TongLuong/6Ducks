using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using DA_6Ducks.Models.Domain;

namespace DA_6Ducks.Controllers
{
    public class MainPage : Controller
    {
        private SqlConnection conn;

        public MainPage()
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(ConnectionString.sqlConnectionString);
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
                new {data = result}
            );
        }
    }
}
