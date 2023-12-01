namespace DA_6Ducks.Models.Domain
{
    public class ShippingMethods
    {
        private int smethodID;
        public int SmethodID {get => smethodID; set smethodID = value;}
        
        private string name;
        public string Name {get => name; set => name = value;}
        
        public ShippingMethods(int smethodID, string name)
        {
            this.smethodID = smethodID;
            this.name = name;
        }
    }
}
