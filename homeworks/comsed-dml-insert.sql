-- ============================================================
-- COMSED (КОМСЕД) - DML INSERT Script
-- Схема: FN2MI0700362
-- Автор: Стас Узунов, ф.н. 2MI0700362
-- ============================================================

SET SCHEMA FN2MI0700362;

-- ============================================================
-- 1. CATEGORY (родителски таблици първо)
-- ============================================================
INSERT INTO CATEGORY (NAME, SLUG, PARENT_ID, DESCRIPTION, IS_ACTIVE) VALUES
('За бебето и майката', 'za-bebeto-i-maikata', NULL, 'Продукти за бебета и техните майки', 1);

INSERT INTO CATEGORY (NAME, SLUG, PARENT_ID, DESCRIPTION, IS_ACTIVE) VALUES
('Детски играчки', 'detski-igrachki', NULL, 'Играчки за деца от всички възрасти', 1);

INSERT INTO CATEGORY (NAME, SLUG, PARENT_ID, DESCRIPTION, IS_ACTIVE) VALUES
('Отдих и спорт', 'otdih-i-sport', NULL, 'Спортни принадлежности и играчки за навън', 1);

INSERT INTO CATEGORY (NAME, SLUG, PARENT_ID, DESCRIPTION, IS_ACTIVE) VALUES
('Книги и учебни пособия', 'knigi-i-uchebni', NULL, 'Детски книги и образователни материали', 1);

INSERT INTO CATEGORY (NAME, SLUG, PARENT_ID, DESCRIPTION, IS_ACTIVE) VALUES
('Детски дрехи', 'detski-drehi', NULL, 'Облекла за деца', 0);

-- Подкатегории (PARENT_ID сочи към вече вмъкнати записи)
INSERT INTO CATEGORY (NAME, SLUG, PARENT_ID, DESCRIPTION, IS_ACTIVE) VALUES
('Конструктори', 'konstruktori', 2, 'LEGO и други конструктори', 1);

INSERT INTO CATEGORY (NAME, SLUG, PARENT_ID, DESCRIPTION, IS_ACTIVE) VALUES
('Кукли и фигурки', 'kukli-i-figurki', 2, 'Кукли Barbie, Playmobil и др.', 1);

INSERT INTO CATEGORY (NAME, SLUG, PARENT_ID, DESCRIPTION, IS_ACTIVE) VALUES
('Столчета за хранене', 'stolcheta-za-hranene', 1, 'Столчета за хранене на бебета', 1);

INSERT INTO CATEGORY (NAME, SLUG, PARENT_ID, DESCRIPTION, IS_ACTIVE) VALUES
('Надуваеми басейни', 'naduvаemi-baseini', 3, 'Басейни и надуваеми играчки за лятото', 1);

INSERT INTO CATEGORY (NAME, SLUG, PARENT_ID, DESCRIPTION, IS_ACTIVE) VALUES
('Пъзели и настолни игри', 'pazeli-i-nastolni', 2, 'Пъзели, настолни и логически игри', 1);

-- ============================================================
-- 2. PRODUCT
-- ============================================================
INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('LEGO City Полицейска гонка', 'LEGO-60415', 49.99, 39.99, 25, 'LEGO', 1);

INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('Intex Easy Set басейн 305см', 'INTEX-28120', 129.90, NULL, 10, 'Intex', 1);

INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('Ravensburger Пъзел 1000 части', 'RVB-15088', 34.50, 29.90, 18, 'Ravensburger', 1);

INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('Barbie Dreamhouse кукла', 'BARB-GRG93', 89.99, NULL, 7, 'Barbie', 1);

INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('Chicco Polly столче за хранене', 'CHIC-07079', 249.00, 199.00, 5, 'Chicco', 1);

INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('Hot Wheels Track Builder комплект', 'HW-GLC96', 59.99, NULL, 15, 'Hot Wheels', 1);

INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('Fisher-Price Laugh & Learn телефон', 'FP-FGW66', 29.99, 24.99, 30, 'Fisher-Price', 1);

INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('Playmobil Пиратски кораб', 'PM-70411', 119.90, 99.90, 4, 'Playmobil', 1);

INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('LEGO Duplo Влакче с числа', 'LEGO-10954', 24.99, NULL, 40, 'LEGO', 1);

INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('smarTrike STR5 триколка', 'ST-5021533', 299.00, NULL, 3, 'smarTrike', 1);

INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('Детска енциклопедия за животните', 'BOOK-ENC01', 18.50, NULL, 22, 'Egmont', 1);

