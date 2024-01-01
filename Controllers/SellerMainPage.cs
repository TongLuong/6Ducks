using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;

namespace DA_6Ducks.Controllers
{
    public class SellerMainPage : Controller
    {
        private SqlConnection conn;
        private string wwwPath;
        private Microsoft.AspNetCore.Hosting.IWebHostEnvironment Environment;

        public SellerMainPage(Microsoft.AspNetCore.Hosting.IWebHostEnvironment _environment)
        {
            //conn = new SqlConnection(connectionString);
            conn = new SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings["dath_database"].ConnectionString);
            Environment = _environment;
            wwwPath = this.Environment.WebRootPath;
        }

        public IActionResult Index()
        {
            return View("/Views/user/seller-mainpage/index.cshtml");
        }

        [HttpGet]
        public JsonResult DisplayProducts(int n)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();

            List<JsonResult> result = new List<JsonResult>();
            SqlCommand cmd = new SqlCommand
            (
                "SELECT " +
                "p.productID, p.name, p.price, p.avgStar, p.numbersLeft, " +
                "pi.imgLink, p.genreID, p.categoryID " +
                "FROM dbo.Products p, dbo.ProductIMGs pi " +
                "WHERE p.productID = pi.productID"
                , conn
            );

            SqlDataReader dr = cmd.ExecuteReader();
            string[] temp = new string[dr.FieldCount];
            if (dr.HasRows)
            {
                while (dr.Read() && n != 0)
                {
                    for (int i = 0; i < dr.FieldCount; i++)
                    {
                        if (!dr.IsDBNull(i))
                            temp[i] = dr.GetValue(i).ToString() ?? "";
                        else
                            temp[i] = "";
                    }

                    List<string> imgs = new List<string>();
                    DirectoryInfo di = new DirectoryInfo(wwwPath + "\\" + temp[5]);
                    FileInfo[] files = di.GetFiles();
                    foreach (FileInfo file in files)
                    {
                        imgs.Add(temp[5] + "/" + file.Name);
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
                                avgStar = temp[3],
                                numbersLeft = temp[4],
                                imgLink = imgs,
                                genreID = temp[6],
                                categoryID = temp[7]
                            }
                        )
                    );
                    n--;
                }
            }

            conn.Close();

            return new JsonResult
            (
                new { data = result }
            );
        }

		[HttpGet]
		public JsonResult DisplayCatAndGen()
        {
			if (conn.State == ConnectionState.Closed)
				conn.Open();

			List<JsonResult> result1 = new List<JsonResult>();
			SqlCommand cmd1 = new SqlCommand
			(
				"SELECT * " +
				"FROM dbo.[Categories]"
				, conn
			);

			SqlDataReader dr1 = cmd1.ExecuteReader();
			string[] temp1 = new string[dr1.FieldCount];
			if (dr1.HasRows)
			{
				while (dr1.Read())
				{
					for (int i = 0; i < dr1.FieldCount; i++)
					{
						if (!dr1.IsDBNull(i))
							temp1[i] = dr1.GetValue(i).ToString() ?? "";
						else
							temp1[i] = "";
					}

					result1.Add
					(
						new JsonResult
						(
							new
							{
								categoryID = temp1[0],
								name = temp1[1]
							}
						)
					);
				}
			}

			conn.Close();

			//===============================================
			if (conn.State == ConnectionState.Closed)
				conn.Open();

			List<JsonResult> result2 = new List<JsonResult>();
			SqlCommand cmd2 = new SqlCommand
			(
				"SELECT * " +
				"FROM dbo.[Genres]"
				, conn
			);

			SqlDataReader dr2 = cmd2.ExecuteReader();
			string[] temp2 = new string[dr2.FieldCount];
			if (dr2.HasRows)
			{
				while (dr2.Read())
				{
					for (int i = 0; i < dr2.FieldCount; i++)
					{
						if (!dr2.IsDBNull(i))
							temp2[i] = dr2.GetValue(i).ToString() ?? "";
						else
							temp2[i] = "";
					}

					result2.Add
					(
						new JsonResult
						(
							new
							{
								genreID = temp2[0],
								name = temp2[1]
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
                    dataCat = result1,
                    dataGen = result2
                }
			);
		}

        [HttpPost]
        public JsonResult UploadImgs()
        {
            string folder = "";
            if (Request.Form.Files.Count != 0)
            {
                for (int i = 0; i < Request.Form.Files.Count; i++)
                {
                    string sellerID = Session.sessionTypeID;

                    IFormFile file = Request.Form.Files[i];

                    if (i == 0)
                        folder = "/assets/images/" + sellerID + "-" +
                            Path.GetFileNameWithoutExtension(file.FileName);

                    string path = wwwPath + folder + "/book-" + (i + 1).ToString() + ".png";
                    
                    // save file to server root
                    Directory.CreateDirectory(wwwPath + folder);
                    using (FileStream stream = new FileStream(path, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
            }
            return new JsonResult
            (
                new { imgPath = folder }
            );
        }

        [HttpPost]
        public void Upload(string imgPath, string bookName, int quantity, string genre, int price, string category, string author, string publisher)
        {
            if (conn.State == ConnectionState.Closed)
                conn.Open();
            
            string sellerID = Session.sessionTypeID;

            SqlCommand cmd = new SqlCommand("select genreID from Genres where name = @genre", conn);
            cmd.Parameters.AddWithValue("@genre", genre);

            SqlDataReader dr = cmd.ExecuteReader();
            int genreID = -1;
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    genreID = dr.GetInt32(0);
                }
            }

            conn.Close();
            conn.Open();

            cmd = new SqlCommand("select categoryID from Categories where name = @category", conn);
            cmd.Parameters.AddWithValue("@category", category);

            dr = cmd.ExecuteReader();
            int categoryID = -1;
            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    categoryID = dr.GetInt32(0);
                }
            }

            conn.Close();
            conn.Open();

            cmd = new SqlCommand("dbo.upload", conn);

            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@seller_id", sellerID);
            cmd.Parameters.AddWithValue("@img_path", imgPath);
            cmd.Parameters.AddWithValue("@book_name", bookName);
            cmd.Parameters.AddWithValue("@quantity", quantity);
            cmd.Parameters.AddWithValue("@genre_id", genreID);
            cmd.Parameters.AddWithValue("@price", price);
            cmd.Parameters.AddWithValue("@category_id", categoryID);
            cmd.Parameters.AddWithValue("@author", author);
            cmd.Parameters.AddWithValue("@publisher", publisher);

            cmd.ExecuteNonQuery();

            conn.Close();
        }
    }
}
