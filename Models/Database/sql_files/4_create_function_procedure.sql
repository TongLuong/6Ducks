﻿-- add function here
use [dath_database]

go
-- check valid pass and userID
--drop procedure checkValid
create procedure checkValid
@username varchar(255),
@email varchar(255) = null,
@pass varchar(255),
@status bit = 0 output,
@userID int = null output,
@userType int = null output
as
begin
	-- 21: buyer, 22: seller, 23: admin

	select @userID = userID, @userType = usertype
	from Users 
	where (username = @username or email = @email) and pass = @pass

	if @userID is not null
		set @status = 1
	else
		set @status = 0
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
	declare @res nvarchar(100) = N'Success';
	insert into LogChat values(
		@sndID,
		@rcvID,
		@msg,
		GETDATE()
	)	
	select @res;
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

-- drop procedure upload
create procedure upload
@seller_id int,
@img_path nvarchar(255),
@book_name nvarchar(255),
@quantity int,
@genre_id int,
@price int,
@category_id int,
@author nvarchar(255),
@publisher nvarchar(255)
as
begin
	insert into Products(sellerID,[name],author,publisher,genreID,categoryID,price,numbersLeft)
	values
	(@seller_id,@book_name,@author,@publisher,@genre_id,@category_id,@price,@quantity);

	declare @product_id int = (select productID from Products where [name]=@book_name and sellerID=@seller_id)

	insert into ProductIMGs values (@product_id, @img_path)
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
	select senderID, msg, [time]
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
@totalPrice int,
@address nvarchar(255),
@pmethod int,
@smethod int,
@discountVchID int = null,
@freeShipVchID int = null,
@billID int output
as
begin
	insert into Bills (buyerID,totalPrice,[address],pmethodID,smethodID,
	discountVoucher, freeshipVoucher)
	output inserted.billID
	values(
		@buyerID,@totalPrice,@address,@pmethod,@smethod,
		@discountVchID,@freeShipVchID
	)

	select @billID = scope_identity()
end

go
--insert BillItems (use BillID ) -- use loop in application
create procedure insert_BillItems
@sellerID int,
@BillID int,
@ProductID int,
@quantity int,
@price int
as
begin
	insert into BillItems (sellerID,billID,productID,quantity,price) values
	(@sellerID,@BillID,@ProductID,@quantity,@price)
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

go
--drop procedure insert_cart_item
create procedure insert_cart_item
@buyerID int,
@sellerID int,
@productID int,
@quantity int,
@price int
as
begin
	if exists
	(
		select * 
		from CartItems
		where buyerID = @buyerID and productID = @productID
	)
	begin
		update CartItems
		set quantity = quantity + @quantity
		where buyerID = @buyerID and productID = @productID
	end
	else
	begin
		insert into CartItems values 
		(@buyerID, @sellerID, @productID, @quantity, @price)
	end
end
go

--drop procedure insert_new_user
create procedure insert_new_user
@displayName nvarchar(255),
@dob date,
@email varchar(255),
@phoneNumber varchar(255),
@address nvarchar(255),
@usertype int,
@username varchar(255),
@pass varchar(255),
@transactionNumber varchar(16) = null
as
begin
	insert into [Users] (displayName,
						dob,
						email,
						phoneNumber,
						[address],
						usertype,
						username,
						pass,
						transactionNumber)
	values
	(
			@displayName,
			@dob,
			@email,
			@phoneNumber,
			@address,
			@usertype,
			@username,
			@pass,
			@transactionNumber
	)
end

go
create function get_type_id (@user_id int)
returns int
as
begin
	declare @result int = null
	select @result = sellerID
	from Sellers
	where userID = @user_id

	if @result is not null
		return @result

	set @result = null
	select @result = buyerID
	from Buyers
	where userID = @user_id

	if @result is not null
		return @result
	return null
end
go

--drop function display_conversation
go
create function display_conversation(@user_id int)
returns @rtntable table(buyerID int, buyerName nvarchar(255), msg nvarchar(255),[time] datetime)
as
begin
	declare @buyerID int,@buyerName nvarchar(255),@senderID int,@receiverID int,@msg  nvarchar(255),@time datetime;

	declare cur Cursor for 
	select l1.senderID,l1.receiverID,l1.msg,l1.[time]
	from LogChat l1
	where (l1.senderID=@user_id or l1.senderID=@user_id) and l1.[time] >= 
		(select l2.[time] 
		from LogChat l2 
		where (l2.senderID=@user_id or l2.senderID=@user_id))

	open cur
	fetch next from cur into @senderID,@receiverID,@msg,@time;

	while @@FETCH_STATUS=0
	begin
		if (@senderID=@user_id) 
			set @buyerID = @receiverID;
		else if (@receiverID=@user_id)
			set @buyerID=@senderID;
		set @buyerName=(select username from Users where userID=@buyerID);
		insert into @rtntable values(@buyerID,@buyerName,@msg,@time);
		fetch next from cur into @senderID,@receiverID,@msg,@time;
	end

	close cur;
	deallocate cur;

	return
end
go
