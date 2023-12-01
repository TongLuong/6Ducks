namespace DA_6Ducks.Models.Domain
{
    public class LogChat
    {
        private int senderID, receiverID;
        public int SenderID { get => senderID; set => senderID = value; }
        public int ReceiverID { get => receiverID; set => receiverID = value; }

        private string msg;
        private string time;
        
        public string Msg { get => msg; set => msg = value; }
        public string Time { get => time; set => time = value; }
        public LogChat(int senderID, int receiverID, string msg, string time)
        {
            this.senderID = senderID;
            this.receiverID = receiverID;
            this.msg = msg;
            this.time = time;
        }
    }
}
