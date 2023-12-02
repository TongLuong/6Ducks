USE dath_database
GO

-- Classify users INTEGERo types
CREATE TRIGGER classify_new_user
ON Users
AFTER INSERT
AS
BEGIN
    -- Insert INTEGERo Sellers for usertype 21
    INSERT INTEGERO Sellers (userID, startingTime)
    SELECT userID, CONVERT(DATE, GETDATE())
    FROM inserted
    WHERE usertype = 21;

    -- Insert INTEGERo Buyers for usertype 22
    INSERT INTEGERO Buyers (userID)
    SELECT userID
    FROM inserted
    WHERE usertype = 22;

    -- Insert INTEGERo Administrators for usertype 23
    INSERT INTEGERO Administrators (userID)
    SELECT userID
    FROM inserted
    WHERE usertype = 23;
END;
GO

-- Increase seller's number of selling product when seller a new product is added
CREATE TRIGGER inc_seller_productSale
ON Products
AFTER INSERT
AS
BEGIN
    UPDATE Sellers
    SET Sellers.productSale = Sellers.productSale + 
        (SELECT COUNT(*) FROM inserted 
        WHERE Sellers.SellerID = inserted.sellerID)
    FROM Sellers INNER JOIN inserted ON Sellers.SellerID = inserted.sellerID;
END;
GO

-- Decrease seller's number of selling product when a product is deleted
CREATE TRIGGER remove_product
ON Products
AFTER DELETE
AS
BEGIN
    UPDATE Sellers
    SET Sellers.productSale = Sellers.productSale - 
        (SELECT COUNT(*) FROM deleted 
        WHERE Sellers.SellerID = deleted.sellerID)
    FROM Sellers INNER JOIN deleted ON Sellers.SellerID = deleted.sellerID;
END;
GO

-- Recalculate the average star of a product whenever it has a new feedback
CREATE TRIGGER avg_star_product
ON Ratings
AFTER INSERT 
AS
BEGIN 
    UPDATE Products
    SET 
        avgStar = (avgStar * ratingCount + (SELECT ratingStar from inserted)) / (ratingCount + 1),
        ratingCount = ratingCount + 1
    FROM Products INNER JOIN inserted 
    ON Products.productID = inserted.productID;
END;
GO

-- Recalculating seller's rating when a product changes its rating
CREATE TRIGGER seller_rating_update
ON Products
AFTER UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted)
    BEGIN
        UPDATE Sellers
        SET avgRating = (
            SELECT AVG(avgStar) FROM Products
            WHERE sellerID IN (SELECT sellerID FROM inserted) AND avgStar <> 0
        )
        WHERE sellerID IN (SELECT sellerID FROM inserted);
    END;
END;
GO

-- Decrease the number of available products when a bill item is created within a bill
CREATE TRIGGER dec_available_product
ON BillItems
AFTER INSERT
AS
BEGIN
    UPDATE Products
    SET numbersLeft = numbersLeft - quantity
    FROM Products INNER JOIN inserted
    ON Products.productID = inserted.productID;
END;
GO

-- check valid before insert applying voucher

-- update quantity of Voucher after inserting Apply

-- drop trigger update_quantity
CREATE TRIGGER update_quantity
ON Voucher_apply
AFTER INSERT
AS
BEGIN
	DECLARE @vchID INTEGER
	DECLARE @num_used INTEGER
	DECLARE cur CURSOR FOR (SELECT voucherID, count(*) AS num_used FROM inserted GROUP BY voucherID);
	OPEN cur
	FETCH FROM cur INTEGERo @vchID, @num_used
	WHILE @@FETCH_STATUS = 0
	BEGIN
		UPDATE Vouchers
		SET quantity = quantity - @num_used
		WHERE voucherID = @vchID;
		FETCH from cur INTEGER @vchID, @num_used
	END
	CLOSE cur
	DEALLOCATE cur
END
--------------------------------
