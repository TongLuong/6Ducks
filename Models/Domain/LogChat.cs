namespace DA_6Ducks.Models.Domain
{
    public class LogChat
    {
        private long senderID, receiverID;
        public long SenderID {get => senderID; set => senderID = value;}
        public long ReceiverID {get => receiverID; set => receiverID = value;}

        private string msg;
        private string time;
        
        public string Msg {get => msg; set => msg = value;}
        public string Time {get => time; set => time = value;}
        public LogChat(long senderID, long receiverID, string msg, string time)
        {
            this.senderID = senderID;
            this.receiverID = receiverID;
            this.msg = msg;
            this.time = time;
        }
    }
}
