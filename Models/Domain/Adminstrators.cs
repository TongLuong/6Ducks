namespace DA_6Ducks.Models.Domain
{
    public class Adminstrators
    {
        private long adminID;
        public long AdminID {get => adminID; set => adminID = value;}

        private long userID;
        public long UserID {get => userID; set => userID = value;}

        public Adminstrators(long adminID, long userID) 
        {
            this.adminID = adminID;
            this.userID = userID;
        }
    }
}
