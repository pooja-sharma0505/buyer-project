-- ============================================================================
-- LUMIÈRE — Luxury Catalogue Seed (TiDB Cloud / MySQL)
-- ----------------------------------------------------------------------------
-- Replaces ALL product data in `demostore.products` with a curated catalogue
-- of 48 luxury products (ids 200001..200048) whose images are served from the
-- dummyjson CDN (verified live on 2026-09-09, all thumbnails return HTTP 200).
--
-- The storefront lists products as `ORDER BY id DESC`, so the highest ids are
-- what visitors see first on the homepage. The first item below (200048) is
-- therefore the first card on the page.
--
-- Dependencies handled:
--   * cart / wishlist / reviews rows reference product ids and are wiped so
--     nothing dangles after the catalogue swap (test data only).
--   * order_items is intentionally KEPT — each row snapshots its own
--     title/price, so order history stays correct without the product row.
--
-- Idempotent: DELETE + INSERT, safe to re-run.
--
-- Take a backup BEFORE running, e.g.:
--   mysqldump --ssl-mode=REQUIRED -h gateway01.ap-southeast-1.prod.aws.tidbcloud.com \
--     -P 4000 -u <DB_USER> -p<DB_PASSWORD> demostore > pre_luxury_seed.sql
-- ============================================================================

START TRANSACTION;

-- 1) Drop dependent test data (carts, wishlists and reviews reference old products)
DELETE FROM cart;
DELETE FROM wishlist;
DELETE FROM reviews;

-- 2) Replace the catalogue entirely
DELETE FROM products;

