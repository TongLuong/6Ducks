USE dath_database
GO

INSERT INTO PaymentMethods
    (name)
VALUES
    (N'Thanh toán khi nhận hàng'), 
    (N'Thanh toán online')
GO

INSERT INTO ShippingMethods
    (name, price)
VALUES
    (N'Tiêu chuẩn', 27000), 
    (N'Nhanh', 54000), 
    (N'Hỏa tốc', 90000)
GO

INSERT INTO Genres
    (name)
VALUES
    (N'Bí ẩn'),
    (N'Bi kịch'),
    (N'Cổ tích'),
    (N'Giả tưởng'),
    (N'Hài hước'),
    (N'Hành động'),
    (N'Khoa học viễn tưởng'),
    (N'Kinh dị'),
    (N'Kinh điển '),
    (N'Lãng mạn'),
    (N'Ngụ ngôn'),
    (N'Phiêu lưu'),
    (N'Siêu nhiên'),
    (N'Tâm linh'),
    (N'Thể thao'),
    (N'Trinh thám'),
    (N'Âm nhạc'),
    (N'Chính trị'),
    (N'Giáo khoa'),
    (N'Khoa học'),
    (N'Kĩ năng sống'),
    (N'Kiến thức'),
    (N'Kinh tế'),
    (N'Lịch sử'),
    (N'Nghệ thuật'),
    (N'Ngôn ngữ'),
    (N'Phê bình văn học'),
    (N'Phóng sự'),
    (N'Tâm lí'),
    (N'Tham khảo'),
    (N'Tự sự'),
    (N'Văn hóa')
GO

INSERT INTO Categories
    (name)
VALUES
    (N'Sách'),
    (N'Tài liệu'),
    (N'Tiểu thuyết'),
    (N'Truyện dài'),
    (N'Truyện ngắn'),
    (N'Truyện tranh')
GO

INSERT INTO Users
    (displayName, dob, email, phoneNumber, address, usertype, username, pass)
VALUES
    (N'Nguyễn Văn A', '1990-05-15', 'nguyen.van.a@email.com', '0901934167', 
    N'Số nhà 789, Đường Nguyễn Văn Linh, Quận Thanh Khê, Đà Nẵng', 
    22, 'nguyenvana', '123456'),
    (N'Trần Thị B', '1985-08-22', 'tran.thi.b@email.com', '0987612311', 
    N'Số nhà 456, Đường Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội', 22, 'tranthib', '123456'),
    (N'Chilli Shop', '1982-11-10', 'le.van.c@email.com', '0978789622', 
    N'Hà Nội', 21, 'chillishop', '123456'),
    (N'Hoàng Thị D', '1995-03-18', 'hoang.thi.d@email.com', '0987190321', 
    N'Số nhà 1315, Đường Lý Thường Kiệt, Thành phố Vũng Tàu', 22, 'hoangthid', '123456'),
    (N'PA''s Shop', '1988-07-27', 'pham.van.e@email.com', '0826678192', 
    N'Thành phố Hồ Chí Minh', 21, 'phamvane', '123456'),
    (N'Ngô Thị F', '1992-09-05', 'ngo.thi.f@email.com', '0974567183',
    N'Số nhà 789, Đường Nguyễn Văn Linh, Quận Thanh Khê, Đà Nẵng', 22, 'ngothif', '123456'),
    (N'Sách Giá Rẻ', '1980-12-03', 'truong.van.g@email.com', '0385126371', 
    N'Đà Nẵng', 21, 'truongvang', '123456'),
    (N'Lý Thị H', '1987-04-25', 'ly.thi.h@email.com', '0879812738',
     N'Số nhà 123, Đường Lê Lai, Quận 1, Thành phố Hồ Chí Minh', 22, 'lythih', '123456'),
    (N'Nhat Store', '1998-01-08', 'dao.van.i@email.com', '0381623811', 
    N'Huế', 21, 'daovani', '123456'),    
    (N'Admin1', '1994-06-12', 'le.thi.k@email.com', '0987162388', 
    N'Số nhà 1011, Đường 30/4, Quận Ninh Kiều, Cần Thơ', 23, 'admin1', 'admin1')
GO

INSERT INTO Products
    (sellerID, name, author, publisher, genreID, categoryID, price, numbersLeft)
VALUES
    (210000001, N'Điều kì diệu của tiệm tạp hóa Namiya', N'Higashino Keigo', N'Hội Nhà Văn', 1004, 2003, 129000, 100), --300000001
    (210000002, N'Conan Thám tử lừng danh -  Tập 100', N'Gosho Aoyama', N'Kim Đồng', 1016, 2006, 30000, 80), --300000002
    (210000002, N'Thiên sứ nhà bên - Tập 1', N'Yamada Taro', N'Trẻ', 1010, 2003, 95000, 120),
    (210000003, N'Thay đổi cuộc sống với Nhân số học', N'David A. Phillps', N'Tổng hợp TPHCM', 1020, 2001, 248000, 90), --300000004
    (210000001, N'Muôn kiếp nhân sinh', N'Nguyên Phong', N'Hội Nhà Văn', 1009, 2004, 168000, 60),
    (210000004, N'Nghĩ giàu làm giàu (Tái bản 2020)', N'Napoleon Hill', N'Hội Nhà Văn', 1021, 2001, 88000, 150), --300000006
    (210000003, N'Sherlock Holmes toàn tập (Bộ 5 cuốn)', N'Conan Doyle', N'Trẻ', 1016, 2003, 590000, 45),
    (210000004, N'Bộ sách kể chuyện cuộc đời các thiên tài (Bộ 12 cuốn)', N'Virginia Woolf', N'Kim Đồng', 1022, 2001, 729000, 70) --300000008
