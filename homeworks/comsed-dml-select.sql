-- ============================================================
-- COMSED (КОМСЕД) - DML SELECT заявки
-- Схема: FN2MI0700362
-- Автор: Стас Узунов, ф.н. 2MI0700362
-- ============================================================

SET SCHEMA FN2MI0700362;

-- ============================================================
-- 1. Всички активни продукти с промоционална цена,
--    сортирани по процент намаление (най-голямото първо)
-- ============================================================
SELECT
    P.PRODUCT_ID,
    P.NAME,
    P.SKU,
    P.PRICE AS ORIGINAL_PRICE,
    P.PROMO_PRICE,
    ROUND((1 - P.PROMO_PRICE / P.PRICE) * 100, 1) AS DISCOUNT_PCT
FROM PRODUCT P
WHERE P.IS_ACTIVE = 1
  AND P.PROMO_PRICE IS NOT NULL
ORDER BY DISCOUNT_PCT DESC;

-- ============================================================
-- 2. Брой продукти във всяка категория (само категории
--    с поне 2 продукта), с името на родителската категория
-- ============================================================
SELECT
    C.NAME AS CATEGORY,
    PC2.NAME AS PARENT_CATEGORY,
    COUNT(PC.PRODUCT_ID) AS PRODUCT_COUNT
FROM CATEGORY C
JOIN PRODUCT_CATEGORY PC ON C.CATEGORY_ID = PC.CATEGORY_ID
LEFT JOIN CATEGORY PC2 ON C.PARENT_ID = PC2.CATEGORY_ID
GROUP BY C.NAME, PC2.NAME
HAVING COUNT(PC.PRODUCT_ID) >= 2
ORDER BY PRODUCT_COUNT DESC;

-- ============================================================
-- 3. Топ 3 клиенти по обща стойност на доставени поръчки
-- ============================================================
SELECT
    CU.FIRST_NAME || ' ' || CU.LAST_NAME AS CUSTOMER_NAME,
    CU.EMAIL,
    COUNT(O.ORDER_ID) AS TOTAL_ORDERS,
    SUM(O.TOTAL) AS TOTAL_SPENT
FROM CUSTOMER CU
JOIN ORDERS O ON CU.CUSTOMER_ID = O.CUSTOMER_ID
WHERE O.STATUS = 'delivered'
GROUP BY CU.FIRST_NAME, CU.LAST_NAME, CU.EMAIL
ORDER BY TOTAL_SPENT DESC
FETCH FIRST 3 ROWS ONLY;

-- ============================================================
-- 4. Детайли на всяка поръчка: клиент, брой артикули,
--    статус и дата, включително поръчки без артикули
-- ============================================================
SELECT
    O.ORDER_ID,
    CU.FIRST_NAME || ' ' || CU.LAST_NAME AS CUSTOMER_NAME,
    O.STATUS,
    O.PAYMENT_METHOD,
    O.DELIVERY_METHOD,
    O.TOTAL,
    COUNT(OI.ORDER_ITEM_ID) AS ITEM_COUNT,
    O.CREATED_AT
FROM ORDERS O
JOIN CUSTOMER CU ON O.CUSTOMER_ID = CU.CUSTOMER_ID
LEFT JOIN ORDER_ITEM OI ON O.ORDER_ID = OI.ORDER_ID
GROUP BY O.ORDER_ID, CU.FIRST_NAME, CU.LAST_NAME,
         O.STATUS, O.PAYMENT_METHOD, O.DELIVERY_METHOD,
         O.TOTAL, O.CREATED_AT
ORDER BY O.CREATED_AT DESC;

-- ============================================================
-- 5. Продукти, които участват в активна промоция в момента,
--    с името на промоцията и процента отстъпка
-- ============================================================
SELECT
    P.NAME AS PRODUCT_NAME,
    P.PRICE,
    PR.NAME AS PROMOTION_NAME,
    PR.DISCOUNT_PCT,
    ROUND(P.PRICE * (1 - PR.DISCOUNT_PCT / 100), 2) AS DISCOUNTED_PRICE
FROM PRODUCT P
JOIN PRODUCT_PROMOTION PP ON P.PRODUCT_ID = PP.PRODUCT_ID
JOIN PROMOTION PR ON PP.PROMOTION_ID = PR.PROMOTION_ID
WHERE PR.IS_ACTIVE = 1
  AND CURRENT DATE BETWEEN PR.START_DATE AND PR.END_DATE
ORDER BY PR.DISCOUNT_PCT DESC, P.NAME;

-- ============================================================
-- 6. Продукти, които никога не са били поръчвани
--    (използване на подзаявка с NOT IN)
-- ============================================================
SELECT
    P.PRODUCT_ID,
    P.NAME,
    P.SKU,
    P.PRICE,
    P.QTY_IN_STOCK
FROM PRODUCT P
WHERE P.PRODUCT_ID NOT IN (
    SELECT DISTINCT OI.PRODUCT_ID
    FROM ORDER_ITEM OI
)
ORDER BY P.QTY_IN_STOCK DESC;
