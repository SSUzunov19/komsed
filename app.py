"""
COMSED (КОМСЕД) — Уеб приложение за достъп до базата от данни
Автор: Стас Узунов, ф.н. 2MI0700362
СУ „Св. Климент Охридски", ФМИ, ИС

Инсталиране: pip install -r requirements.txt
Конфигурация: копирайте .env.example към .env и попълнете данните за връзка
Стартиране:   python app.py
"""

import os

from flask import Flask, render_template, request, redirect, url_for, flash
import ibm_db

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # python-dotenv е по желание — ако липсва, четем директно от средата
    pass

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'comsed-dev-secret-key')

# Настройки за връзка с DB2 — четат се от environment променливи (виж .env.example)
DB_CONFIG = {
    'database': os.getenv('DB2_DATABASE', 'SAMPLE'),
    'hostname': os.getenv('DB2_HOSTNAME', 'localhost'),
    'port': os.getenv('DB2_PORT', '50000'),
    'uid': os.getenv('DB2_UID', 'db2inst1'),
    'pwd': os.getenv('DB2_PWD', ''),
    'schema': os.getenv('DB2_SCHEMA', 'FN2MI0700362'),
}


def get_connection():
    conn_str = (
        f"DATABASE={DB_CONFIG['database']};"
        f"HOSTNAME={DB_CONFIG['hostname']};"
        f"PORT={DB_CONFIG['port']};"
        f"PROTOCOL=TCPIP;"
        f"UID={DB_CONFIG['uid']};"
        f"PWD={DB_CONFIG['pwd']};"
        f"CURRENTSCHEMA={DB_CONFIG['schema']};"
    )
    return ibm_db.connect(conn_str, '', '')


def execute_query(sql, params=None):
    conn = get_connection()
    try:
        if params:
            stmt = ibm_db.prepare(conn, sql)
            ibm_db.execute(stmt, params)
        else:
            stmt = ibm_db.exec_immediate(conn, sql)
        rows = []
        row = ibm_db.fetch_assoc(stmt)
        while row:
            rows.append(row)
            row = ibm_db.fetch_assoc(stmt)
        return rows
    finally:
        ibm_db.close(conn)


def execute_update(sql, params=None):
    conn = get_connection()
    try:
        if params:
            stmt = ibm_db.prepare(conn, sql)
            ibm_db.execute(stmt, params)
        else:
            ibm_db.exec_immediate(conn, sql)
        ibm_db.commit(conn)
        return True
    except Exception as e:
        ibm_db.rollback(conn)
        raise e
    finally:
        ibm_db.close(conn)

# ============================================================
# ROUTES
# ============================================================

@app.route('/')
def index():
    """Начална страница с обобщена информация"""
    try:
        products = execute_query("SELECT COUNT(*) AS CNT FROM PRODUCT")
        categories = execute_query("SELECT COUNT(*) AS CNT FROM CATEGORY")
        customers = execute_query("SELECT COUNT(*) AS CNT FROM CUSTOMER")
        orders = execute_query("SELECT COUNT(*) AS CNT FROM ORDERS")
        stats = {
            'products': products[0]['CNT'],
            'categories': categories[0]['CNT'],
            'customers': customers[0]['CNT'],
            'orders': orders[0]['CNT']
        }
    except:
        stats = {'products': 0, 'categories': 0, 'customers': 0, 'orders': 0}
    return render_template('index.html', stats=stats)

# --- PRODUCTS ---
@app.route('/products')
def products():
    rows = execute_query("""
        SELECT P.PRODUCT_ID, P.NAME, P.SKU, P.PRICE, P.PROMO_PRICE,
               P.QTY_IN_STOCK, P.BRAND_ID, P.IS_ACTIVE
        FROM PRODUCT P ORDER BY P.PRODUCT_ID
    """)
    return render_template('products.html', products=rows)

@app.route('/products/add', methods=['GET', 'POST'])
def product_add():
    if request.method == 'POST':
        sql = """INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE)
                 VALUES (?, ?, ?, ?, ?, ?, ?)"""
        promo = float(request.form['promo_price']) if request.form['promo_price'] else None
        params = (
            request.form['name'], request.form['sku'],
            float(request.form['price']), promo,
            int(request.form['qty']), request.form['brand'],
            int(request.form.get('is_active', 0))
        )
        execute_update(sql, params)
        flash('Продуктът е добавен успешно!', 'success')
        return redirect(url_for('products'))
    return render_template('product_form.html', product=None)

@app.route('/products/delete/<int:pid>')
def product_delete(pid):
    execute_update("DELETE FROM PRODUCT_CATEGORY WHERE PRODUCT_ID = ?", (pid,))
    execute_update("DELETE FROM PRODUCT_PROMOTION WHERE PRODUCT_ID = ?", (pid,))
    execute_update("DELETE FROM PRODUCT WHERE PRODUCT_ID = ?", (pid,))
    flash('Продуктът е изтрит.', 'warning')
    return redirect(url_for('products'))