INSERT INTO PRODUCT (NAME, SKU, PRICE, PROMO_PRICE, QTY_IN_STOCK, BRAND_ID, IS_ACTIVE) VALUES
('LEGO Technic Bugatti Chiron', 'LEGO-42151', 399.99, 349.99, 2, 'LEGO', 1);

-- ============================================================
-- 3. CUSTOMER
-- ============================================================
INSERT INTO CUSTOMER (FIRST_NAME, LAST_NAME, EMAIL, PHONE) VALUES
('Иван', 'Петров', 'ivan.petrov@abv.bg', '0888123456');

INSERT INTO CUSTOMER (FIRST_NAME, LAST_NAME, EMAIL, PHONE) VALUES
('Мария', 'Иванова', 'maria.ivanova@gmail.com', '0877234567');

INSERT INTO CUSTOMER (FIRST_NAME, LAST_NAME, EMAIL, PHONE) VALUES
('Георги', 'Димитров', 'georgi.dimitrov@yahoo.com', '0899345678');

INSERT INTO CUSTOMER (FIRST_NAME, LAST_NAME, EMAIL, PHONE) VALUES
('Елена', 'Стоянова', 'elena.stoyanova@mail.bg', NULL);

INSERT INTO CUSTOMER (FIRST_NAME, LAST_NAME, EMAIL, PHONE) VALUES
('Петър', 'Николов', 'petar.nikolov@abv.bg', '0887456789');

INSERT INTO CUSTOMER (FIRST_NAME, LAST_NAME, EMAIL, PHONE) VALUES
('Анна', 'Георгиева', 'anna.georgieva@gmail.com', '0878567890');

-- ============================================================
-- 4. ORDERS
-- ============================================================
INSERT INTO ORDERS (STATUS, TOTAL, PAYMENT_METHOD, DELIVERY_METHOD, CREATED_AT, CUSTOMER_ID) VALUES
('delivered', 89.98, 'card', 'econt', '2026-01-15 10:30:00', 1);

INSERT INTO ORDERS (STATUS, TOTAL, PAYMENT_METHOD, DELIVERY_METHOD, CREATED_AT, CUSTOMER_ID) VALUES
('shipped', 249.00, 'cod', 'speedy', '2026-02-20 14:15:00', 2);

INSERT INTO ORDERS (STATUS, TOTAL, PAYMENT_METHOD, DELIVERY_METHOD, CREATED_AT, CUSTOMER_ID) VALUES
('confirmed', 154.40, 'card', 'courier', '2026-03-05 09:45:00', 3);

INSERT INTO ORDERS (STATUS, TOTAL, PAYMENT_METHOD, DELIVERY_METHOD, CREATED_AT, CUSTOMER_ID) VALUES
('pending', 399.99, 'bank_transfer', 'econt', '2026-03-28 18:00:00', 1);

INSERT INTO ORDERS (STATUS, TOTAL, PAYMENT_METHOD, DELIVERY_METHOD, CREATED_AT, CUSTOMER_ID) VALUES
('cancelled', 59.99, 'cod', 'store_pickup', '2026-02-10 11:20:00', 4);

INSERT INTO ORDERS (STATUS, TOTAL, PAYMENT_METHOD, DELIVERY_METHOD, CREATED_AT, CUSTOMER_ID) VALUES
('delivered', 324.89, 'card', 'speedy', '2026-01-02 08:50:00', 5);

INSERT INTO ORDERS (STATUS, TOTAL, PAYMENT_METHOD, DELIVERY_METHOD, CREATED_AT, CUSTOMER_ID) VALUES
('pending', 54.98, 'cod', 'econt', '2026-04-01 16:30:00', 6);

-- ============================================================
-- 5. ORDER_ITEM
-- ============================================================
-- Поръчка 1: LEGO City + Ravensburger пъзел
INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 49.99, 39.99, 1, 1);

INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 34.50, 29.90, 1, 3);

-- Поръчка 2: Chicco столче
INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 249.00, 199.00, 2, 5);

-- Поръчка 3: Intex басейн + Fisher-Price телефон
INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 129.90, NULL, 3, 2);

INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 29.99, 24.99, 3, 7);

-- Поръчка 4: LEGO Technic Bugatti
INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 399.99, 349.99, 4, 12);

-- Поръчка 5: Hot Wheels (cancelled)
INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 59.99, NULL, 5, 6);

-- Поръчка 6: Playmobil + LEGO Duplo + Barbie + книга
INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 119.90, 99.90, 6, 8);

INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(2, 24.99, NULL, 6, 9);

INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 89.99, NULL, 6, 4);

INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 18.50, NULL, 6, 11);

-- Поръчка 7: Fisher-Price телефон + LEGO Duplo
INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 29.99, 24.99, 7, 7);

