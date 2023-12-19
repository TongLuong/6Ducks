using DA_6Ducks.Models.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace DA_6Ducks.Controllers
{
    public class Cart : Controller
    {
        private SqlConnection conn;
        private string wwwPath;
        private Microsoft.AspNetCore.Hosting.IWebHostEnvironment Environment;

        public Cart(Microsoft.AspNetCore.Hosting.IWebHostEnvironment _environment)
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["dath_database"].ConnectionString);
            Environment = _environment;
            wwwPath = this.Environment.WebRootPath;
        }

        public IActionResult Index()
        {
            return View("/Views/Cart/Index.cshtml");
        }

        public JsonResult LoadCartItems()
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            List<JsonResult> result = new List<JsonResult>();
            SqlCommand cmd = new SqlCommand
            (
                "SELECT c.*, p.name, pi.imgLink " +
                "FROM CartItems c, Buyers b, Products p, ProductIMGs pi " +
                "WHERE c.buyerID = b.buyerID " +
                "AND b.userID = @userID " +
                "AND c.productID = p.productID " +
                "AND p.productID = pi.productID"
                , conn
            );

            cmd.Parameters.AddWithValue("@userID", Session.sessionID);

            SqlDataReader dr = cmd.ExecuteReader();
            string[] temp = new string[dr.FieldCount];
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    for (int i = 0; i < dr.FieldCount; i++)
                    {
                        if (!dr.IsDBNull(i))
                            temp[i] = dr.GetValue(i).ToString() ?? "";
                        else
                            temp[i] = "";
                    }

                    List<string> imgs = new List<string>();
                    DirectoryInfo di = new DirectoryInfo(wwwPath + "\\" + temp[6]);
                    FileInfo[] files = di.GetFiles();
                    foreach (FileInfo file in files)
                    {
                        imgs.Add(temp[6] + "/" + file.Name);
                    }

                    result.Add
                    (
                        new JsonResult
                        (
                            new
                            {
                                buyerID = temp[0],
                                sellerID = temp[1],
                                productID = temp[2],
                                quantity = temp[3],
                                price = temp[4],
                                name = temp[5],
                                imgLink = imgs
                            }
                        )
                    );
                }
            }
            conn.Close();

            return new JsonResult
            (
                new
                {
                    data = result
                }
            );
        }

        public void AddCartItems(string buyerID, string sellerID,
            string productID, string quantity, string price)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            List<JsonResult> result = new List<JsonResult>();
            SqlCommand cmd = new SqlCommand
            (
                "dbo.[insert_cart_item]"
                , conn
            );

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@buyerID", Session.sessionTypeID);
            cmd.Parameters.AddWithValue("@sellerID", sellerID);
            cmd.Parameters.AddWithValue("@productID", productID);
            cmd.Parameters.AddWithValue("@quantity", quantity);
            cmd.Parameters.AddWithValue("@price", price);

            cmd.ExecuteNonQuery();

            conn.Close();
        }

        public void DeleteCartItems(string buyerID, string productID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            List<JsonResult> result = new List<JsonResult>();
            SqlCommand cmd = new SqlCommand
            (
                "DELETE FROM dbo.[CartItems] " +
                "WHERE productID = @productID " +
                "AND buyerID = @buyerID"
                , conn
            );

            cmd.Parameters.AddWithValue("@buyerID", Session.sessionTypeID);
            cmd.Parameters.AddWithValue("@productID", productID);

            cmd.ExecuteNonQuery();

            conn.Close();
        }
    }
}