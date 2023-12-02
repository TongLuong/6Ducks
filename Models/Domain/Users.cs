namespace DA_6Ducks.Models.Domain
{
    public class Users
    {
        private long userID, usertype;
        public long UserID {get => userID; set => userID = value;}
        public long Usertype {get => usertype; set => usertype = value;}

        private string displayName;
        public string DisplayName {get =>  displayName; set => displayName = value;}
        private string dob;
        public string Dob {get =>  dob; set => dob = value;}
        private string email;
        public string Email {get =>  email; set => email = value;}
        private string phoneNumber;
        public string PhoneNumber {get =>  phoneNumber; set => phoneNumber = value;}
        private string address;
        public string Address {get =>  address; set => address = value;}
        private string username;
        public string Username {get =>  username; set => username = value;}
        //private string pass;
        //public string Pass {get =>  pass; set => pass = value;} //pass cant be public

        private string transactionNumber;
        public string TransactionNumber { get => transactionNumber;}


        public Users (long userID, string displayName, string dob, string email, string phoneNumber, string address, long usertype, string username)
        {
            this.userID = userID;
            this.displayName = displayName;
            this.dob = dob;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.address = address;
            this.usertype = usertype;
            this.username = username;
            //this.pass = pass;
        }
    }
}
