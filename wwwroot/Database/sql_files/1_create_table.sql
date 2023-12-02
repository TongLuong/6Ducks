CREATE DATABASE dath_database
GO

USE dath_database
GO

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
CREATE TABLE Users (
    userID INTEGER IDENTITY(100000001, 1) PRIMARY KEY,
    displayName NVARCHAR(255),
    dob DATE,
    email VARCHAR(255),
    phoneNumber VARCHAR(255) UNIQUE,
    address NVARCHAR(255),
    usertype INTEGER,
    username VARCHAR(255),
    pass VARCHAR(255),
)
GO
alter table Users add transactionNumber varchar(16)
alter table Users add constraint Domain_number check(transactionNumber not like '%[^0-9]%') 


IF OBJECT_ID(N'dbo.Sellers', N'U') IS NULL
CREATE TABLE Sellers (
    sellerID INTEGER IDENTITY(210000001, 1) PRIMARY KEY ,
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES Users (userID),
    startingTime DATE,
    avgRating FLOAT DEFAULT 0,
    productSale INTEGER DEFAULT 0
)
GO

IF OBJECT_ID(N'dbo.Buyers', N'U') IS NULL
CREATE TABLE Buyers (
    buyerID INTEGER IDENTITY(220000001, 1) PRIMARY KEY,
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES Users (userID),
);
GO

IF OBJECT_ID(N'dbo.Administrators', N'U') IS NULL
CREATE TABLE Administrators (
    adminID INTEGER IDENTITY(230000001, 1) PRIMARY KEY,
    userID INTEGER,
    FOREIGN KEY (userID) REFERENCES Users (userID),
)

IF OBJECT_ID(N'dbo.Genres', N'U') IS NULL
CREATE TABLE Genres (
    genreID INTEGER IDENTITY(1001,1) PRIMARY KEY,
    name NVARCHAR(20),
)
GO

IF OBJECT_ID(N'dbo.Categories', N'U') IS NULL
CREATE TABLE Categories (
    categoryID INTEGER IDENTITY(2001,1) PRIMARY KEY,
    name NVARCHAR(20)
)
GO

IF OBJECT_ID(N'dbo.Products', N'U') IS NULL
CREATE TABLE Products (
    productID INTEGER IDENTITY(300000001,1) PRIMARY KEY,
    sellerID INTEGER,
    FOREIGN KEY (sellerID) REFERENCES Sellers (sellerID),
    name NVARCHAR(255),
    author NVARCHAR(255),
    publisher NVARCHAR(255),
    genreID integer,
    FOREIGN KEY (genreID) REFERENCES Genres (genreID),
    categoryID INTEGER,
    FOREIGN KEY (categoryID) REFERENCES Categories (categoryID),
    price INTEGER,
    discount FLOAT DEFAULT 0,
    avgStar FLOAT DEFAULT 0,
    ratingCount INTEGER DEFAULT 0,
    numbersLeft INTEGER,
    soldNumber INTEGER DEFAULT 0,
)
GO

IF OBJECT_ID(N'dbo.ProductIMGs', N'U') IS NULL
CREATE TABLE ProductIMGs (
    productID INTEGER,
    FOREIGN KEY (productID) REFERENCES Products (productID),
    imgLink VARCHAR(255)
)

IF OBJECT_ID(N'dbo.CartItems', N'U') IS NULL
CREATE TABLE CartItems (
    cartitemID INTEGER IDENTITY(400000001,1) PRIMARY KEY,
    buyerID INTEGER,
    FOREIGN key (buyerID) REFERENCES Buyers (buyerID),
    productID INTEGER,
    FOREIGN key (productID) REFERENCES Products (productID),
    quantity INTEGER,
    price INTEGER
)
GO

IF OBJECT_ID(N'dbo.PaymentMethods', N'U') IS NULL 
CREATE TABLE PaymentMethods (
    pmethodID INTEGER IDENTITY(3001,1) PRIMARY KEY,
    name NVARCHAR(255)
)
GO

