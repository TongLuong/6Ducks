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

        private string billStatus, address, time;
        public string BillStatus {get => billStatus; set => billStatus = value;}
        public string Address {get => address; set => address = value;}
        public string Time {get => time; set => time = value;}
        
        public Bills(long billID, long buyerID, long sellerID, string billStatus, long totalPrice, string time, string address, long pmethodID, long smethodID)
        {
            this.billID = billID;
            this.buyerID = buyerID;
            this.sellerID = sellerID;
            this.billStatus = billStatus;
            this.totalPrice = totalPrice;
            this.time = time;
            this.address = address;
            this.pmethodID = pmethodID;
            this.smethodID = smethodID;
        }
    }
}
