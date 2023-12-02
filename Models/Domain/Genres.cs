namespace DA_6Ducks.Models.Domain
{
    public class Genres
    {
        private long genreID;
        public long GenreID {get => genreID; set => genreID = value;}

        private string name;
        public string Name {get => name; set => name = value;}
        
        public Genres(long genrelID, string name) 
        {
           this.genreID = genrelID;
           this.name = name;
        }
    }
}
