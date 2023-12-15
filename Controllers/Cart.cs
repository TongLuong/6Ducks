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

        public JsonResult LoadCartItems(string userID)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            List<JsonResult> result = new List<JsonResult>();
            SqlCommand cmd = new SqlCommand
            (
                "SELECT c.*, p.name, pi.imgLink " +
                "FROM CartItems c, Products p, ProductIMGs pi " +
                "WHERE c.buyerID = @userID " +
                "WHERE c.productID = p.productID " +
                "WHERE p.productID = pi.productID"
                , conn
            );

            cmd.Parameters.AddWithValue("@userID", userID);

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
                    DirectoryInfo di = new DirectoryInfo(wwwPath + "\\" + temp[15]);
                    FileInfo[] files = di.GetFiles();
                    foreach (FileInfo file in files)
                    {
                        imgs.Add(temp[15] + "/" + file.Name);
                    }

                    result.Add
                    (
                        new JsonResult
                        (
                            new
                            {
                                cartitemID = temp[0],
                                buyerID = temp[1],
                                productID = temp[2],
                                quantity = temp[3],
                                price = temp[4],
                                name = temp[5],
                                imgLink = temp[6]
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
    }
}
