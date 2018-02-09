let mysql = require('mysql');
let prompt = require('prompt');
let colors = require('colors/safe');
let Table = require('cli-table');
let connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '1234',
	database: 'bamazon',
});

let inventoryUpdate = [];
let addedProduct = [];

connection.connect();

//Prompts that will initally load
let managerOptions = {
	properties:{
		mOptions:{
			description: colors.blue('Key in one of the following options: 1) View Products for Sale 2) View Low Inventory 3) Add to Inventory 4) Add New Product')
		},
	},
};

//Will start the Prompt
prompt.start();
//Prompts logic for the above choices
prompt.get(managerOptions, (err, res) => {
	if(res.mOptions == 1){
		viewProducts();
	} else if(res.mOptions == 2){
		viewInventory();
	} else if(res.mOptions == 3){
		addInventory();
	} else if(res.mOptions ==4){
		addNewProduct();
	} else {
		console.log('You picked an invalid choice.');
		connection.end();
	}
});

//Function for Option 1
let viewProducts = function(){
	//Connects to products table & returns the info for it
	connection.query('SELECT * FROM Products', (err, res) => {
		console.log('');
		console.log('Products for Sale')
		console.log('');	

		//Creates the table in the CLI app
		let table = new Table({
			head: ['Item Id#', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
			style: {
				head: ['blue'],
				compact: false,
				colAligns: ['center'],
			}
		});

		//Loops through items and pushes to the CLI table
		for(let i=0; i<res.length; i++){
			table.push(
				[res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
			);
		}

		//Logs table and ends connection
		console.log(table.toString());
		connection.end();
	})
};

//Second Function for second prompt option
let viewInventory = function(){

	//Connects to products table & returns items that have < 5 quantity
	connection.query('SELECT * FROM Products WHERE StockQuantity < 5', (err, res) => {
		console.log('');
		console.log('Items With Low Inventory');
		console.log('');

		//Creates the table in the CLI app
		let table = new Table({
			head: ['Item Id#', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
			style: {
				head: ['blue'],
				compact: false,
				colAligns: ['center'],
			}
		});

		//Loops through items and pushes to the CLI table
		for(let i=0; i<res.length; i++){
			table.push(
				[res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
			);
		}
		//Logs table and ends connection
		console.log(table.toString());
		connection.end();
	})
};

//Third Function for third prompt option
let addInventory = function(){

	//Variable that promptts info needed to replenish the stock quantity of the item chosen in the product list
	let addInvt = {
		properties:{
			inventoryID: {
				description: colors.green('What is the ID number of the product you want to add inventory for?')
			},
			inventoryAmount:{
				description: colors.green('How many items do you want to add to the inventory?')
			}
		},
	};

	prompt.start();

	//Grabs info entered fromt the prompt above
	prompt.get(addInvt, function(err, res){

		//Variable to hold answers to prompt questions
		let invtAdded = {
			inventoryAmount: res.inventoryAmount,
			inventoryID: res.inventoryID,
		}

		//Pushes all reponses to the InventoryUpdate array we created at the top
		inventoryUpdate.push(invtAdded);

		//Connect to products table sets stock to # entered from the prompt plus current stock quantity
		connection.query("UPDATE Products SET StockQuantity = (StockQuantity + ?) WHERE ItemID = ?;", [inventoryUpdate[0].inventoryAmount, inventoryUpdate[0].inventoryID], (err, result) => {

			if(err) console.log('error '+ err);

			//Grabs updated info from products table and sends fonfirmation to user with new stock amount
			connection.query("SELECT * FROM Products WHERE ItemID = ?", inventoryUpdate[0].inventoryID, (error, resOne) => {
				console.log('');
				console.log('The new updated stock quantity for id# '+inventoryUpdate[0].inventoryID+ ' is ' + resOne[0].StockQuantity);
				console.log('');
				connection.end();
			})

		})
	})
};

//Fourth Function for fourth prompt option
let addNewProduct = function(){
	//Variable that holds the questions from the user
	let newProduct = {
		properties: {
			newIdNum:{ description: colors.gray('Please enter a unique 5 digit item Id #')},
			newItemName:{ description: colors.gray('Please enter the name of the product you wish to add')},
			newItemDepartment: { description: colors.gray('What department does this item belong in?')},
			newItemPrice: { description: colors.gray('Please enter the price of the item in the format of 00.00')},
			newStockQuantity: { description: colors.gray('Please enter a stock quantity for this item')},
		}
	}

	prompt.start();

	//Grabs response from prompt
	prompt.get(newProduct, (err, res) => {

		//Variable that holds responses to be logged to
		let newItem = {
			newIdNum: res.newIdNum,
			newItemName: res. newItemName,
			newItemDepartment: res.newItemDepartment,
			newItemPrice: res.newItemPrice,
			newStockQuantity: res.newStockQuantity,

		};

		//Pushes repsonse data to the addedProduct array thats at the top of the page
		addedProduct.push(newItem);

	//Connects to products table & inserts the new product that we created
		connection.query('INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (?, ?, ?, ?, ?);', [addedProduct[0].newIdNum, addedProduct[0].newItemName, addedProduct[0].newItemDepartment, addedProduct[0].newItemPrice, addedProduct[0].newStockQuantity], (err, result) => {

			if(err) console.log('Error: ' + err);

			console.log('New item successfully added to the inventory!');
			console.log(' ');
			console.log('Item id#: ' + addedProduct[0].newIdNum);
			console.log('Item name: ' + addedProduct[0].newItemName);
			console.log('Department: ' + addedProduct[0].newItemDepartment);
			console.log('Price: $' + addedProduct[0].newItemPrice);
			console.log('Stock Quantity: ' + addedProduct[0].newStockQuantity);

			connection.end();
		})
	})
};
