using DA_6Ducks.Controllers;

namespace DA_6Ducks.Models.Domain
{
    public class CartItems
    {
        private int cartItemsID, buyerID, productID, quantity, price;
        public int CartItemsID { get {  return cartItemsID; } set {  cartItemsID = value; } }
        public int BuyerID { get { return buyerID; } set {  buyerID = value; } }
        public int ProductID { get { return productID; } set {  productID = value; } }
        public int Quantity { get { return quantity; } set { quantity = value; } }  
        public int Price { get { return price;} set { price = value; } }
        public CartItems(int cartItemsID, int buyerID, int productID, int quantity, int price) 
        {
            this.cartItemsID = cartItemsID;
            this.buyerID = buyerID;
            this.productID = productID;
            this.quantity = quantity;
            this.price = price;
        }
    }
}
