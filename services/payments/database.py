import sqlite3
import os

# Get absolute path of directory for payments
dirtopayments = os.path.dirname(os.path.abspath(__file__))
sqlPath = os.path.join(dirtopayments, "paymentSchema.sql")

def initDatabase():
    '''Initialise database from schema'''
    connection = sqlite3.connect('database.db')
    with open(sqlPath) as schema:
        connection.executescript(schema.read())
    connection.close()

def addProduct(name, priceID, price, type):
    '''Adds a new product to the database'''
    connection = sqlite3.connect('database.db')
    cur = connection.cursor()
    cur.execute("INSERT INTO products VALUES (?, ?, ?, ?)",
            (priceID, name, price, type))
    productID = cur.lastrowid
    connection.commit()
    connection.close()
    return productID

def updatePrice(productName, newPrice):
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute('''UPDATE products SET price = ? WHERE productName = ?''', (newPrice, productName))
    con.commit()
    con.close()

def addCustomer(userID, stripeID):
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute("INSERT INTO customers VALUES (?, ?)",
    (userID, stripeID))
    con.commit()
    con.close()

def addPurchase(customerID, priceID, purchaseDate):
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute('''INSERT INTO orders (userID, priceID, purchaseDate) 
    VALUES (?, ?, ?)''', (customerID, priceID, purchaseDate))
    con.commit()
    con.close()

def getUser(userID):
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    findUser = cur.execute('''SELECT * FROM customers WHERE
    userID = ?''', [userID]).fetchone()
    con.close()
    return findUser

def getProduct(productName):
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    product = cur.execute('''SELECT * FROM products WHERE 
    productName LIKE ?''', [productName]).fetchone()
    con.close()
    return product

def getPurchases(userID):
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    purchased_products = cur.execute('''SELECT * FROM orders
    JOIN products ON orders.priceID = products.priceID
    WHERE orders.userID = ?''',
    [userID]).fetchall()
    return purchased_products