"""Module that interacts with the database of payments"""

from typing import Optional
from datetime import datetime, timedelta

import sqlite3
import os

from config import DATABASE_SCHEMA_URL, DATABASE_URL

# Get absolute path of directory for payments
dir_to_payments = os.path.dirname(os.path.abspath(__file__))
sqlPath = os.path.join(dir_to_payments, DATABASE_SCHEMA_URL)


def init_database() -> None:
  """Initialise database from schema"""

  # Create the data directory if not exists
  # Solution by https://stackoverflow.com/a/12517490
  os.makedirs(os.path.dirname(DATABASE_URL), exist_ok=True)

  #if os.path.isfile(DATABASE_URL):
  #return

  connection = sqlite3.connect(DATABASE_URL)
  with open(sqlPath, encoding="utf-8") as schema:
    connection.executescript(schema.read())

  connection.close()


def add_product(name: str, product_id: str, price: str, product_type: str):
  """Adds a new product to the database"""
  connection = sqlite3.connect(DATABASE_URL)
  cur = connection.cursor()
  cur.execute(
      """INSERT INTO products (product_id, productName, price, productType) 
        VALUES (?, ?, ?, ?)""", (product_id, name, price, product_type))
  last_row_id = cur.lastrowid
  connection.commit()
  connection.close()
  return last_row_id


def add_pending(user_id: int, event_id: int, starts: str, auth: str,
                checkout_id: str, product_type: str):
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  cur.execute("""INSERT INTO pending VALUES (NULL, ?, ?, ?, ?, ?, ?)""",
              (user_id, event_id, starts, checkout_id, auth, product_type))
  con.commit()
  con.close()


def add_booking(user_id: int, event_id: int, starts: str):
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  cur.execute("""UPDATE orders SET booking_id pending VALUES (?, ?, ?, ?, ?)""",
              (user_id, event_id, starts))
  con.commit()
  con.close()


def add_customer(user_id: int, stripe_id: str):
  """Function to add a new customer to the database"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  cur.execute("INSERT INTO customers VALUES (?, ?)", (user_id, stripe_id))
  con.commit()
  con.close()


def add_purchase(customer_id: str,
                 product_id: str,
                 purchase_date: str,
                 invoice_pdf: str,
                 purchase_price: float,
                 expiry: Optional[str] = None,
                 booking_id: Optional[int] = None):
  """Function that adds a new purchase to the database"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()

  cur.execute(
      """INSERT INTO orders 
      (user_id, 
      product_id, 
      purchaseDate, 
      expiryDate, 
      receipt_pdf, 
      booking_id,
      purchase_price)
      VALUES (?, ?, ?, ?, ?, ?, ?)""",
      (customer_id, product_id, purchase_date, expiry, invoice_pdf, booking_id,
       purchase_price))
  con.commit()
  con.close()


def get_user(user_id: int):
  """Function that finds the user in the database"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  find_user = cur.execute("""SELECT * FROM customers WHERE
    user_id = ?""", [user_id]).fetchone()
  con.close()
  return find_user


def get_user_from_stripe(stripe_id: str):
  """Function that finds the user id from their stripe id"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  find_user = cur.execute("""SELECT * FROM customers WHERE
    stripe_id = ?""", [stripe_id]).fetchone()
  con.close()
  return find_user[0]


def get_product(product_name: str):
  """Function to get the product by its product name from the database"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()

  product = cur.execute(
      """SELECT * FROM products WHERE
    productName LIKE ?""", [product_name]).fetchone()

  con.close()
  return product


def get_order(booking_id: int):
  """Function to get the order associated with a booking"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  order = cur.execute("""SELECT * FROM orders WHERE booking_id = ?""",
                      [booking_id]).fetchone()
  con.close()

  return order


def get_pricing_lists(product_type: str):
  """Returns pricing lists of products"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  products = cur.execute(
      """SELECT productName, price FROM products WHERE productType = ?""",
      [product_type]).fetchall()
  con.close()

  if not products:
    return None
  else:
    return [{"productName": row[0], "price": float(row[1])} for row in products]


