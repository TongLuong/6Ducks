-- add function here
use [dath_database]

go
-- check valid pass and userID
--drop function checkValid
create function checkValid (
@username varchar(255) = null,
@email varchar(255) = null,
@pass varchar(255)
)
returns int
as
begin
	declare @userID int
	set @userID = null

	select @userID = userID from Users where (username = @username or email = @email) and pass = @pass

	if @userID is not null
		return @userID
	return -1
end
go
-- save logChat
-- drop procedure saveLog
create procedure saveLog
@sndID int,
@rcvID int,
@msg nvarchar(255)
as
begin
	insert into LogChat values(
		@sndID,
		@rcvID,
		@msg,
		GETDATE()
	)	
end
go
 load LogChat
drop procedure loadLog
create procedure loadLog
@userIDView int,
@objectIDView int
as
begin
	select senderID, receiverID, msg, [time]
	from LogChat
	where (senderID = @userIDView and receiverID = @objectIDView) or
	(senderID = @objectIDView and receiverID = @userIDView)
	order by [time] asc
end
go

--drop function loadLogChat
create function loadLogChat
(
@userID int,
@sellerID int
)
returns table
as 
return
(
	select msg, [time]
	from LogChat
	where (senderID = @userID and receiverID = @sellerID) or
	(senderID = @sellerID and receiverID = @userID)
);
go
	
-- calculate total price of a bill (check ship,voucher...)
create function checkBillPrice(
@billID int, 
@smethodID int, 
@discountVoucher int,
@freeshipVoucher int 
)
returns int
as
begin
	declare @productPrice int
	declare @smethodPrice int
	declare @discount int, @discountPercent float, @maxDiscount int
	declare @freeship int, @freeshipPercent float, @maxFreeship int
	declare @totalBill int
	--
	set @productPrice = (
		SELECT SUM(price) FROM BillItems
		where billID = @billID
	)
	--
	set @smethodPrice = (
		SELECT MAX(price) FROM ShippingMethods
		where smethodID = @smethodID
	)
	--
	set @discountPercent = (
		SELECT MAX(discountPercent) FROM Vouchers
		where voucherID = @discountVoucher
	)
	set @maxDiscount = (
		SELECT MAX(maxValue) FROM Vouchers
		where voucherID = @discountVoucher
	)
	set @discount = @discountPercent * @productPrice
	if (@discount > @maxDiscount)
	BEGIN
		set @discount = @maxDiscount
	END
	--
	set @freeshipPercent = (
		SELECT MAX(discountPercent) FROM Vouchers
		where voucherID = @freeshipVoucher
	)
	set @maxFreeship = (
		SELECT MAX(maxValue) FROM Vouchers
		where voucherID = @freeshipVoucher
	)
	set @discount = @freeshipPercent * @smethodPrice
	if (@discount > @maxFreeship)
	BEGIN
		set @discount = @maxFreeship
	END

	set @totalBill = @productPrice + @smethodPrice - @discount - @freeship
	return @totalBill
end
go
-- insert a bill (insert BillItems then)
--drop procedure insert_Bill
create procedure insert_Bill -- get the output of this procedure to insert BillItems
@buyerID int,
@sellerID int,
@address nvarchar(255),
@pmethod int,
@smethod int,
@discountVchID int = null,
@freeShipVchID int = null
as
begin
	insert into Bills (buyerID,sellerID,[address],pmethodID,smethodID,discountVoucher,freeshipVoucher)
	output inserted.billID
	values(
		@buyerID,@sellerID,@address,@pmethod,@smethod,@discountVchID,@freeShipVchID
	)
end

go
--insert BillItems (use BillID ) -- use loop in application
create procedure insert_BillItems
@BillID int,
@ProductID int,
@quantity int,
@price int
as
begin
	insert into BillItems (billID,productID,quantity,price) values
	(@BillID, @ProductID, @quantity,@price)
end
go

