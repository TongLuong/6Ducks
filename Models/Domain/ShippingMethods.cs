namespace DA_6Ducks.Models.Domain
{
    public class ShippingMethods
    {
        private int smethodID;
        public int SmethodID {get => smethodID; set => smethodID = value;}
        
        private string name;
        public string Name {get => name; set => name = value;}

        private long price;
        public long Price { get => price; set => price = value;}
        
        public ShippingMethods(int smethodID, string name, long price)
        {
            this.smethodID = smethodID;
            this.name = name;
            this.price = price;
        }
    }
}
