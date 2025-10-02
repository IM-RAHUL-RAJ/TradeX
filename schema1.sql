DROP TABLE trade;
DROP TABLE orders;
DROP TABLE price;
DROP TABLE portfolioPosition;
DROP TABLE instruments;
DROP TABLE clientIdentification;
DROP TABLE preferences;
DROP TABLE client;

CREATE TABLE client (
    clientId       VARCHAR2(50 BYTE) PRIMARY KEY,
    email          VARCHAR2(50 BYTE),
    password       VARCHAR2(100 BYTE),
    dateOfBirth    VARCHAR2(50 BYTE),
    country        VARCHAR2(50 BYTE),
    postalCode     VARCHAR2(50 BYTE),
    cashBalance    FLOAT
);

CREATE TABLE preferences (
    clientId           VARCHAR2(50 BYTE) PRIMARY KEY,
    investmentPurpose  VARCHAR2(50 BYTE),
    riskTolerance      VARCHAR2(50 BYTE),
    incomeCategory     VARCHAR2(50 BYTE),
    lengthOfInvestment VARCHAR2(50 BYTE),
    roboAdvisor        NUMBER(1,0),
    FOREIGN KEY (clientId) REFERENCES client(clientId)
);

CREATE TABLE clientIdentification (
    clientId VARCHAR2(50 BYTE) PRIMARY KEY,
    type     VARCHAR2(50 BYTE),
    value    VARCHAR2(50 BYTE),
    FOREIGN KEY (clientId) REFERENCES client(clientId)
);

CREATE TABLE instruments (
    instrumentId    VARCHAR2(50 BYTE) PRIMARY KEY,
    description     VARCHAR2(50 BYTE),
    externalIdType  VARCHAR2(50 BYTE),
    externalId      VARCHAR2(50 BYTE),
    categoryId      VARCHAR2(50 BYTE),
    minQuantity     NUMBER(38,0),
    maxQuantity     NUMBER(38,0)
);

CREATE TABLE price (
    instrumentId VARCHAR2(50 BYTE) PRIMARY KEY,
    bidPrice     FLOAT,
    askPrice     FLOAT,
    timeStamp    VARCHAR2(50 BYTE),
    FOREIGN KEY (instrumentId) REFERENCES instruments(instrumentId)
);

CREATE TABLE orders (
    orderId      VARCHAR2(50 BYTE) PRIMARY KEY,
    instrumentId VARCHAR2(50 BYTE),
    clientId     VARCHAR2(50 BYTE),
    quantity     FLOAT,
    targetPrice  FLOAT,
    direction    CHAR(1 BYTE),
    FOREIGN KEY (instrumentId) REFERENCES instruments(instrumentId),
    FOREIGN KEY (clientId) REFERENCES client(clientId)
);

CREATE TABLE portfolioPosition (
    instrumentId VARCHAR2(50 BYTE),
    clientId     VARCHAR2(50 BYTE),
    description  VARCHAR2(50 BYTE),
    quantity     NUMBER(38,0),
    cost         NUMBER(38,0),
    PRIMARY KEY (instrumentId, clientId),
    FOREIGN KEY (instrumentId) REFERENCES instruments(instrumentId),
    FOREIGN KEY (clientId) REFERENCES client(clientId)
);

CREATE TABLE trade (
    tradeId        VARCHAR2(50 BYTE) PRIMARY KEY,
    instrumentId   VARCHAR2(50 BYTE),
    clientId       VARCHAR2(50 BYTE),
    orderId        VARCHAR2(50 BYTE),
    quantity       FLOAT,
    executionPrice FLOAT,
    direction      CHAR(1 BYTE),
    cashValue      FLOAT,
    FOREIGN KEY (instrumentId) REFERENCES instruments(instrumentId),
    FOREIGN KEY (clientId) REFERENCES client(clientId),
    FOREIGN KEY (orderId) REFERENCES orders(orderId)
);