# --- CATEGORIES ---
@app.route('/categories')
def categories():
    rows = execute_query("""
        SELECT C.CATEGORY_ID, C.NAME, C.SLUG, C.IS_ACTIVE,
               P.NAME AS PARENT_NAME,
               (SELECT COUNT(*) FROM PRODUCT_CATEGORY PC WHERE PC.CATEGORY_ID = C.CATEGORY_ID) AS PROD_COUNT
        FROM CATEGORY C LEFT JOIN CATEGORY P ON C.PARENT_ID = P.CATEGORY_ID
        ORDER BY C.CATEGORY_ID
    """)
    return render_template('categories.html', categories=rows)

# --- CUSTOMERS ---
@app.route('/customers')
def customers():
    rows = execute_query("""
        SELECT CU.CUSTOMER_ID, CU.FIRST_NAME, CU.LAST_NAME, CU.EMAIL, CU.PHONE,
               (SELECT COUNT(*) FROM ORDERS O WHERE O.CUSTOMER_ID = CU.CUSTOMER_ID) AS ORDER_COUNT
        FROM CUSTOMER CU ORDER BY CU.CUSTOMER_ID
    """)
    return render_template('customers.html', customers=rows)

@app.route('/customers/add', methods=['GET', 'POST'])
def customer_add():
    if request.method == 'POST':
        sql = "INSERT INTO CUSTOMER (FIRST_NAME, LAST_NAME, EMAIL, PHONE) VALUES (?, ?, ?, ?)"
        phone = request.form['phone'] if request.form['phone'] else None
        execute_update(sql, (request.form['first_name'], request.form['last_name'],
                             request.form['email'], phone))
        flash('Клиентът е добавен успешно!', 'success')
        return redirect(url_for('customers'))
    return render_template('customer_form.html')

# --- ORDERS ---
@app.route('/orders')
def orders():
    rows = execute_query("""
        SELECT O.ORDER_ID, O.STATUS, O.TOTAL, O.PAYMENT_METHOD, O.DELIVERY_METHOD,
               O.CREATED_AT, CU.FIRST_NAME || ' ' || CU.LAST_NAME AS CUSTOMER_NAME,
               (SELECT COUNT(*) FROM ORDER_ITEM OI WHERE OI.ORDER_ID = O.ORDER_ID) AS ITEM_COUNT
        FROM ORDERS O JOIN CUSTOMER CU ON O.CUSTOMER_ID = CU.CUSTOMER_ID
        ORDER BY O.CREATED_AT DESC
    """)
    return render_template('orders.html', orders=rows)

@app.route('/orders/<int:oid>')
def order_detail(oid):
    order = execute_query("""
        SELECT O.*, CU.FIRST_NAME || ' ' || CU.LAST_NAME AS CUSTOMER_NAME, CU.EMAIL
        FROM ORDERS O JOIN CUSTOMER CU ON O.CUSTOMER_ID = CU.CUSTOMER_ID
        WHERE O.ORDER_ID = ?
    """, (oid,))
    items = execute_query("""
        SELECT OI.*, P.NAME AS PRODUCT_NAME, P.SKU
        FROM ORDER_ITEM OI JOIN PRODUCT P ON OI.PRODUCT_ID = P.PRODUCT_ID
        WHERE OI.ORDER_ID = ?
    """, (oid,))
    return render_template('order_detail.html', order=order[0] if order else None, items=items)

# --- PROMOTIONS ---
@app.route('/promotions')
def promotions():
    rows = execute_query("""
        SELECT PR.PROMOTION_ID, PR.NAME, PR.DISCOUNT_PCT, PR.START_DATE, PR.END_DATE,
               PR.IS_ACTIVE,
               (SELECT COUNT(*) FROM PRODUCT_PROMOTION PP WHERE PP.PROMOTION_ID = PR.PROMOTION_ID) AS PROD_COUNT
        FROM PROMOTION PR ORDER BY PR.IS_ACTIVE DESC, PR.END_DATE DESC
    """)
    return render_template('promotions.html', promotions=rows)

# --- SQL CONSOLE ---
@app.route('/sql', methods=['GET', 'POST'])
def sql_console():
    results = None
    query = ''
    error = None
    if request.method == 'POST':
        query = request.form['query']
        try:
            results = execute_query(query)
        except Exception as e:
            error = str(e)
    return render_template('sql_console.html', results=results, query=query, error=error)

if __name__ == '__main__':
    debug = os.getenv('FLASK_DEBUG', '1') == '1'
    port = int(os.getenv('PORT', '5000'))
    app.run(debug=debug, host='0.0.0.0', port=port)