GO

INSERT INTO ProductIMGs
    (productID, imgLink)
VALUES
    (300000001, '/assets/images/book-1-1.png'),
	(300000002, '/assets/images/book-2.png'),
	(300000003, '/assets/images/book-3.png'),
	(300000004, '/assets/images/book-4.png'),
	(300000005, '/assets/images/book-5.png'),
	(300000006, '/assets/images/book-6.png'),
	(300000007, '/assets/images/book-7.png'),
	(300000008, '/assets/images/book-8.png')
GO

INSERT INTO Ratings
    (productID,buyerID,detail,ratingStar)
VALUES
    (300000001,220000001,N'Sáng tạo và mô tả cuốn hút người đọc.',5),
    (300000001,220000002,N'Tác giả sử dụng ngôn ngữ một cách linh hoạt và hiệu quả.',5),
    (300000003,220000003,N'Sâu sắc và lôi cuốn, nhưng có thể quá phức tạp với một số độc giả.',4),
    (300000002,220000001,N'Cấu trúc câu chuyện thông tin hợp lý, nhưng một số đoạn mô tả có thể cần được rút gọn.',4),
    (300000001,220000004,N'Nhân vật cần thêm sự phức tạp ở một số điểm.',4),
    (300000004,220000002,N'Một số lỗi in ấn đánh máy nhỏ, cần kiểm tra và sửa chữa.',3),
    (300000003,220000004,N'Kết cấu câu chuyện có thể cần một chút điều chỉnh để tạo ra sự suôn sẻ hơn.',3),
    (300000003,220000002,N'Tựa sách khá đắt so với giá trị nó đem lại.',2),
    (300000005,220000001,N'Giao hàng chậm',2),
    (300000001,220000001,N'Sách bị rớt bản lề, cần được đổi trả.',1),
    (300000004,220000003,N'Nhân viên giao hàng thái độ kém, sách bị cong dập nhiều chỗ.',1)
GO

INSERT INTO LogChat
VALUES 
	(100000008,100000003,N'100000008',GETDATE()),
	(100000006,100000003,N'100000006',GETDATE()),
	(100000004,100000003,N'100000004',GETDATE()),
	(100000002,100000003,N'100000002',GETDATE()),
	(100000001,100000003,N'100000001',GETDATE()),
	(100000011,100000003,N'100000011',GETDATE())

--DBCC CHECKIDENT ('[Vouchers]', RESEED, 700000000);
INSERT INTO Vouchers(timeStart, timeExpired, discountPercent,
		maxValue, minBill, quantity, voucherType, [description])
VALUES -- voucherType: 0: product, 1: shipping
	(GETDATE(), GETDATE() + 155, 0.3, 100000, 50000, 100, 0,
	N'Voucher dùng cho Sách'),
	(GETDATE(), GETDATE() + 205, 0.1, 1000000, 50000, 1000, 0,
	N'Voucher dùng cho Tài liệu'),
	(GETDATE(), GETDATE() + 305, 0.15, 2000000, 10000, 2010, 0,
	N'Voucher dùng cho Tiểu thuyết'),
	(GETDATE(), GETDATE() + 285, 0.13, 150000, 50000, 112, 0,
	N'Voucher dùng cho Truyện dài'),
	(GETDATE(), GETDATE() + 135, 0.16, 70000, 50000, 500, 0,
	N'Voucher dùng cho Truyện ngắn'),
	(GETDATE(), GETDATE() + 500, 0.09, 5000000, 1000000, 600, 0,
	N'Voucher dùng cho Truyện tranh'),
	(GETDATE(), GETDATE() + 26, 0.05, 700000, 500000, 890, 1,
	N'Voucher vận chuyển'),
	(GETDATE(), GETDATE() + 8, 0.02, 50000, 30000, 50, 1,
	N'Voucher vận chuyển'),
	(GETDATE(), GETDATE() + 14, 0.5, 10000, 40000, 230, 1,
	N'Voucher vận chuyển'),
	(GETDATE(), GETDATE() + 56, 0.42, 5000, 50000, 545, 1,
	N'Voucher vận chuyển')
	
INSERT INTO VoucherUse VALUES
	(700000001, 2001, NULL),
	(700000002, 2002, NULL),
	(700000003, 2003, NULL),
	(700000004, 2004, NULL),
	(700000005, 2005, NULL),
	(700000006, 2006, NULL)