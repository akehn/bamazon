CREATE DATABASE Bamazon;

USE bamazon;

CREATE TABLE Products (
ItemID int NOT NULL,
ProductName varchar(50) NOT NULL,
DepartmentName varchar(50) NOT NULL,
Price DECIMAL(4,2) NOT NULL,
StockQuantity int NOT NULL);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (
1000,
'Acer Aspire 3',
'Computers',
279.99,
5);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (
1001,
'WD Blue Mainstream 1TB',
'Computer Parts',
42.99,
30);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (
1002,
'Asus RT-AC3200 Tri-Band',
'Networking',
199.99,
15);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (
1003,
'Microsoft Xbox One S 1TB',
'Software Gaming',
349.99,
6);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (
1004,
'Activision Call of Duty WWII',
'Software Gaming',
59.99,
20);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (
1005,
'Apple iMac Pro 27" All-in-One',
'Apple',
3999.99,
8);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (
1006,
'Inland Cat 6 Bulk Cable 500ft',
'Accessories',
79.99,
15);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (
1007,
'ASUS GeForce GTX 1050 TI',
'Computer Parts',
229.99,
15);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (
1008,
'Dell P2012H 20" LED Monitor',
'Refurbished Deals',
59.99,
7);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (
1009,
'HiRO USB 3.0 Gigabit Adapter',
'Clearance',
19.99,
0);

USE bamazon;
CREATE TABLE Departments(
DepartmentId int AUTO_INCREMENT,
PRIMARY KEY(DepartmentId),
DepartmentName varchar(50) NOT NULL,
OverHeadCosts DECIMAL(11,2) NOT NULL,
TotalSales DECIMAL(11,2) NOT NULL);


INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales) VALUES (
'Computers',
10000,
0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales) VALUES (
'Computer Parts',
10000,
0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales) VALUES (
'Network',
20000,
0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales) VALUES (
'Software Gaming',
15000,
0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales) VALUES (
'Apple',
50000,
0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales) VALUES (
'Accessories',
25000,
0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales) VALUES (
'Refurbished Deals',
10000,
0);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales) VALUES (
'Clearance',
15000,
0);


-- This creates the alias table TotalProfits that will exist only when requested by the executive 
SHOW TABLES;
CREATE VIEW bamazon.TotalProfits AS SELECT DepartmentId, DepartmentName, OverHeadCosts, TotalSales, TotalSales-OverHeadCosts AS TotalProfit FROM Departments;