IF OBJECT_ID(N'dbo.ShippingMethods', N'U') IS NULL
CREATE TABLE ShippingMethods (
    smethodID INTEGER IDENTITY(4001,1) PRIMARY KEY,
    name NVARCHAR(255),
)
GO

IF OBJECT_ID(N'dbo.Bills', N'U') IS NULL 
CREATE TABLE Bills (
    billID INTEGER IDENTITY(500000001,1) PRIMARY KEY,
    buyerID INTEGER,
    FOREIGN KEY (buyerID) REFERENCES Buyers (buyerID),
    sellerID INTEGER,
    FOREIGN KEY (sellerID) REFERENCES Sellers (sellerID),
    billStatus varchar(15),
    totalPrice INTEGER,
    time DATETIME, 
    address NVARCHAR(255),
    pmethodID INTEGER,
    FOREIGN KEY (pmethodID) REFERENCES PaymentMethods (pmethodID),
    smethodID INTEGER,
    FOREIGN KEY (smethodID) REFERENCES ShippingMethods (smethodID),
)
GO
alter table Bills alter column billStatus varchar(15)
alter table Bills add constraint Domain_status check(
billStatus = 'Confirming' or
billStatus = 'Waiting pickup' or
billStatus = 'Delivering'	or
billStatus = 'Done'or
billStatus = 'Cancelled' or
billStatus = 'Refund')

IF OBJECT_ID(N'dbo.BillItems', N'U') IS NULL
CREATE TABLE BillItems (
    billitemID INTEGER IDENTITY(600000001,1) PRIMARY KEY,
    billID INTEGER,
    FOREIGN KEY (billID) REFERENCES Bills (billID),
    productID INTEGER,
    FOREIGN key (productID) REFERENCES Products (productID),
    quantity INTEGER,
    price INTEGER
)
GO


IF OBJECT_ID(N'dbo.Ratings', N'U') IS NULL 
CREATE TABLE Ratings (
    productID INTEGER,
    FOREIGN key (productID) REFERENCES Products (productID),
    buyerID INTEGER,
    FOREIGN KEY (buyerID) REFERENCES Buyers (buyerID),
    detail NVARCHAR(255),
    ratingStar FLOAT,
)

IF OBJECT_ID(N'dbo.Vouchers', N'U') IS NULL 
CREATE TABLE Vouchers (
    voucherID INTEGER IDENTITY(700000001,1) PRIMARY KEY,
    timeStart DATETIME,
    timeExpired DATETIME,
    discountPercent FLOAT,
    maxValue INTEGER,
    minBill INTEGER,
)

IF OBJECT_ID(N'dbo.VoucherUse', N'U') IS NULL 
CREATE TABLE VoucherUse (
    voucherID INTEGER,
    FOREIGN KEY (voucherID) REFERENCES Vouchers (voucherID),
    categoryID INTEGER,
    FOREIGN KEY (categoryID) REFERENCES Categories (categoryID),
    sellerID INTEGER,
    FOREIGN KEY (sellerID) REFERENCES Sellers (sellerID)
)

IF OBJECT_ID(N'dbo.LogChat', N'U') IS NULL
CREATE TABLE LogChat(
    senderID INTEGER,
    FOREIGN KEY (senderID) REFERENCES Users (userID),
    receiverID INTEGER,
    FOREIGN KEY (receiverID) REFERENCES Users (userID),
    msg NVARCHAR(255),
    time DATETIME,
)

IF OBJECT_ID(N'dbo.Voucher_apply', N'U') IS NULL
CREATE TABLE Voucher_apply (
    billID int,
	voucherID int,
	constraint FK_apply_bid
		foreign key (billID) references Bills(billID),
	constraint FK_apply_vchID
		foreign key (voucherID) references Vouchers(voucherID),
)
GO
-- change 
alter table ShippingMethods add price int not null default 0
alter table ShippingMethods add constraint Domain_price_ship check(price >= 0)

alter table Vouchers add quantity int not null default 0