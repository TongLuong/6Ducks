namespace DA_6Ducks.Models.Domain
{
    public class Vouchers
    {
        private long voucherID, maxValue, minBill;
        public long VoucherID {get => voucherID; set => voucherID = value;}
        public long MaxValue {get => maxValue; set => maxValue = value;}
        public long MinBill {get => minBill; set => minBill = value;}

        private string timeStart, timeExpired;
        public string TimeStart {get => timeStart; set => timeStart = value;}
        public string TimeExpired {get => timeExpired; set => timeExpired = value;}

        private float discountPercent;
        public float DiscountPercent { get => discountPercent; set => discountPercent = value; }
        private long quantity;
        public long Qauntity { get => quantity; set => quantity = value; }

        public Vouchers (long voucherID, string timeStart, string timeExpired, float discountPercent, long maxValue, long minBill, long quantity)
        {
            this.voucherID = voucherID;
            this.timeStart = timeStart;
            this.timeExpired = timeExpired;
            this.discountPercent = discountPercent;
            this.maxValue = maxValue;
            this.minBill = minBill;
            this.quantity = quantity;
        }
    }
}
