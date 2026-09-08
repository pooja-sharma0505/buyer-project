-- Migrate duplicate cart entries to canonical products for user 30002
-- Toy Car: canonical = 30
DELETE FROM cart WHERE user_id = 30002 AND product_id IN (59, 90056);
INSERT INTO cart (user_id, product_id, qty) VALUES (30002, 30, 2)
ON DUPLICATE KEY UPDATE qty = LEAST(2, VALUES(qty) + qty);

-- Teddy Bear: canonical = 31
DELETE FROM cart WHERE user_id = 30002 AND product_id IN (60, 90057);
INSERT INTO cart (user_id, product_id, qty) VALUES (30002, 31, 2)
ON DUPLICATE KEY UPDATE qty = LEAST(2, VALUES(qty) + qty);

-- Building Blocks: canonical = 60078
DELETE FROM cart WHERE user_id = 30002 AND product_id = 90058;
INSERT INTO cart (user_id, product_id, qty) VALUES (30002, 60078, 2)
ON DUPLICATE KEY UPDATE qty = LEAST(2, VALUES(qty) + qty);

-- Delete duplicate product records
-- Keep canonical products: 1, 31, 30, 20, 2, 18, 15, 21, 22, 27, 28, 16, 8, 60078
DELETE FROM products WHERE id IN (
  3, 33, 38, 39,      -- Apple iPhone 16
  60077, 90057,        -- Teddy Bear
  60076, 90056,        -- Toy Car
  37, 51,              -- Modern Sofa
  4, 40,               -- Samsung Galaxy S25
  36, 49,              -- Wooden Office Chair
  47,                  -- Sony WH-1000XM5
  53,                  -- Nivea Face Wash
  52,                  -- Lakme Lipstick
  57,                  -- Cricket Bat
  58,                  -- Football
  48,                  -- Apple Watch Series 10
  41                   -- MacBook Air M4
);
