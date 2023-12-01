namespace DA_6Ducks.Models.Domain
{
    public class Buyers
    {
        private long buyerID, userID;
        public long BuyersID {get => buyerID; set => buyerID = value;}
        public long UserID {get => userID; set => userID = value;}
        public Buyers(long buyerID, long userID) 
        {
            this.userID = userID;
            this.buyerID = buyerID;

        }
    }
}
