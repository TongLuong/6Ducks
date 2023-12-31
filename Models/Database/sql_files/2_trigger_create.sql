USE dath_database
GO

-- Classify users INTO types
CREATE TRIGGER classify_new_user
ON Users
AFTER INSERT
AS
BEGIN
    DECLARE @uID INTEGER
    DECLARE @uType INTEGER
    DECLARE cur1 CURSOR FOR (SELECT userID, usertype from inserted)
    OPEN cur1
    FETCH FROM cur1 INTO @uID, @uType
    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF (@uType = 21)
        BEGIN
            INSERT INTO Sellers (userID, startingTime)
            VALUES (@uID, GETDATE())
        END
        ELSE 
        IF (@uType = 22)
        BEGIN
            INSERT INTO Buyers (userID)
            VALUES (@uID)
        END
        ELSE 
        BEGIN
            INSERT INTO Administrators (userID)
            VALUES (@uID)
        END
        FETCH NEXT FROM cur1 INTO @uID, @uType
    END
    CLOSE cur1
    DEALLOCATE cur1
END
GO

-- Increase seller's number of selling product when seller a new product is added
CREATE TRIGGER inc_seller_productSale
ON Products
AFTER INSERT
AS
BEGIN
    DECLARE @slrID INTEGER
    DECLARE @qtt INTEGER
    DECLARE cur2 CURSOR FOR (SELECT sellerID, COUNT(*) AS quantity FROM inserted GROUP BY sellerID)
    OPEN cur2
    FETCH FROM cur2 INTO @slrID, @qtt
    WHILE @@FETCH_STATUS = 0
    BEGIN
        UPDATE Sellers
        SET productSale = productSale + @qtt
        WHERE sellerID = @slrID
        FETCH NEXT FROM cur2 INTO @slrID, @qtt
    END
    CLOSE cur2
    DEALLOCATE cur2
END
GO

-- Decrease seller's number of selling product when a product is deleted (gonna delete)
--drop trigger remove_product
CREATE TRIGGER remove_product
ON Products
AFTER DELETE
AS
BEGIN

    DECLARE @slrID INTEGER
    DECLARE @qtt INTEGER
    DECLARE cur3 CURSOR FOR (SELECT sellerID, COUNT(*) AS quantity FROM deleted GROUP BY sellerID)
    OPEN cur3
    FETCH FROM cur3 INTO @slrID, @qtt
    WHILE @@FETCH_STATUS = 0
    BEGIN
        UPDATE Sellers
        SET productSale = productSale - @qtt
        WHERE sellerID = @slrID
        FETCH NEXT FROM cur3 INTO @slrID, @qtt
    END
    CLOSE cur3
    DEALLOCATE cur3
END
GO

-- Recalculate the average star of a product whenever it has a new feedback
--DROP TRIGGER avg_star_product
CREATE TRIGGER avg_star_product
ON Ratings
AFTER INSERT, UPDATE
AS
BEGIN
    DECLARE @prdID INTEGER
    DECLARE @avg_star FLOAT
	DECLARE @num_rate FLOAT
    DECLARE cur4 CURSOR FOR (SELECT productID, AVG(ratingStar), COUNT(*) FROM Ratings GROUP BY productID)
    OPEN cur4
    FETCH FROM cur4 INTO @prdID, @avg_star, @num_rate
    WHILE @@FETCH_STATUS = 0
    BEGIN
        UPDATE Products
        SET
            avgStar = @avg_star,
            ratingCount = @num_rate
        WHERE productID = @prdID
        FETCH NEXT FROM cur4 INTO @prdID, @avg_star, @num_rate
    END
    CLOSE cur4
    DEALLOCATE cur4  
END
GO

-- Recalculating seller's rating when a product changes its rating
CREATE TRIGGER seller_rating_update
ON Products
AFTER UPDATE
AS
BEGIN
    DECLARE @slrID INTEGER
    DECLARE cur5 CURSOR FOR (SELECT sellerID FROM inserted GROUP BY sellerID)
    OPEN cur5
    FETCH FROM cur5 INTO @slrID
    WHILE @@FETCH_STATUS = 0
    BEGIN
        UPDATE Sellers
        SET avgRating = (
            SELECT AVG(avgStar) as avg FROM Products
            WHERE (sellerID = @slrID) AND (avgStar <> 0)
        )
        WHERE sellerID = @slrID
        FETCH NEXT FROM cur5 INTO @slrID
    END
    CLOSE cur5
    DEALLOCATE cur5  
