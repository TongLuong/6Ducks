namespace DA_6Ducks.Models.Domain
{
    public class Buyers
    {
        private int buyerID, userID;
        public int BuyersID { get {  return buyerID; } set {  buyerID = value; } }
        public int UserID { get { return userID; } set {  userID = value; } }
        public Buyers(int buyerID, int userID) 
        {
            this.userID = userID;
            this.buyerID = buyerID;

        }
    }
}
