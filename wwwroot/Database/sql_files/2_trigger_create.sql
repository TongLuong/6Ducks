USE dath_database
GO

-- Classify users into types
CREATE TRIGGER classify_new_user
ON Users
AFTER INSERT
AS
BEGIN
    -- Insert into Sellers for usertype 21
    INSERT INTO Sellers (userID, startingTime)
    SELECT userID, CONVERT(DATE, GETDATE())
    FROM inserted
    WHERE usertype = 21;

    -- Insert into Buyers for usertype 22
    INSERT INTO Buyers (userID)
    SELECT userID
    FROM inserted
    WHERE usertype = 22;

    -- Insert into Administrators for usertype 23
    INSERT INTO Administrators (userID)
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

-- check valid before applying voucher
--------------------------------

