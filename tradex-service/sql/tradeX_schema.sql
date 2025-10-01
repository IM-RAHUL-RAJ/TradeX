DROP TABLE trade;
DROP TABLE orders;
DROP TABLE price;
DROP TABLE instruments;
DROP TABLE clientIdentification;
DROP TABLE preferences;
DROP TABLE client;

CREATE TABLE client (
clientId   VARCHAR(50) PRIMARY KEY,
email VARCHAR(50),
password VARCHAR2(100),
dateOfBirth VARCHAR(50),
country VARCHAR(50),
postalCode  VARCHAR(50)
);

CREATE TABLE preferences(
clientId VARCHAR(50) PRIMARY KEY,
investmentPurpose VARCHAR(50),
riskTolerance VARCHAR(50),
incomeCategory VARCHAR(50),
lengthOfInvestment VARCHAR(50),
FOREIGN KEY(clientId) REFERENCES client(clientId)
);

CREATE TABLE clientIdentification(
clientId VARCHAR(50) PRIMARY KEY,
type VARCHAR(50),
value VARCHAR(50),
FOREIGN KEY(clientId) REFERENCES client(clientId)
);

CREATE TABLE instruments(
instrumentId VARCHAR(50) PRIMARY KEY,
description VARCHAR(50),
externalIdType VARCHAR(50),
externalId VARCHAR(50),
categoryId VARCHAR(50),
minQuantity INT,
maxQuantity INT
);

CREATE TABLE price(
instrumentId VARCHAR (50) PRIMARY KEY,
bidPrice FLOAT,
askPrice FLOAT,
timeStamp VARCHAR(50),
FOREIGN KEY(instrumentId) REFERENCES instruments(instrumentId)
);

CREATE TABLE orders(
orderId VARCHAR(50) PRIMARY KEY,
instrumentId VARCHAR(50),
clientId VARCHAR(50),
quantity FLOAT,
targetPrice FLOAT,
direction CHAR(1),
FOREIGN KEY(instrumentId) REFERENCES instruments(instrumentId),
FOREIGN KEY(clientId) REFERENCES client(clientId)
);

CREATE TABLE trade(
tradeId VARCHAR(50) PRIMARY KEY,
instrumentId VARCHAR(50),
clientId VARCHAR(50),
orderId VARCHAR(50),
quantity FLOAT,
executionPrice FLOAT,
direction CHAR(1),
cashValue FLOAT,
FOREIGN KEY(instrumentId) REFERENCES instruments(instrumentId),
FOREIGN KEY(clientId) REFERENCES client(clientId),
FOREIGN KEY(orderId) REFERENCES orders(orderId)
);