-- 3) Insert the curated luxury catalogue
INSERT INTO products (id, name, price, old_price, image, description, category) VALUES
-- Watches
(200048, 'Rolex Submariner Watch', 749000.00, 849000.00, 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/thumbnail.webp', 'The iconic diver''s watch. A 40mm Oystersteel case with a ceramic bezel and a calibre 3230 movement — engineered for depth, designed for life.', 'Watches'),
(200047, 'Rolex Datejust', 599000.00, 699000.00, 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/thumbnail.webp', 'The timeless Datejust with a fluted bezel and Jubilee bracelet. A self-winding icon that pairs with everything.', 'Watches'),
(200046, 'Rolex Cellini Moonphase', 649000.00, 749000.00, 'https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/thumbnail.webp', 'A rare dress watch with an aventurine moonphase dial. Classical proportions, horological poetry.', 'Watches'),
(200045, 'IWC Ingenieur Automatic Steel', 499000.00, 579000.00, 'https://cdn.dummyjson.com/product-images/womens-watches/iwc-ingenieur-automatic-steel/thumbnail.webp', 'An integrated-bracelet sports watch from IWC. Precision, presence, and unmistakable Swiss engineering.', 'Watches'),
(200044, 'Longines Master Collection', 149000.00, 179000.00, 'https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp', 'An elegant automatic timepiece with a sapphire crystal and a refined leather strap.', 'Watches'),
-- Handbags
(200043, 'Prada Women Bag', 185000.00, 215000.00, 'https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/thumbnail.webp', 'Saffiano leather tote with gold-tone hardware and a spacious lined interior. Understated, iconic.', 'Handbags'),
(200042, 'Heshe Women''s Leather Bag', 45000.00, 55000.00, 'https://cdn.dummyjson.com/product-images/womens-bags/heshe-women''s-leather-bag/thumbnail.webp', 'Full-grain leather bag with a structured silhouette and soft suede lining. Made to be carried every day.', 'Handbags'),
(200041, 'Blue Women''s Handbag', 19999.00, 24999.00, 'https://cdn.dummyjson.com/product-images/womens-bags/blue-women''s-handbag/thumbnail.webp', 'A rich navy handbag in supple leather with polished hardware and an interior zip pocket.', 'Handbags'),
(200040, 'Women Handbag Black', 24999.00, 29999.00, 'https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/thumbnail.webp', 'A timeless black handbag with clean lines, a top-zip closure and a detachable strap.', 'Handbags'),
-- Jewellery
(200039, 'Green Crystal Earring', 12999.00, 15999.00, 'https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/thumbnail.webp', 'Statement drop earrings set with faceted green crystals in rose-gold plating.', 'Jewellery'),
(200038, 'Green Oval Earring', 10999.00, 13999.00, 'https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/thumbnail.webp', 'Oval-cut green stone earrings on a delicate gold-tone huggie. Light, bright, elegant.', 'Jewellery'),
(200037, 'Tropical Earring', 8999.00, 11999.00, 'https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/thumbnail.webp', 'Hand-finished tropical-inspired earrings with enamel accents for evenings out.', 'Jewellery'),
-- Fragrance
(200036, 'Chanel Coco Noir Eau De', 12500.00, 15500.00, 'https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp', 'A dark, oriental scent of grapefruit, rose and patchouli. Eau de parfum for evenings.', 'Fragrance'),
(200035, 'Gucci Bloom Eau de', 11500.00, 14500.00, 'https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp', 'A floral bouquet of tuberose, jasmine and Rangoon creeper — feminine and free-spirited.', 'Fragrance'),
(200034, 'Dior J''adore', 9500.00, 12500.00, 'https://cdn.dummyjson.com/product-images/fragrances/dior-j''adore/thumbnail.webp', 'A lavish layering of rose, jasmine and ylang-ylang over a warm sandalwood base.', 'Fragrance'),
(200033, 'Dolce Shine Eau de', 7999.00, 9999.00, 'https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp', 'A luminous citrus-floral eau de toilette with a warm, woody trail.', 'Fragrance'),
(200032, 'Calvin Klein CK One', 5999.00, 7499.00, 'https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp', 'The iconic unisex eau de toilette — clean, fresh and endlessly wearable.', 'Fragrance'),
-- Fashion
(200031, 'Black Women''s Gown', 28999.00, 34999.00, 'https://cdn.dummyjson.com/product-images/womens-dresses/black-women''s-gown/thumbnail.webp', 'Floor-length black gown with a bias-cut silhouette and delicate strap detail.', 'Fashion'),
(200030, 'Marni Red & Black Suit', 39999.00, 47999.00, 'https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/thumbnail.webp', 'A sculpted two-piece suit in red and black with sharp tailoring and a modern attitude.', 'Fashion'),
(200029, 'Corset Leather With Skirt', 19999.00, 24999.00, 'https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/thumbnail.webp', 'A structured corset top paired with a flowing midi skirt. High fashion, high drama.', 'Fashion'),
(200028, 'Men Check Shirt', 7999.00, 9999.00, 'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp', 'A crisp checked shirt in breathable cotton — the foundation of a smart-casual wardrobe.', 'Fashion'),
(200027, 'Man Plaid Shirt', 9999.00, 12499.00, 'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp', 'A relaxed plaid shirt with a soft hand-feel and a versatile collar.', 'Fashion'),
-- Footwear
(200026, 'Calvin Klein Heel Shoes', 14999.00, 18499.00, 'https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/thumbnail.webp', 'Pointed stiletto heels in blush-toned leather with a sculpted 90mm heel.', 'Footwear'),
(200025, 'Golden Shoes Woman', 11999.00, 14999.00, 'https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/thumbnail.webp', 'Evening shoes with a shimmering gold finish and a comfortable low vamp.', 'Footwear'),
(200024, 'Nike Air Jordan 1 Red And Black', 18500.00, 21500.00, 'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp', 'The legendary high-top in its original red-and-black colourway. A collector''s icon.', 'Footwear'),
(200023, 'Pampi Shoes', 6999.00, 8999.00, 'https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/thumbnail.webp', 'Handmade leather loafers with a cushioned insole and a hand-stitched sole.', 'Footwear'),
(200022, 'Red Shoes', 9999.00, 12999.00, 'https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/thumbnail.webp', 'Vivid red courts with a flattering almond toe and an elegant slim heel.', 'Footwear'),
-- Furniture
(200021, 'Annibale Colombo Sofa', 249000.00, 289000.00, 'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp', 'A sunk-in, comfort-first three-seater in premium Italian upholstery.', 'Furniture'),
(200020, 'Annibale Colombo Bed', 289000.00, 329000.00, 'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp', 'A statement upholstered bed with a plush headboard and solid hardwood frame.', 'Furniture'),
(200019, 'Knoll Saarinen Executive Conference Chair', 129000.00, 149000.00, 'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp', 'The mid-century icon reimagined — a sculptural shell on a chrome stem.', 'Furniture'),
(200018, 'Bedside Table African Cherry', 65000.00, 75999.00, 'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp', 'A compact nightstand in polished African cherry with a single soft-close drawer.', 'Furniture'),
(200017, 'Wooden Bathroom Sink With Mirror', 89999.00, 104999.00, 'https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp', 'A floating teak vanity with an integrated bowl sink and a framed mirror.', 'Furniture'),
-- Home & Décor
(200016, 'Decoration Swing', 12999.00, 15999.00, 'https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp', 'A hand-finished rattan swing that brings an instant conversation corner to any room.', 'Home & Décor'),
(200015, 'Family Tree Photo Frame', 7499.00, 9499.00, 'https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp', 'A gallery-style framed tree with space for your favourite photographs.', 'Home & Décor'),
(200014, 'Table Lamp', 11999.00, 14499.00, 'https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp', 'A sculptural table lamp with a linen shade and a warm, dimmable glow.', 'Home & Décor'),
(200013, 'House Showpiece Plant', 8999.00, 10999.00, 'https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp', 'A life-like showpiece plant in a handcrafted ceramic pot. Zero upkeep, eternal green.', 'Home & Décor'),
-- Beauty
(200012, 'Essence Mascara Lash Princess', 1499.00, 1999.00, 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp', 'A volumizing mascara with a sculpted brush for dramatic, clump-free lashes.', 'Beauty'),
(200011, 'Eyeshadow Palette With Mirror', 2999.00, 3799.00, 'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp', 'Twelve richly pigmented shades with a built-in mirror for touch-ups on the go.', 'Beauty'),
(200010, 'Red Lipstick', 2499.00, 3199.00, 'https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp', 'A classic red lipstick with a satin finish that lasts from desk to dinner.', 'Beauty'),
(200009, 'Red Nail Polish', 1499.00, 1999.00, 'https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp', 'A high-shine red lacquer with a chip-resistant formula and a glossy mirror finish.', 'Beauty'),
(200008, 'Powder Canister', 3499.00, 4299.00, 'https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp', 'A finely milled finishing powder in an elegant canister that sets your look all day.', 'Beauty'),
-- Accessories
(200007, 'Black Sun Glasses', 8499.00, 10499.00, 'https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/thumbnail.webp', 'Classic black acetate sunglasses with UV400 lenses and a timeless silhouette.', 'Accessories'),
(200006, 'Classic Sun Glasses', 7499.00, 9499.00, 'https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/thumbnail.webp', 'A gentleman''s frame in dark tortoise with gradient lenses.', 'Accessories'),
(200005, 'Sunglasses', 6499.00, 7999.00, 'https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/thumbnail.webp', 'Minimalist unisex sunglasses with smoke lenses and a feather-light frame.', 'Accessories'),
-- Electronics
(200004, 'Apple MacBook Pro 14 Inch Space Grey', 189900.00, 209900.00, 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp', 'A 14-inch Retina display, M-series performance and all-day battery in a precision aluminium shell.', 'Electronics'),
(200003, 'Asus Zenbook Pro Dual Screen Laptop', 159900.00, 179900.00, 'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/thumbnail.webp', 'A dual-screen powerhouse with a 4K OLED main panel for creative professionals.', 'Electronics'),
(200002, 'New DELL XPS 13 9300 Laptop', 154900.00, 171900.00, 'https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/thumbnail.webp', 'An ultra-compact 13-inch laptop with an InfinityEdge display and a premium build.', 'Electronics'),
(200001, 'iPhone 13 Pro', 119900.00, 134900.00, 'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp', 'A flagship smartphone with a Super Retina XDR display and a pro-grade camera system.', 'Electronics');

COMMIT;