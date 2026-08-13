USE MovieTicketBookingDB;
GO

CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20) NULL,
    DateOfBirth DATE NULL,
    Gender NVARCHAR(10) NULL,
    AvatarURL NVARCHAR(255) NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'Customer',
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE Genres (
    GenreID INT IDENTITY(1,1) PRIMARY KEY,
    GenreName NVARCHAR(50) NOT NULL UNIQUE
);
GO

CREATE TABLE Movies (
    MovieID INT IDENTITY(1,1) PRIMARY KEY,
    GenreID INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Duration INT NOT NULL,
    ReleaseDate DATE NULL,
    Language NVARCHAR(50) NULL,
    Country NVARCHAR(50) NULL,
    Director NVARCHAR(100) NULL,
    Cast NVARCHAR(255) NULL,
    PosterURL NVARCHAR(255) NULL,
    BannerURL NVARCHAR(255) NULL,
    TrailerURL NVARCHAR(255) NULL,
    AgeRating NVARCHAR(20) NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'Now Showing',
    CONSTRAINT FK_Movies_Genres
        FOREIGN KEY (GenreID) REFERENCES Genres(GenreID)
);
GO

CREATE TABLE Cinemas (
    CinemaID INT IDENTITY(1,1) PRIMARY KEY,
    CinemaName NVARCHAR(150) NOT NULL,
    Address NVARCHAR(255) NOT NULL,
    City NVARCHAR(100) NULL,
    Phone NVARCHAR(20) NULL
);
GO

CREATE TABLE Rooms (
    RoomID INT IDENTITY(1,1) PRIMARY KEY,
    CinemaID INT NOT NULL,
    RoomName NVARCHAR(50) NOT NULL,
    Capacity INT NOT NULL,
    CONSTRAINT FK_Rooms_Cinemas
        FOREIGN KEY (CinemaID) REFERENCES Cinemas(CinemaID)
);
GO

CREATE TABLE Seats (
    SeatID INT IDENTITY(1,1) PRIMARY KEY,
    RoomID INT NOT NULL,
    SeatNumber NVARCHAR(10) NOT NULL,
    SeatType NVARCHAR(20) NOT NULL DEFAULT 'Normal',
    IsActive BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Seats_Rooms
        FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);
GO

CREATE TABLE Showtimes (
    ShowtimeID INT IDENTITY(1,1) PRIMARY KEY,
    MovieID INT NOT NULL,
    RoomID INT NOT NULL,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Format NVARCHAR(20) NULL,
    AvailableSeats INT NULL,
    CONSTRAINT FK_Showtimes_Movies
        FOREIGN KEY (MovieID) REFERENCES Movies(MovieID),
    CONSTRAINT FK_Showtimes_Rooms
        FOREIGN KEY (RoomID) REFERENCES Rooms(RoomID)
);
GO

CREATE TABLE Bookings (
    BookingID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    ShowtimeID INT NOT NULL,
    BookingCode NVARCHAR(50) NOT NULL UNIQUE,
    BookingDate DATETIME NOT NULL DEFAULT GETDATE(),
    TotalAmount DECIMAL(10,2) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    QRCode NVARCHAR(255) NULL,
    CONSTRAINT FK_Bookings_Users
        FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Bookings_Showtimes
        FOREIGN KEY (ShowtimeID) REFERENCES Showtimes(ShowtimeID)
);
GO

CREATE TABLE Booking_Details (
    BookingDetailID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT NOT NULL,
    SeatID INT NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_BookingDetails_Bookings
        FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID),
    CONSTRAINT FK_BookingDetails_Seats
        FOREIGN KEY (SeatID) REFERENCES Seats(SeatID)
);
GO

CREATE TABLE Payments (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    BookingID INT NOT NULL UNIQUE,
    PaymentMethod NVARCHAR(50) NOT NULL,
    PaymentDate DATETIME NOT NULL DEFAULT GETDATE(),
    Amount DECIMAL(10,2) NOT NULL,
    PaymentStatus NVARCHAR(20) NOT NULL DEFAULT 'Success',
    TransactionCode NVARCHAR(100) NULL,
    CONSTRAINT FK_Payments_Bookings
        FOREIGN KEY (BookingID) REFERENCES Bookings(BookingID)
);
GO

