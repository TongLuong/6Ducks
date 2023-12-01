namespace DA_6Ducks.Models.Domain
{
    public class PaymentMethods
    {
        private int pmethodID;
        public int PmethodID {get => pmethodID; set pmethodID = value;}
        
        private string name;
        public string Name {get => name; set => name = value;}
        
        public PaymentMethods(int pmethodID, string name)
        {
            this.pmethodID = pmethodID;
            this.name = name;
        }
    }
}
