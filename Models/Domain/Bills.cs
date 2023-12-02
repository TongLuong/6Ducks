namespace DA_6Ducks.Models.Domain
{
    public class Bills
    {
        private long billID, buyerID, sellerID, totalPrice, pmethodID, smethodID;
        public long BillID {get => billID; set => billID = value;}
        public long BuyerID {get => buyerID; set => buyerID = value;}
        public long SellerID {get => sellerID; set => sellerID = value;}
        public long TotalPrice {get => totalPrice; set => totalPrice = value;}
        public long SmethodID {get => smethodID; set => smethodID = value;}
        public long PmethodID {get => pmethodID; set => pmethodID = value;}

        private string billStatus, address, datetime;
        public string BillStatus {get => billStatus; set => billStatus = value;}
        public string Address {get => address; set => address = value;}
        
        public Bills(long billID, long buyerID, long sellerID, long totalPrice, long pmethodID, long smethodID, string billStatus, string address, string datetime)
        {
            this.billID = billID;
            this.buyerID = buyerID;
            this.sellerID = sellerID;
            this.datetime = datetime;
            this.totalPrice = totalPrice;
            this.pmethodID = pmethodID;
            this.smethodID = smethodID;
            this.address = address;
            this.billStatus = billStatus;
        }
    }
}
