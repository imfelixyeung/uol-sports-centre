"""Module that interacts with the database of payments"""

import sqlite3
import os

# Get absolute path of directory for payments
dirtopayments = os.path.dirname(os.path.abspath(__file__))
sqlPath = os.path.join(dirtopayments, "paymentSchema.sql")


def init_database():
    '''Initialise database from schema'''
    connection = sqlite3.connect('database.db')
    with open(sqlPath, encoding="utf-8") as schema:
        connection.executescript(schema.read())
    connection.close()


def add_product(name, price_id, price, product_type):
    '''Adds a new product to the database'''
    connection = sqlite3.connect('database.db')
    cur = connection.cursor()
    cur.execute("INSERT INTO products VALUES (?, ?, ?, ?)",
                (price_id, name, price, product_type))
    price_id = cur.lastrowid
    connection.commit()
    connection.close()
    return price_id


def update_price(product_name, new_price):
    """Updates the price of a given product to a given price"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute('''UPDATE products SET price = ? WHERE productName = ?''',
                (new_price, product_name))
    con.commit()
    con.close()


def add_customer(user_id, stripe_id):
    """Function to add a new customer to the database"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute("INSERT INTO customers VALUES (?, ?)", (user_id, stripe_id))
    con.commit()
    con.close()


def add_purchase(customer_id, price_id, purchase_date):
    """Function that adds a new purchase to the database"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute(
        '''INSERT INTO orders (userID, priceID, purchaseDate)
    VALUES (?, ?, ?)''', (customer_id, price_id, purchase_date))
    con.commit()
    con.close()


def get_user(user_id):
    """Function that finds the user in the database"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    find_user = cur.execute('''SELECT * FROM customers WHERE
    userID = ?''', [user_id]).fetchone()
    con.close()
    return find_user


def get_product(product_name):
    """Function to get the product by its product name from the database"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    product = cur.execute(
        '''SELECT * FROM products WHERE
    productName LIKE ?''', [product_name]).fetchone()
    con.close()
    return product


def get_purchases(user_id):
    """Function to get a; the purchases for a specific user"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    purchased_products = cur.execute(
        '''SELECT * FROM orders
    JOIN products ON orders.priceID = products.priceID
    WHERE orders.userID = ?''', [user_id]).fetchall()
    return purchased_products
