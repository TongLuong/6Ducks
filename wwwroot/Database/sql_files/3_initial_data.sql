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
    (210000001, N'Điều kì diệu của tiệm tạp hóa Namiya', N'Higashino Keigo', N'Hội Nhà Văn', 1004, 2003, 129000, 100),
    (210000002, N'Conan Thám tử lừng danh -  Tập 100', N'Gosho Aoyama', N'Kim Đồng', 1016, 2006, 30000, 80),
    (210000002, N'Thiên sứ nhà bên - Tập 1', N'Yamada Taro', N'Trẻ', 1010, 2003, 95000, 120),
    (210000003, N'Thay đổi cuộc sống với Nhân số học', N'David A. Phillps', N'Tổng hợp TPHCM', 1020, 2001, 248000, 90),
    (210000001, N'Muôn kiếp nhân sinh', N'Nguyên Phong', N'Hội Nhà Văn', 1009, 2004, 168000, 60),
    (210000004, N'Nghĩ giàu làm giàu (Tái bản 2020)', N'Napoleon Hill', N'Hội Nhà Văn', 1021, 2001, 88000, 150),
    (210000003, N'Sherlock Holmes toàn tập (Bộ 5 cuốn)', N'Conan Doyle', N'Trẻ', 1016, 2003, 590000, 45),
    (210000004, N'Bộ sách kể chuyện cuộc đời các thiên tài (Bộ 12 cuốn)', N'Virginia Woolf', N'Kim Đồng', 1022, 2001, 729000, 70)
GO