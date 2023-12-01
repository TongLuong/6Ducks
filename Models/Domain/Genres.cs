namespace DA_6Ducks.Models.Domain
{
    public class Genres
    {
        private int genrelID;
        private string name;
        public int GenrelID { get {  return genrelID; } set {  genrelID = value; } }
        public string Name { get { return name; } set { name = value; } }
        public Genres(int genrelID, string name) 
        {
           this.genrelID = genrelID;
           this.name = name;
        }
    }
}
