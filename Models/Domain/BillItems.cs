namespace DA_6Ducks.Models.Domain
{
    public class BillItems
    {
        private int billItemID, billID, productID, quantity, price;
        public int BillItemID { get {  return billItemID; } set {  billItemID = value; } }
        public int BillID { get => billID; set => billID = value; }
        public int ProductID { get { return productID; } set {  productID = value; } }
        public int Quantity { get { return quantity; } set { quantity = value; } }  
        public int Price { get { return price; } set { price = value; } }   
        public BillItems(int billItemID, int billID, int productID, int quantity, int price) 
        {
            this.billID = billItemID;
            this.billID = billID;
            this.productID = productID; 
            this.quantity = quantity;
            this.price = price;
        }
    }
}
