namespace DA_6Ducks.Models.Domain
{
    public class VoucherUse
    {
        private long voucherID, categoryID, sellerID;
        public long VoucherID {get => voucherID; set => voucherID = value;}
        public long CategoryID {get => categoryID; set => categoryID = value;}
        public long SellerID {get => sellerID; set => sellerID = value;}

        public VoucherUse (long voucherID, long categoryID, long sellerID)
        {
            this.voucherID = voucherID;
            this.categoryID = categoryID;
            this.sellerID = sellerID;
        }
    }
}
