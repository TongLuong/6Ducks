namespace DA_6Ducks.Models.Domain
{
    public class ProductIMGs
    {
        private long productID;
        public long ProductID{get => productID; set => productID = value;}

        private string imgLink;
        public string ImgLink {get => imgLink; set => imgLink = value;}

        public ProductIMGs(long productID, string imgLink)
        {
            this.productID = productID;
            this.imgLink = imgLink;
        }
    }
}
