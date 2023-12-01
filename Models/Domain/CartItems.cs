using DA_6Ducks.Controllers;

namespace DA_6Ducks.Models.Domain
{
    public class CartItems
    {
        private long cartItemsID, buyerID, productID, quantity, price;
        public long CartItemsID {get => cartItemsID; set => cartItemsID = value;}
        public long BuyerID {get => buyerID; set => buyerID = value;}
        public long ProductID {get => productID; set => productID = value;}
        public long Quantity {get => quantity; set => quantity = value;}  
        public long Price {get => price; set => price = value;}
        public CartItems(long cartItemsID, long buyerID, long productID, long quantity, long price) 
        {
            this.cartItemsID = cartItemsID;
            this.buyerID = buyerID;
            this.productID = productID;
            this.quantity = quantity;
            this.price = price;
        }
    }
}