CREATE TABLE Reviews (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    MovieID INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment NVARCHAR(500) NULL,
    ReviewDate DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Reviews_Users
        FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Reviews_Movies
        FOREIGN KEY (MovieID) REFERENCES Movies(MovieID)
);
GO

CREATE TABLE Favorites (
    FavoriteID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    MovieID INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Favorites_Users
        FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Favorites_Movies
        FOREIGN KEY (MovieID) REFERENCES Movies(MovieID)
);
GO

ALTER TABLE Seats
ADD CONSTRAINT UQ_Seats_Room_SeatNumber UNIQUE (RoomID, SeatNumber);
GO

ALTER TABLE Favorites
ADD CONSTRAINT UQ_Favorites_User_Movie UNIQUE (UserID, MovieID);
GO

ALTER TABLE Reviews
ADD CONSTRAINT UQ_Reviews_User_Movie UNIQUE (UserID, MovieID);
GO

INSERT INTO Genres (GenreName) VALUES
(N'Action'),
(N'Comedy'),
(N'Horror'),
(N'Romance'),
(N'Sci-Fi');
GO

INSERT INTO Users (FullName, Email, PasswordHash, Phone, Gender, Role)
VALUES
(N'Nguyen Van A', 'a@gmail.com', '123456', '0900000001', N'Male', 'Customer'),
(N'Tran Thi B', 'b@gmail.com', '123456', '0900000002', N'Female', 'Customer'),
(N'Le Van C', 'c@gmail.com', '123456', '0900000003', N'Male', 'Customer'),
(N'Pham Thi D', 'd@gmail.com', '123456', '0900000004', N'Female', 'Customer'),
(N'Admin', 'admin@gmail.com', 'admin123', '0900000000', N'Male', 'Admin');
GO

INSERT INTO Cinemas (CinemaName, Address, City, Phone)
VALUES
(N'CGV Aeon Mall', N'1 Đại lộ Bình Dương, Thuận An', N'Bình Dương', '0274000001'),
(N'Lotte Cinema Bình Dương', N'Becamex Tower, Thủ Dầu Một', N'Bình Dương', '0274000002');
GO

INSERT INTO Rooms (CinemaID, RoomName, Capacity)
VALUES
(1, 'Room 1', 40),
(1, 'Room 2', 40),
(2, 'Room 1', 40),
(2, 'Room 2', 40);
GO

INSERT INTO Movies
(GenreID, Title, Description, Duration, ReleaseDate, Language, Country, Director, Cast, PosterURL, BannerURL, TrailerURL, AgeRating, Status)
VALUES
(1, N'Avengers: Endgame', N'Siêu anh hùng cứu thế giới.', 181, '2019-04-26', N'English', N'USA', N'Anthony Russo', N'Robert Downey Jr.', 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNl5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg', 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNl5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg', 'trailer1.mp4', 'P13', 'Now Showing'),
(2, N'Home Alone', N'Phim hài gia đình.', 103, '1990-11-16', N'English', N'USA', N'Chris Columbus', N'Macaulay Culkin', 'https://m.media-amazon.com/images/M/MV5BMzFkM2YwOTQtYzk2Mi00N2VlLWE3NTItN2YwNDg1YmY0ZDNmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg', 'https://m.media-amazon.com/images/M/MV5BMzFkM2YwOTQtYzk2Mi00N2VlLWE3NTItN2YwNDg1YmY0ZDNmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', 'trailer2.mp4', 'P', 'Now Showing'),
(3, N'The Nun', N'Phim kinh dị về ma sơ.', 96, '2018-09-07', N'English', N'USA', N'Corin Hardy', N'Demián Bichir', 'https://m.media-amazon.com/images/M/MV5BMjM3NzQ5NDcxOF5BMl5BanBnXkFtZTgwNzM4MTQ5NTM@._V1_SX300.jpg', 'https://m.media-amazon.com/images/M/MV5BMjM3NzQ5NDcxOF5BMl5BanBnXkFtZTgwNzM4MTQ5NTM@._V1_.jpg', 'trailer3.mp4', 'T18', 'Now Showing'),
(4, N'Titanic', N'Chuyện tình trên tàu Titanic.', 195, '1997-12-19', N'English', N'USA', N'James Cameron', N'Leonardo DiCaprio', 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjFiXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg', 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjFiXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg', 'trailer4.mp4', 'P13', 'Now Showing'),
(5, N'Interstellar', N'Khám phá vũ trụ và hố đen.', 169, '2014-11-07', N'English', N'USA', N'Christopher Nolan', N'Matthew McConaughey', 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg', 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', 'trailer5.mp4', 'P13', 'Coming Soon');
GO

