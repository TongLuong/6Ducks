namespace DA_6Ducks.Models.Domain
{
    public class VoucherApply {
        private long billID, voucherID;
        public long BillID { get => billID; set => billID = value; }
        public long VoucherID { get => voucherID; set => voucherID = value; }
        
        public VoucherApply (long billID, long voucherID)
        {
            this.billID = billID;
            this.voucherID = voucherID;
        }
    }
}