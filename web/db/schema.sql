-- ============================================================
-- COMSED (КОМСЕД) — PostgreSQL схема (мигрирана от DB2)
-- Онлайн магазин за детски играчки
-- ============================================================

DROP TABLE IF EXISTS product_promotion CASCADE;
DROP TABLE IF EXISTS product_category CASCADE;
DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS promotion CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS category CASCADE;

-- 1. CATEGORY
CREATE TABLE category (
    category_id   INTEGER       GENERATED ALWAYS AS IDENTITY,
    name          VARCHAR(255)  NOT NULL,
    slug          VARCHAR(255)  NOT NULL,
    parent_id     INTEGER,
    description   VARCHAR(1000),
    is_active     SMALLINT      NOT NULL DEFAULT 1,
    CONSTRAINT pk_category       PRIMARY KEY (category_id),
    CONSTRAINT uq_category_slug  UNIQUE (slug),
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES category (category_id) ON DELETE SET NULL,
    CONSTRAINT ck_category_active CHECK (is_active IN (0, 1))
);

-- 2. PRODUCT
CREATE TABLE product (
    product_id    INTEGER       GENERATED ALWAYS AS IDENTITY,
    name          VARCHAR(500)  NOT NULL,
    sku           VARCHAR(100)  NOT NULL,
    price         DECIMAL(10,2) NOT NULL,
    promo_price   DECIMAL(10,2),
    qty_in_stock  INTEGER       NOT NULL DEFAULT 0,
    brand_id      VARCHAR(100),
    is_active     SMALLINT      NOT NULL DEFAULT 1,
    CONSTRAINT pk_product        PRIMARY KEY (product_id),
    CONSTRAINT uq_product_sku    UNIQUE (sku),
    CONSTRAINT ck_product_price  CHECK (price > 0),
    CONSTRAINT ck_product_promo  CHECK (promo_price IS NULL OR (promo_price > 0 AND promo_price < price)),
    CONSTRAINT ck_product_qty    CHECK (qty_in_stock >= 0),
    CONSTRAINT ck_product_active CHECK (is_active IN (0, 1))
);

-- 3. CUSTOMER
CREATE TABLE customer (
    customer_id   INTEGER       GENERATED ALWAYS AS IDENTITY,
    first_name    VARCHAR(100)  NOT NULL,
    last_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(255)  NOT NULL,
    phone         VARCHAR(20),
    CONSTRAINT pk_customer        PRIMARY KEY (customer_id),
    CONSTRAINT uq_customer_email  UNIQUE (email)
);

-- 4. ORDERS
CREATE TABLE orders (
    order_id        INTEGER       GENERATED ALWAYS AS IDENTITY,
    status          VARCHAR(20)   NOT NULL DEFAULT 'pending',
    total           DECIMAL(10,2) NOT NULL,
    payment_method  VARCHAR(20)   NOT NULL,
    delivery_method VARCHAR(20)   NOT NULL,
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    customer_id     INTEGER       NOT NULL,
    CONSTRAINT pk_orders            PRIMARY KEY (order_id),
    CONSTRAINT fk_orders_customer   FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON DELETE RESTRICT,
    CONSTRAINT ck_orders_status     CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    CONSTRAINT ck_orders_total      CHECK (total >= 0),
    CONSTRAINT ck_orders_payment    CHECK (payment_method IN ('cod', 'card', 'bank_transfer')),
    CONSTRAINT ck_orders_delivery   CHECK (delivery_method IN ('courier', 'store_pickup', 'econt', 'speedy'))
);

-- 5. ORDER_ITEM
CREATE TABLE order_item (
    order_item_id INTEGER       GENERATED ALWAYS AS IDENTITY,
    quantity      INTEGER       NOT NULL,
    unit_price    DECIMAL(10,2) NOT NULL,
    promo_price   DECIMAL(10,2),
    order_id      INTEGER       NOT NULL,
    product_id    INTEGER       NOT NULL,
    CONSTRAINT pk_order_item          PRIMARY KEY (order_item_id),
    CONSTRAINT fk_order_item_order    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product  FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE RESTRICT,
    CONSTRAINT ck_order_item_qty      CHECK (quantity >= 1),
    CONSTRAINT ck_order_item_price    CHECK (unit_price > 0)
);

-- 6. PROMOTION
CREATE TABLE promotion (
    promotion_id  INTEGER       GENERATED ALWAYS AS IDENTITY,
    name          VARCHAR(255)  NOT NULL,
    discount_pct  DECIMAL(5,2),
    start_date    DATE          NOT NULL,
    end_date      DATE          NOT NULL,
    is_active     SMALLINT      NOT NULL DEFAULT 1,
    CONSTRAINT pk_promotion           PRIMARY KEY (promotion_id),
    CONSTRAINT ck_promotion_disc      CHECK (discount_pct IS NULL OR (discount_pct > 0 AND discount_pct <= 100)),
    CONSTRAINT ck_promotion_dates     CHECK (end_date >= start_date),
    CONSTRAINT ck_promotion_active    CHECK (is_active IN (0, 1))
);

-- 7. PRODUCT_CATEGORY (M:N)
CREATE TABLE product_category (
    product_id    INTEGER NOT NULL,
    category_id   INTEGER NOT NULL,
    CONSTRAINT pk_prod_cat          PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_prod_cat_prod     FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE CASCADE,
    CONSTRAINT fk_prod_cat_cat      FOREIGN KEY (category_id) REFERENCES category (category_id) ON DELETE CASCADE
);

-- 8. PRODUCT_PROMOTION (M:N)
CREATE TABLE product_promotion (
    product_id    INTEGER NOT NULL,
    promotion_id  INTEGER NOT NULL,
    CONSTRAINT pk_prod_promo          PRIMARY KEY (product_id, promotion_id),
    CONSTRAINT fk_prod_promo_prod     FOREIGN KEY (product_id) REFERENCES product (product_id) ON DELETE CASCADE,
    CONSTRAINT fk_prod_promo_promo    FOREIGN KEY (promotion_id) REFERENCES promotion (promotion_id) ON DELETE CASCADE
);