-- load the number of seller ratings classified into *, **, ***...
create function numberOfSellerRatings(@sellerID int)	
returns @rtnTable table(oneStar int, twoStar int, threeStar int, fourStar int, fiveStar int)
as
begin
	--declare @result table(oneStar int, twoStar int, threeStar int, fourStar int, fiveStar int)
	declare @oneStar int = (
		select count(*) as num
		from Ratings r, Products p
		where r.productID = p.productID and p.sellerID = @sellerID and (r.ratingStar between 0 and 1)
	)
	declare @twoStar int = (
		select count(*) as num
		from Ratings r, Products p
		where r.productID = p.productID and p.sellerID = @sellerID and (r.ratingStar > 1 and r.ratingStar <= 2)
	)
	declare @threeStar int = (
		select count(*) as num
		from Ratings r, Products p
		where r.productID = p.productID and p.sellerID = @sellerID and (r.ratingStar > 2 and r.ratingStar <= 3)
	)
	declare @fourStar int = (
		select count(*) as num
		from Ratings r, Products p
		where r.productID = p.productID and p.sellerID = @sellerID and (r.ratingStar > 3 and r.ratingStar <= 4)
	)
	declare @fiveStar int = (
		select count(*) as num
		from Ratings r, Products p
		where r.productID = p.productID and p.sellerID = @sellerID and (r.ratingStar > 4 and r.ratingStar <= 5)
	)
	insert into @rtnTable values(@oneStar, @twoStar, @threeStar, @fourStar, @fiveStar);
	return
end
go
-- load the number of Product ratings classified into *, **, ***...
create function numberOfProductRatings(@productID int)
returns @rtnTable table(oneStar int, twoStar int, threeStar int, fourStar int, fiveStar int)
as
begin
	--declare @result table(oneStar int, twoStar int, threeStar int, fourStar int, fiveStar int)
	declare @oneStar int = (
		select count(*) as num from Ratings r
		where r.productID = @productID and (r.ratingStar > 0.9 and r.ratingStar < 1.1)
	)
	declare @twoStar int = (
		select count(*) as num from Ratings r
		where r.productID = @productID and (r.ratingStar > 1.9 and r.ratingStar < 2.1)
	)
	declare @threeStar int = (
		select count(*) as num from Ratings r
		where r.productID = @productID and (r.ratingStar > 2.9 and r.ratingStar < 3.1)
	)
	declare @fourStar int = (
		select count(*) as num from Ratings r
		where r.productID = @productID and (r.ratingStar > 3.9 and r.ratingStar < 4.1)
	)
	declare @fiveStar int = (
		select count(*) as num from Ratings r
		where r.productID = @productID and (r.ratingStar > 4.9 and r.ratingStar < 5.1)
	)
	insert into @rtnTable values(@oneStar, @twoStar, @threeStar, @fourStar, @fiveStar);
	return
end
go
-- load all the feedback of a product
create function loadFeedback(@productID int)
returns @rtntable table(displayName nvarchar(255), ratingStar float, detail nvarchar(255))
as
begin
	insert into @rtntable
		select u.displayName, r.ratingStar, r.detail
		from Ratings r, Buyers b, Users u
		where r.buyerID = b.buyerID and b.userID = u.userID and r.productID = @productID;
	return
end
go

--insert Rating
create procedure insert_Ratings
@productID int,
@buyerID int,
@detail nvarchar(255),
@ratingStar float,
@result bit = 'False' output
as 
begin
	insert into Ratings values(@productID,@buyerID,@detail,@ratingStar)
	set @result = 'True'
end
go
--insert Product
create procedure insert_Product -- get productID to add img (if necessary)
@sellerID int,
@name nvarchar(255),
@author nvarchar(255),
@publisher nvarchar(255),
@genrelID int,
@catID int,
@price int,
@discount int,
@numbersLeft int
as
begin
	insert into Products
	(sellerID,[name],author,publisher,genreID,categoryID,price,discount,numbersLeft)
	output inserted.productID
	values
	(@sellerID,@name,@author,@publisher,@genrelID,@catID,@price,@discount,@numbersLeft)
end

go
create procedure insert_ProductIMG
@productID int,
@img varchar(255),
@result bit = 'False' output
as
begin
	insert into ProductIMGs values(@productID,@img)
	set @result = 'True'
end
go

--set 0 to Product (unactived)
create procedure unactive_Product
@name nvarchar(255)
as
begin
	update Products
	set numbersLeft  = 0
	where [name] = @name
end