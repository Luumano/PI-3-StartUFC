CREATE TABLE [dbo].[User] (
    [Id] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(50) NOT NULL,
    [Email] NVARCHAR(50) NOT NULL,
    [PasswordHash] NVARCHAR(512) NOT NULL,
    [PasswordSalt] NVARCHAR(100) NOT NULL,
    [Phone] NVARCHAR(15) NULL,
    [Cpf] NVARCHAR(11) NULL,
    [IsAdmin] BIT NOT NULL DEFAULT 0,
    [CreationUserId] BIGINT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME NOT NULL,
    [DeletedAt] DATETIME NULL
);


CREATE TABLE [dbo].[Event] (
    [Id] BIGINT IDENTITY(1,1) PRIMARY KEY,    
    [Name] NVARCHAR(50) NOT NULL,
    [Description] NVARCHAR(1500) NULL,
    [StartTime] TIME NOT NULL,
    [EndTime] TIME NOT NULL,
    [Date] DATE NOT NULL,
    [Place] NVARCHAR(50) NOT NULL,
    [Capacity] INT NOT NULL,
	[CreationUserId] BIGINT NOT NULL,
	[CreatedAt] DATETIME NOT NULL,
    [DeletedAt] DATETIME NULL

    CONSTRAINT FK_Event_CreationUserId_User_Id FOREIGN KEY ([CreationUserId])
        REFERENCES [dbo].[User](Id)
);

CREATE TABLE [dbo].[UserEvent] (
    [Id] BIGINT IDENTITY(1,1) PRIMARY KEY,
    [UserId] BIGINT NOT NULL,
    [EventId] BIGINT NOT NULL,
    [Identifier] NVARCHAR(100) NOT NULL,
    [CreationUserId] BIGINT NOT NULL,
	[CreatedAt] DATETIME NOT NULL,
    [DeletedAt] DATETIME NULL

    CONSTRAINT FK_UserEvents_User_UserId FOREIGN KEY ([UserId])
        REFERENCES [dbo].[User]([Id]),

    CONSTRAINT FK_UserEvents_Events_EventId FOREIGN KEY ([EventId])
        REFERENCES [dbo].[Event]([Id])
);

CREATE TABLE Supporter (
    Id BIGINT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    [CreationUserId] BIGINT NOT NULL,
    [CreatedAt] DATETIME NOT NULL,
    [DeletedAt] DATETIME NULL
);


CREATE TABLE News (
    Id BIGINT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    Content NVARCHAR(MAX) NULL,
    [CreationUserId] BIGINT NOT NULL,
    [CreatedAt] DATETIME NOT NULL,
    [DeletedAt] DATETIME NULL
);

CREATE TABLE Gallery (
    Id BIGINT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    [CreationUserId] BIGINT NOT NULL,
    [CreatedAt] DATETIME NOT NULL,
    [DeletedAt] DATETIME NULL
);

CREATE TABLE [Image] (
    [Id] BIGINT PRIMARY KEY IDENTITY(1,1),
    EventId BIGINT NULL,
    NewsId BIGINT NULL,
    SupporterId BIGINT NULL,
    GalleryId BIGINT NULL,
    [Filename] NVARCHAR(255) NOT NULL,
    Extension NVARCHAR(20) NOT NULL,
    [CreatedAt] DATETIME NOT NULL,
    [DeletedAt] DATETIME NULL
);