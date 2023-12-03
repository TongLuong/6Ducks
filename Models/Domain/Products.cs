namespace DA_6Ducks.Models.Domain
{
    public class Products
    {
        private long productID, sellerID, genreID, categoryID, price, ratingCount, numbersLeft, soldNumber;
        public long ProductID {get => productID; set => productID = value;}
        public long SellerID {get => sellerID; set => sellerID = value;}
        public long GenreID {get => genreID; set => genreID = value;}
        public long CategoryID {get => categoryID; set => categoryID = value;}
        public long Price {get => price; set => price = value;}
        public long RatingCount {get => ratingCount; set => ratingCount = value;}
        public long NumbersLeft {get => numbersLeft; set => numbersLeft = value;}
        public long SoldNumber {get => soldNumber; set => soldNumber = value;}

        private float discount, avgStar;
        public float Discount {get => discount; set => discount = value;}
        public float AvgStar {get => avgStar; set => avgStar = value;}

        private string name, author, publisher;
        public string Name {get => name; set => name = value;}
        public string Author {get => author; set => author = value;}
        public string Publisher {get => publisher; set => publisher = value;}

        public Products (long productID, long sellerID, string name, string author, string publisher, long genreID, long categoryID, long price, float discount, float avgStar, long ratingCount, long numbersLeft, long soldNumber)
        {
            this.productID = productID;
            this.sellerID = sellerID;
            this.name = name;
            this.author = author;
            this.publisher = publisher;
            this.genreID = genreID;
            this.categoryID = categoryID;
            this.price = price;
            this.discount = discount;
            this.avgStar = avgStar;
            this.ratingCount = ratingCount;
            this.numbersLeft = numbersLeft;
            this.soldNumber = soldNumber;
        }

    }
}
