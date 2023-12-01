namespace DA_6Ducks.Models.Domain
{
    public class BillItems
    {
        private long billItemID, billID, productID, quantity, price;
        public long BillItemID {get => billItemID; set =>  billItemID = value;}
        public long BillID {get => billID; set => billID = value;}
        public long ProductID {get => productID; set =>  productID = value;}
        public long Quantity {get => quantity; set => quantity = value;}  
        public long Price {get => price; set => price = value;}   
        
        public BillItems(long billItemID, long billID, long productID, long quantity, long price) 
        {
            this.billID = billItemID;
            this.billID = billID;
            this.productID = productID; 
            this.quantity = quantity;
            this.price = price;
        }
    }
}
