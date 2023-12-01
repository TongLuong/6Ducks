namespace DA_6Ducks.Models.Domain
{
    public class Bills
    {
        private int billID, buyerID, sellerID, totalPrice,pmethodID,smethodID;
        private string billStatus="", address = "";
        private string datetime="";
        public int BillID { get { return billID; } set {  billID = value; } }
        public int BuyerID { get { return buyerID; } set { buyerID = value; } }
        public int SellerID { get { return sellerID; } set { sellerID = value; } }
        public int TotalPrice { get {  return totalPrice; } set {  totalPrice = value; } }
        public string BillStatus { get {  return billStatus; } set { billStatus = value; } }
        public string Address { get { return address; } set { address = value; } }
        public int SmethodID { get { return smethodID; } set {  smethodID = value; } }
        public int PmethodID { get { return pmethodID; } set { pmethodID = value; } }
        public Bills(int billID, int buyerID, int sellerID, int totalPrice, int pmethodID, int smethodID, string billStatus, string address, string datetime)
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
