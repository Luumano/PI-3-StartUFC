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

INSERT INTO [User] (Name, Email, IsAdmin, Cpf, Phone, PasswordSalt, PasswordHash, CreationUserId, CreatedAt)
VALUES 
('Alice Silva', 'alice@email.com', 0, '12345678901', '85999990001', 'nXhIIt6Pxt/yDng2DmVHYQ==', 'W0UDHT/UqcPiAREeutn87Ye+ESbgSzwRhh8TkwhUDghTshDWsu1l44SHKckzlro/ABZKvsTlEv3a5QdPi+hwTg==', 1, GETDATE()),

('Bruno Costa', 'bruno@email.com', 0, '12345678902', '85999990002', 'NA5FywdgVV2BMIBJNgAW+Q==', 'dxkpXJ0WrH/2cnhsHqKJQ27rBmqaz4M5wCd9DWl1bNjczPVxXvDvnz1QbqWWDwcxX9uRBmCJTvDRWJJf7ZHhHQ==', 1, GETDATE()),

('Carla Mendes', 'carla@email.com', 0, '12345678903', '85999990003', 'wHMYN/KXQEr6wTmc7ussdA==', 'haR2i0Yn9iNrL2eWeHSA61JZcQZ/1VtVTFZcfjSRSg7RybuZWpE+dyhz01dD0sFuh8/EhbJ+6t3jXnAeoT1DTw==', 1, GETDATE()),

('Daniel Souza', 'daniel@email.com', 0, '12345678904', '85999990004', 'Jh3r7gZ1t54BSJit8LE7ZQ==', 'QezXmsHcfu2tuhCYSSkecsOcgTI9suRNl6IJBJRoTwOakKgFoOESXg7zs+TaFiKmimNZi/bAECnTdIEW0EckWA==', 1, GETDATE()),

('Ellen Rocha', 'ellen@email.com', 0, '12345678905', '85999990005', 'fvuQ7figBmPIKZmnXeyr9w==', 'x0tkOnHfDD6yibfR1wfVsWOxqfB1v9JUFF6ZyloqmIuMtlTKG1DaezN0nwa5iu/90Xj/vG8wnfoWrnslJCJ+mg==', 1, GETDATE());


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE TABLE [dbo].[Event] (
    [Id] BIGINT IDENTITY(1,1) PRIMARY KEY,    
    [Name] NVARCHAR(50) NOT NULL,
    [Description] NVARCHAR(255) NULL,
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

INSERT INTO [dbo].[Event] (    
    [Name],
    [Description],
    [StartTime],
    [EndTime],
    [Date],
    [Place],
    [Capacity],
    [CreationUserId],
    [CreatedAt],
    [DeletedAt]
)
VALUES
('Workshop de C# Avançado', 'Evento voltado para desenvolvedores com experiência em C#, abordando tópicos avançados.', '14:00', '17:00', '2025-08-15', 'Auditório Principal - Campus TI', 100, 1, GETDATE(), NULL),

('Palestra: Inovação e Startups', 'Discussão sobre como transformar ideias em negócios escaláveis, com cases reais.', '10:00', '12:00', '2025-09-02', 'Sala 101 - Bloco Inovação', 80, 1, GETDATE(), NULL),

('Curso Introdutório de Docker', 'Treinamento prático para iniciantes sobre containers e deploy de aplicações.', '09:00', '13:00', '2025-09-10', 'Laboratório 3 - Campus TI', 40, 1, GETDATE(), NULL),

('Encontro de Desenvolvedores .NET', 'Networking e troca de experiências entre desenvolvedores da comunidade .NET.', '18:00', '21:00', '2025-09-25', 'Espaço Coworking', 60, 1, GETDATE(), NULL),

('Seminário sobre Inteligência Artificial', 'Debate sobre aplicações práticas de IA e tendências para os próximos anos.', '15:00', '18:30', '2025-10-05', 'Auditório Principal - Campus TI', 120, 1, GETDATE(), NULL);

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE Supporter (
    Id BIGINT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    [CreationUserId] BIGINT NOT NULL,
    [CreatedAt] DATETIME NOT NULL,
    [DeletedAt] DATETIME NULL
);

INSERT INTO Supporter (Name, Description, CreationUserId, CreatedAt, DeletedAt) VALUES 
('Empresa A', 'Patrocinador oficial do evento', 1, GETDATE(), NULL),
('Empresa B', 'Apoia projetos culturais', 1, GETDATE(), NULL);

------------------------------------------------------------------

CREATE TABLE News (
    Id BIGINT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    Content NVARCHAR(MAX) NULL,
    [CreationUserId] BIGINT NOT NULL,
    [CreatedAt] DATETIME NOT NULL,
    [DeletedAt] DATETIME NULL
);

INSERT INTO News (Title, Content, CreationUserId, CreatedAt, DeletedAt) VALUES
('Evento confirmado!', 'O evento ocorrerá no próximo mês com várias atrações.', 1, GETDATE(), NULL),
('Nova parceria', 'Anunciamos uma nova parceria com a Empresa B.', 1, GETDATE(), NULL);

------------------------------------------------------------------

CREATE TABLE Gallery (
    Id BIGINT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    [CreationUserId] BIGINT NOT NULL,
    [CreatedAt] DATETIME NOT NULL,
    [DeletedAt] DATETIME NULL
);

INSERT INTO Gallery (Title, CreationUserId, CreatedAt, DeletedAt) VALUES
('Galeria do Evento 2025', 1, GETDATE(), NULL),
('Galeria dos Bastidores', 1, GETDATE(), NULL);

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

