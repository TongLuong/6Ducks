namespace DA_6Ducks.Models.Domain
{
    public class Sellers
    {
        private long sellerID, userID, productSale;
        public long SellerID {get => sellerID; set => sellerID = value;}
        public long UserID {get => userID; set => userID = value;}
        public long ProductSale {get => productSale; set => productSale = value;}

        private string startingTime;
        public string StartingTime {get => startingTime; set => startingTime = value;}

        private float avgRating;
        public float AvgRating {get => avgRating; set => avgRating = value;}

        public Sellers (long sellerID, long userID, string startingTime, long productSale, float avgRating)
        {
            this.sellerID = sellerID;
            this.userID = userID;
            this.startingTime = startingTime;
            this.productSale = productSale;
            this.avgRating = avgRating;
        }
    }
}
