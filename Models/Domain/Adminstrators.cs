namespace DA_6Ducks.Models.Domain
{
    public class Adminstrators
    {
        private int adminID;
        private int userID;
        public int AdminID { get => adminID; }
        public int UserID { get => userID; }
        public Adminstrators(int adminID, int userID) 
        {
            this.adminID = adminID;
            this.userID = userID;
        }
    }
}
