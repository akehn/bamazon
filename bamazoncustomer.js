const mysql = require('mysql');
const prompt = require('prompt');
const colors = require('colors/safe');
const Table = require('cli-table');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'bamazon',
});

let productPurchased = [];

connection.connect();

//Connect to mysql and pull the info from the products table
connection.query('SELECT ItemID, ProductName, Price FROM Products', (err, result) => {
	if (err) console.log(err);

	//Creates the CLI-Table and places the info into it
	let table = new Table({
		head: ['Item Id#', 'Product Name', 'Price'],
		style: {
			head: ['blue'],
			compact: false,
			colAligns: ['center'],
		}
	});

	//Loops through product table and pushes info into CLI-Table
	for (let i = 0; i < result.length; i++) {
		table.push(
			[result[i].ItemID, result[i].ProductName, result[i].Price]
		);
	}
	console.log(table.toString());

	purchase();
});

//Purchase function to purchase an item that is inside the CLI-Table
let purchase = function () {

	//Putting questions into a letiable that will be presented to the user
	let productInfo = {
		properties: {
			itemID: { description: colors.blue('Please enter the ID # of the item you wish to purchase!') },
			Quantity: { description: colors.green('How many items would you like to purchase?') }
		},
	};
	//Part of the "npm prompt" package... The code on how to use prompt can be found on the npm website and search for prompt.
	prompt.start();

	//This will grab what the user put in from the questions above. Part of prompt npm code.
	prompt.get(productInfo, (err, res) => {

		//Making a letiable to put the results of what the customer purchased
		let custPurchase = {
			itemID: res.itemID,
			Quantity: res.Quantity
		};

		//I am just passing what the customer purchased into this empty productPruchased array that i defined at the top
		productPurchased.push(custPurchase);

		//Makes connection to database and selects the item the customer cho0se above with the itemID number.
		connection.query('SELECT * FROM Products WHERE ItemID=?', productPurchased[0].itemID, (err, res) => {
			if (err) console.log(err, 'That item ID doesn\'t exist');

			//If quanity on hand is less than what customer wants to purchase you will be alerted that its out of stock
			if (res[0].StockQuantity < productPurchased[0].Quantity) {
				console.log('That product is out of stock!');
				connection.end();

				//Else if amount on hand is >= amount asked for then user gets message on the Item purchased, cost of item and total amount.
			} else if (res[0].StockQuantity >= productPurchased[0].Quantity) {

				console.log('');

				console.log(productPurchased[0].Quantity + ' items purchased');

				console.log(res[0].ProductName + ' ' + res[0].Price);

				//Calculates total purchase
				let saleTotal = res[0].Price * productPurchased[0].Quantity;

				//Connects to departments table - Updates SaleTotal for the item purchased. 
				connection.query("UPDATE Departments SET TotalSales = ? WHERE DepartmentName = ?;", [saleTotal, res[0].DepartmentName], (err, resultOne) => {
					if (err) console.log('error: ' + err);
					return resultOne;
				})

				console.log('Total: ' + saleTotal);

				// Variable that holds updated stock quantity of item purchased
				newQuantity = res[0].StockQuantity - productPurchased[0].Quantity;

				//Connects to products table - Updates stock quantity for items purchased
				connection.query("UPDATE Products SET StockQuantity = " + newQuantity + " WHERE ItemID = " + productPurchased[0].itemID, (err, res) => {

					console.log('');
					console.log(colors.cyan('Your order has been processed.  Thank you for shopping with us!'));
					console.log('');

					connection.end();
				})

			};

		})
	})

};