INSERT INTO Seats (RoomID, SeatNumber, SeatType) VALUES
(1,'A1','Normal'),(1,'A2','Normal'),(1,'A3','Normal'),(1,'A4','Normal'),(1,'A5','VIP'),
(1,'B1','Normal'),(1,'B2','Normal'),(1,'B3','Normal'),(1,'B4','Normal'),(1,'B5','VIP'),
(2,'A1','Normal'),(2,'A2','Normal'),(2,'A3','Normal'),(2,'A4','Normal'),(2,'A5','VIP'),
(2,'B1','Normal'),(2,'B2','Normal'),(2,'B3','Normal'),(2,'B4','Normal'),(2,'B5','VIP'),
(3,'A1','Normal'),(3,'A2','Normal'),(3,'A3','Normal'),(3,'A4','Normal'),(3,'A5','VIP'),
(3,'B1','Normal'),(3,'B2','Normal'),(3,'B3','Normal'),(3,'B4','Normal'),(3,'B5','VIP'),
(4,'A1','Normal'),(4,'A2','Normal'),(4,'A3','Normal'),(4,'A4','Normal'),(4,'A5','VIP'),
(4,'B1','Normal'),(4,'B2','Normal'),(4,'B3','Normal'),(4,'B4','Normal'),(4,'B5','VIP');
GO

INSERT INTO Showtimes (MovieID, RoomID, StartTime, EndTime, Price, Format, AvailableSeats)
VALUES
(1, 1, '2026-07-10 18:00:00', '2026-07-10 21:01:00', 90000, '2D', 40),
(1, 2, '2026-07-10 20:00:00', '2026-07-10 23:01:00', 100000, 'IMAX', 40),
(2, 3, '2026-07-10 17:00:00', '2026-07-10 18:43:00', 75000, '2D', 40),
(3, 4, '2026-07-10 19:30:00', '2026-07-10 21:06:00', 85000, '2D', 40),
(4, 1, '2026-07-11 18:00:00', '2026-07-11 21:15:00', 95000, '2D', 40),
(5, 2, '2026-07-11 20:00:00', '2026-07-11 22:49:00', 110000, 'IMAX', 40);
GO

INSERT INTO Bookings (UserID, ShowtimeID, BookingCode, TotalAmount, Status, QRCode)
VALUES
(1, 1, 'BK001', 180000, 'Paid', 'QR_BK001'),
(2, 2, 'BK002', 100000, 'Paid', 'QR_BK002');
GO

INSERT INTO Booking_Details (BookingID, SeatID, Price)
VALUES
(1, 1, 90000),
(1, 2, 90000),
(2, 11, 100000);
GO

INSERT INTO Payments (BookingID, PaymentMethod, Amount, PaymentStatus, TransactionCode)
VALUES
(1, 'Momo', 180000, 'Success', 'TXN001'),
(2, 'Card', 100000, 'Success', 'TXN002');
GO

INSERT INTO Reviews (UserID, MovieID, Rating, Comment)
VALUES
(1, 1, 5, N'Phim rất hay'),
(2, 1, 4, N'Kỹ xảo đẹp'),
(3, 4, 5, N'Phim cảm động');
GO

INSERT INTO Favorites (UserID, MovieID)
VALUES
(1, 1),
(1, 4),
(2, 2),
(3, 5);
GO