def get_purchases(user_id: int):
  """Function to get the purchases for a specific user"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  purchased_products = cur.execute(
      """SELECT products.product_id, productType, purchaseDate, 
    expiryDate, receipt_pdf FROM orders JOIN products ON 
    orders.product_id = products.product_id WHERE orders.user_id = ?""",
      [user_id]).fetchall()
  con.close()
  return purchased_products


def get_purchase(product_id: str):
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  product = cur.execute("""SELECT * FROM products WHERE product_id = ?""",
                        [product_id])
  con.close()
  return product


def get_pending(checkout_id: str):
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  pending_bookings = cur.execute(
      """SELECT * FROM pending WHERE 
      checkout_id = ? ORDER BY(pending_id) ASC""", [checkout_id]).fetchall()
  con.close()
  return pending_bookings


def get_sales(product_type: str):
  """It returns the sale of the given product type as dictionaries"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()

  # Find products of the given product type
  products = cur.execute(
      """SELECT product_id, productName, productType, 
        price FROM products WHERE productType = ?""",
      [product_type]).fetchall()

  sales = []

  # get sales for each product
  for product in products:
    product_sales = cur.execute(
        "SELECT COUNT(*), SUM(orders.purchase_price) FROM orders "
        "WHERE orders.product_id = ? "
        "AND orders.purchaseDate BETWEEN ? AND ?",
        (product[0], datetime.now() - timedelta(days=7),
         datetime.now())).fetchone()

    if product_sales[0]:
      sales.append({
          "product_name": product[1],
          "product_type": product[2],
          "units_sold": product_sales[0],
          "total_sales": product_sales[1]
      })
  con.close()

  # Return sales amount
  return sales


def update_price(product_name: str, new_price: float):
  """Updates the price of a given product to a given price"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  cur.execute("""UPDATE products SET price = ? WHERE productName = ?""",
              (str(new_price), product_name))
  con.commit()
  con.close()


def update_expiry(stripe_user: str, product_id: str, expiry_date: str):
  '''Updates the expiry date of a subscription'''
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  user_id = cur.execute(
      '''SELECT user_id FROM customers WHERE
                         stripe_id = ?''', (stripe_user)).fetchone()
  cur.execute(
      """UPDATE orders SET expiryDate = ? WHERE product_id = ? 
                AND user_id = ?""", (expiry_date, product_id, user_id))
  con.commit()
  con.close()


def delete_order(order_id: int) -> None:
  """Function to delete a specific purchase by its order ID"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  cur.execute("""DELETE FROM orders WHERE order_id = ?""", [order_id])
  con.commit()
  con.close()


def delete_customer(user_id: int, stripe_id: str):
  """Function to delete a customer from the database"""
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  cur.execute("DELETE FROM customers WHERE user_id = ? AND stripe_id = ?",
              (user_id, stripe_id))
  con.commit()
  con.close()


def delete_pending(checkout_id: str):
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  cur.execute("DELETE FROM pending WHERE checkout_id = ?", [checkout_id])
  con.commit()
  con.close()


def delete_product(product_id: str):
  """Deletes a product from the database"""
  connection = sqlite3.connect(DATABASE_URL)
  cur = connection.cursor()
  cur.execute("DELETE FROM products WHERE product_id = ?", (product_id,))
  connection.commit()
  connection.close()


def check_pending(user_id: int, event_id: int, starts: str, auth: str):
  session = "not_found"
  con = sqlite3.connect(DATABASE_URL)
  cur = con.cursor()
  pendings = cur.execute(
      """SELECT * FROM pending WHERE user_id = ? 
      AND event_id = ? AND starts = ?""",
      (user_id, event_id, starts)).fetchall()
  if len(pendings) != 0:
    cur.execute(
        """UPDATE pending SET auth = ? WHERE user_id = ? 
        AND event_id = ? AND starts = ?""", (auth, user_id, event_id, starts))
    session = cur.execute(
        """SELECT checkout_id FROM pending WHERE user_id = ? 
      AND event_id = ? AND starts = ?""",
        (user_id, event_id, starts)).fetchone()
  con.commit()
  con.close()
  return session


def check_health() -> bool:
  """Gets the health of the database"""
  try:
    # tries to connect to db
    connection = sqlite3.connect(DATABASE_URL)
    cursor = connection.cursor()

    # try executing a simple query
    cursor.execute("SELECT 1")
    connection.close()

    # health check passed
    return True
  except sqlite3.Error:
    # something went wrong
    return False
