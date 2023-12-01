using System.Xml.Linq;

namespace DA_6Ducks.Models.Domain
{
    public class Categories
    {
        private int categoryID;
        private string name;
        public int CategoryID { get {  return categoryID; } set {  categoryID = value; } }
        public string Name { get { return name; } set {  name = value; } }
        public Categories(int categoryID, string name) 
        {
            this.categoryID = categoryID;
            this.name = name;
        
        }
    }
}