INSERT INTO ORDER_ITEM (QUANTITY, UNIT_PRICE, PROMO_PRICE, ORDER_ID, PRODUCT_ID) VALUES
(1, 24.99, NULL, 7, 9);

-- ============================================================
-- 6. PROMOTION
-- ============================================================
INSERT INTO PROMOTION (NAME, DISCOUNT_PCT, START_DATE, END_DATE, IS_ACTIVE) VALUES
('-27% на избрани LEGO', 27.00, '2026-03-01', '2026-03-31', 1);

INSERT INTO PROMOTION (NAME, DISCOUNT_PCT, START_DATE, END_DATE, IS_ACTIVE) VALUES
('До -30% на столчета за хранене', 30.00, '2026-02-15', '2026-04-15', 1);

INSERT INTO PROMOTION (NAME, DISCOUNT_PCT, START_DATE, END_DATE, IS_ACTIVE) VALUES
('Пролетна разпродажба', 20.00, '2026-04-01', '2026-04-30', 1);

INSERT INTO PROMOTION (NAME, DISCOUNT_PCT, START_DATE, END_DATE, IS_ACTIVE) VALUES
('Великденски намаления', 15.00, '2026-04-10', '2026-04-20', 1);

INSERT INTO PROMOTION (NAME, DISCOUNT_PCT, START_DATE, END_DATE, IS_ACTIVE) VALUES
('Зимна разпродажба 2025', 25.00, '2025-12-01', '2026-01-15', 0);

-- ============================================================
-- 7. PRODUCT_CATEGORY (M:N връзки)
-- ============================================================
-- LEGO City -> Конструктори, Детски играчки
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (1, 2);
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (1, 6);

-- Intex басейн -> Отдих и спорт, Надуваеми басейни
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (2, 3);
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (2, 9);

-- Ravensburger пъзел -> Пъзели и настолни, Детски играчки
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (3, 2);
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (3, 10);

-- Barbie кукла -> Кукли и фигурки, Детски играчки
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (4, 2);
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (4, 7);

-- Chicco столче -> За бебето и майката, Столчета за хранене
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (5, 1);
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (5, 8);

-- Hot Wheels -> Детски играчки
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (6, 2);

-- Fisher-Price -> За бебето и майката, Детски играчки
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (7, 1);
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (7, 2);

-- Playmobil -> Кукли и фигурки, Детски играчки
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (8, 2);
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (8, 7);

-- LEGO Duplo -> Конструктори, Детски играчки, За бебето
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (9, 1);
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (9, 2);
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (9, 6);

-- smarTrike -> За бебето, Отдих и спорт
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (10, 1);
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (10, 3);

-- Книга -> Книги и учебни пособия
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (11, 4);

-- LEGO Technic -> Конструктори, Детски играчки
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (12, 2);
INSERT INTO PRODUCT_CATEGORY (PRODUCT_ID, CATEGORY_ID) VALUES (12, 6);

-- ============================================================
-- 8. PRODUCT_PROMOTION (M:N връзки)
-- ============================================================
-- Промоция 1 (-27% LEGO) -> LEGO City, LEGO Duplo, LEGO Technic
INSERT INTO PRODUCT_PROMOTION (PRODUCT_ID, PROMOTION_ID) VALUES (1, 1);
INSERT INTO PRODUCT_PROMOTION (PRODUCT_ID, PROMOTION_ID) VALUES (9, 1);
INSERT INTO PRODUCT_PROMOTION (PRODUCT_ID, PROMOTION_ID) VALUES (12, 1);

-- Промоция 2 (столчета) -> Chicco столче
INSERT INTO PRODUCT_PROMOTION (PRODUCT_ID, PROMOTION_ID) VALUES (5, 2);

-- Промоция 3 (пролетна) -> Ravensburger, Fisher-Price, Barbie
INSERT INTO PRODUCT_PROMOTION (PRODUCT_ID, PROMOTION_ID) VALUES (3, 3);
INSERT INTO PRODUCT_PROMOTION (PRODUCT_ID, PROMOTION_ID) VALUES (7, 3);
INSERT INTO PRODUCT_PROMOTION (PRODUCT_ID, PROMOTION_ID) VALUES (4, 3);

-- Промоция 4 (Великден) -> Playmobil, Hot Wheels
INSERT INTO PRODUCT_PROMOTION (PRODUCT_ID, PROMOTION_ID) VALUES (8, 4);
INSERT INTO PRODUCT_PROMOTION (PRODUCT_ID, PROMOTION_ID) VALUES (6, 4);

-- Промоция 5 (зимна, неактивна) -> Intex басейн
INSERT INTO PRODUCT_PROMOTION (PRODUCT_ID, PROMOTION_ID) VALUES (2, 5);
