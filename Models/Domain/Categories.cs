using System.Xml.Linq;

namespace DA_6Ducks.Models.Domain
{
    public class Categories
    {
        private long categoryID;
        public long CategoryID {get => categoryID; set => categoryID = value;}

        private string name;
        public string Name {get => name; set => name = value;}
        
        public Categories(long categoryID, string name) 
        {
            this.categoryID = categoryID;
            this.name = name;
        }
    }
}
