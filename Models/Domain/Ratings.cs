namespace DA_6Ducks.Models.Domain
{
    public class Rating
    {
        private long productID, buyerID;
        public long ProductID {get => productID; set => productID = value;}
        public long BuyerID {get => buyerID; set => buyerID = value;}

        private string detail;
        public string Detail {get => detail; set => detail = value;}

        private float ratingStar;
        public float RatingStar {get => ratingStar; set => ratingStar = value;}

        public Rating (long productID, long buyerID, string detail, float ratingStar)
        {
            this.productID = productID;
            this.buyerID = buyerID;
            this.detail = detail;
            this.ratingStar = ratingStar;
        }
    }
}
