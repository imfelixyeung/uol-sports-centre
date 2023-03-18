"""Module that interacts with the database of payments"""

from typing import Optional

import sqlite3
import os

# Get absolute path of directory for payments
dirtopayments = os.path.dirname(os.path.abspath(__file__))
sqlPath = os.path.join(dirtopayments, "paymentSchema.sql")


def init_database() -> None:
    """Initialise database from schema"""
    connection = sqlite3.connect("database.db")
    with open(sqlPath, encoding="utf-8") as schema:
        connection.executescript(schema.read())
    connection.close()


def add_product(name: str, product_id: str, price: str, product_type: str):
    """Adds a new product to the database"""
    connection = sqlite3.connect("database.db")
    cur = connection.cursor()
    cur.execute("INSERT INTO products VALUES (?, ?, ?, ?)",
                (product_id, name, price, product_type))
    last_row_id = cur.lastrowid
    connection.commit()
    connection.close()
    return last_row_id


def update_price(product_name: str, new_price: str):
    """Updates the price of a given product to a given price"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute("""UPDATE products SET price = ? WHERE productName = ?""",
                (new_price, product_name))
    con.commit()
    con.close()


def update_expiry(stripe_user: str, product_id: str, expiry_date: str):
    '''Updates the expiry date of a subscription'''
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    user_id = cur.execute(
        '''SELECT userID FROM customers WHERE
                         stripeID = ?''', (stripe_user)).fetchone()
    cur.execute(
        """UPDATE orders SET expiryDate = ? WHERE productID = ? 
                AND userID = ?""", (expiry_date, product_id, user_id))
    con.commit()
    con.close()


def add_customer(user_id: int, stripe_id: str):
    """Function to add a new customer to the database"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute("INSERT INTO customers VALUES (?, ?)", (user_id, stripe_id))
    con.commit()
    con.close()


def add_purchase(customer_id: str,
                 product_id: str,
                 purchase_date: str,
                 expiry: Optional[str] = None):
    """Function that adds a new purchase to the database"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    if expiry is not None:
        cur.execute(
            """INSERT INTO orders (userID, productID, purchaseDate, expiryDate)
        VALUES (?, ?, ?)""", (customer_id, product_id, purchase_date, expiry))
    else:
        cur.execute(
            """INSERT INTO orders (userID, productID, purchaseDate)
        VALUES (?, ?, ?)""", (customer_id, product_id, purchase_date))
    con.commit()
    con.close()


def get_user(user_id: int):
    """Function that finds the user in the database"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    find_user = cur.execute("""SELECT * FROM customers WHERE
    userID = ?""", [user_id]).fetchone()
    con.close()
    return find_user


def get_product(product_name: str):
    """Function to get the product by its product name from the database"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    product = cur.execute(
        """SELECT * FROM products WHERE
    productName LIKE ?""", [product_name]).fetchone()
    con.close()
    return product


def get_pricing_lists():
    """Returns pricing lists of products"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    products = cur.execute("""SELECT productName, price FROM products""").fetchall()
    con.close()

    if not products:
        return None
    else:
        return products


def get_purchases(user_id: int):
    """Function to get a; the purchases for a specific user"""
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    purchased_products = cur.execute(
        """SELECT * FROM orders
    JOIN products ON orders.productID = products.productID
    WHERE orders.userID = ?""", [user_id]).fetchall()
    return purchased_products


def check_health() -> bool:
    """Gets the health of the database"""
    try:
        # tries to connect to db
        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()

        # try executing a simple query
        cursor.execute("SELECT 1")
        connection.close()

        # health check passed
        return True
    except sqlite3.Error:
        # something went wrong
        return False