END
GO

-- Decrease the number of available products when a bill item is created within a bill
CREATE TRIGGER dec_available_product
ON BillItems
AFTER INSERT
AS
BEGIN
    DECLARE @prdID INTEGER
    DECLARE @qtt INTEGER
    DECLARE cur6 CURSOR FOR (SELECT productID, quantity FROM inserted)
    OPEN cur6
    FETCH FROM cur6 INTO @prdID, @qtt
    WHILE @@FETCH_STATUS = 0
    BEGIN 
        UPDATE Products
        SET numbersLeft = numbersLeft - @qtt
        WHERE productID = @prdID
        FETCH NEXT FROM cur6 INTO @prdID, @qtt
    END
    CLOSE cur6
    DEALLOCATE cur6
END
GO

-- check valid before insert applying voucher (we will use function to list appliable vouchers)

-- update quantity of Voucher after inserting Apply
-- DROP TRIGGER update_quantity_and_check_condition
CREATE TRIGGER update_quantity_and_check_condition
ON VoucherApply
AFTER INSERT, UPDATE
AS
BEGIN
	DECLARE @vchID INTEGER
	DECLARE @num_used INTEGER
	DECLARE cur7 CURSOR FOR (SELECT voucherID, count(*) AS num_used FROM inserted GROUP BY voucherID)
	OPEN cur7
	FETCH FROM cur7 INTO @vchID, @num_used
	WHILE @@FETCH_STATUS = 0
	BEGIN
		UPDATE Vouchers
		SET quantity = quantity - @num_used
		WHERE voucherID = @vchID
		FETCH NEXT FROM cur7 INTO @vchID, @num_used
	END
	CLOSE cur7
	DEALLOCATE cur7

	--=============check_condition_on_voucher_apply=============
	DECLARE @billID INTEGER
	DECLARE @voucherID INTEGER
	DECLARE @categoryID INTEGER = NULL
	DECLARE @sellerID INTEGER = NULL
	DECLARE @totalCost INTEGER = NULL
	DECLARE cur9 CURSOR LOCAL FOR 
	(
		SELECT i.billID, i.voucherID, 
			vu.categoryID, vu.sellerID
		FROM inserted i, VoucherUse vu
		WHERE i.voucherID = vu.voucherID
	)

	OPEN cur9
	FETCH FROM cur9 INTO @billID, @voucherID, @categoryID,
		@sellerID

	WHILE @@FETCH_STATUS = 0
	BEGIN
		IF NOT EXISTS
		(
			SELECT *
			FROM Bills b, BillItems bi, Products p
			WHERE b.billID = @billID
				AND bi.billID = b.billID
				AND p.productID = bi.productID
				AND ((@categoryID IS NULL) OR (p.categoryID = @categoryID))
				AND ((@sellerID IS NULL) OR (p.sellerID = @sellerID))
		)
		BEGIN
			ROLLBACK TRANSACTION
			CLOSE cur9
			DEALLOCATE cur9
			RETURN
		END

		FETCH FROM cur9 INTO @billID, @voucherID, @categoryID,
			@sellerID
	END
	CLOSE cur9
	DEALLOCATE cur9
END

GO
-- update total price in Bills after insert into BillItems
-- DROP TRIGGER update_total_price
CREATE TRIGGER update_total_price
ON BillItems
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
	DECLARE @totalCost INTEGER = NULL
	DECLARE @currBillID INTEGER
	DECLARE cur8 CURSOR FOR
	(SELECT billID FROM Bills)

	OPEN cur8
	FETCH FROM cur8 INTO @currBillID
	WHILE @@FETCH_STATUS = 0
	BEGIN
		SELECT @totalCost = dbo.[checkBillPrice](@currBillID)

		UPDATE Bills
		SET totalPrice = @totalCost
		WHERE billID = @currBillID

		FETCH FROM cur8 INTO @currBillID
	END

	CLOSE cur8
	DEALLOCATE cur8
END

GO
--------------------------------