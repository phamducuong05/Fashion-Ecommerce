-- DATA SEED FOR Product (ENGLISH)
BEGIN;

-- 1. Category
INSERT INTO Category (id, name, slug, parent_id) VALUES (1, 'Men', 'men', NULL) ON CONFLICT DO NOTHING;
INSERT INTO Category (id, name, slug, parent_id) VALUES (2, 'Women', 'women', NULL) ON CONFLICT DO NOTHING;
INSERT INTO Category (id, name, slug, parent_id) VALUES (3, 'Accessories', 'accessories', NULL) ON CONFLICT DO NOTHING;
INSERT INTO Category (id, name, slug, parent_id) VALUES (4, 'Men's Tops', 'men-tops', 1) ON CONFLICT DO NOTHING;
INSERT INTO Category (id, name, slug, parent_id) VALUES (5, 'Men's Bottoms', 'men-bottoms', 1) ON CONFLICT DO NOTHING;
INSERT INTO Category (id, name, slug, parent_id) VALUES (6, 'Dresses', 'dresses', 2) ON CONFLICT DO NOTHING;
INSERT INTO Category (id, name, slug, parent_id) VALUES (7, 'Women's Tops', 'women-tops', 2) ON CONFLICT DO NOTHING;
INSERT INTO Category (id, name, slug, parent_id) VALUES (8, 'Bags', 'bags', 3) ON CONFLICT DO NOTHING;
INSERT INTO Category (id, name, slug, parent_id) VALUES (9, 'Footwear', 'footwear', 3) ON CONFLICT DO NOTHING;
SELECT setval('Category_id_seq', 9, true);

-- 2. Product AND VARIANTS
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (1, 'Luxury 100% Cotton Floral Sundress', 'luxury-100-cotton-floral-sundress-1', 'Elevate your style with the Luxury 100% Cotton Floral Sundress. Crafted from 100% cotton, this item offers a luxury look suitable for any occasion.', 'https://placehold.co/600x400?text=floral-sundress', 319.00, 319.00, TRUE, 4.5, 85);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (1, 'Black', 'M', 'FLO-001-BLA-M', 'https://placehold.co/400x400?text=Black+M', 49)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (1, 'Charcoal', 'L', 'FLO-001-CHA-L', 'https://placehold.co/400x400?text=Charcoal+L', 62)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (2, 'Luxury Silk Satin Ankle Boots', 'luxury-silk-satin-ankle-boots-2', 'Get ready for the season with this Luxury Silk Satin Ankle Boots. Made of breathable silk satin, giving you a truly luxury vibe.', 'https://placehold.co/600x400?text=ankle-boots', 251.00, 251.00, TRUE, 4.9, 62);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (2, 'Pastel Pink', '41', 'ANK-002-PAS-41', 'https://placehold.co/400x400?text=Pastel Pink+41', 84)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (2, 'Olive Green', '40', 'ANK-002-OLI-40', 'https://placehold.co/400x400?text=Olive Green+40', 94)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (2, 'Navy Blue', '38', 'ANK-002-NAV-38', 'https://placehold.co/400x400?text=Navy Blue+38', 52)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (3, 'Cozy Canvas Loafers', 'cozy-canvas-loafers-3', 'Discover the perfect blend of fashion and function with our Cozy Canvas Loafers. cozy style meets durable canvas.', 'https://placehold.co/600x400?text=loafers', 404.00, 404.00, TRUE, 4.4, 30);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (3, 'Charcoal', '41', 'LOA-003-CHA-41', 'https://placehold.co/400x400?text=Charcoal+41', 89)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (3, 'Navy Blue', '38', 'LOA-003-NAV-38', 'https://placehold.co/400x400?text=Navy Blue+38', 86)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (3, 'Black', '41', 'LOA-003-BLA-41', 'https://placehold.co/400x400?text=Black+41', 91)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (4, 'Luxury Chiffon Floral Sundress', 'luxury-chiffon-floral-sundress-4', 'The Luxury Chiffon Floral Sundress is a must-have for your wardrobe. Features a luxury design and high-quality chiffon for maximum comfort.', 'https://placehold.co/600x400?text=floral-sundress', 68.00, 68.00, TRUE, 4.1, 72);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (4, 'Charcoal', 'S', 'FLO-004-CHA-S', 'https://placehold.co/400x400?text=Charcoal+S', 47)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (4, 'Burgundy', 'XL', 'FLO-004-BUR-XL', 'https://placehold.co/400x400?text=Burgundy+XL', 93)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (4, 'Pastel Pink', 'S', 'FLO-004-PAS-S', 'https://placehold.co/400x400?text=Pastel Pink+S', 46)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (4, 'Olive Green', 'XS', 'FLO-004-OLI-XS', 'https://placehold.co/400x400?text=Olive Green+XS', 26)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (5, 'Bohemian Canvas T-Shirt', 'bohemian-canvas-t-shirt-5', 'Discover the perfect blend of fashion and function with our Bohemian Canvas T-Shirt. bohemian style meets durable canvas.', 'https://placehold.co/600x400?text=t-shirt', 115.00, 115.00, TRUE, 4.4, 93);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (5, 'Black', 'S', 'T-S-005-BLA-S', 'https://placehold.co/400x400?text=Black+S', 88)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (5, 'Burgundy', 'XL', 'T-S-005-BUR-XL', 'https://placehold.co/400x400?text=Burgundy+XL', 58)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (5, 'Olive Green', 'XXL', 'T-S-005-OLI-XXL', 'https://placehold.co/400x400?text=Olive Green+XXL', 62)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (5, 'White', 'XS', 'T-S-005-WHI-XS', 'https://placehold.co/400x400?text=White+XS', 83)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (6, 'Athletic Silk Satin Floral Sundress', 'athletic-silk-satin-floral-sundress-6', 'Get ready for the season with this Athletic Silk Satin Floral Sundress. Made of breathable silk satin, giving you a truly athletic vibe.', 'https://placehold.co/600x400?text=floral-sundress', 481.00, 481.00, TRUE, 4.8, 18);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (6, 'Charcoal', 'XS', 'FLO-006-CHA-XS', 'https://placehold.co/400x400?text=Charcoal+XS', 24)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (6, 'Black', 'S', 'FLO-006-BLA-S', 'https://placehold.co/400x400?text=Black+S', 75)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (6, 'Pastel Pink', 'XL', 'FLO-006-PAS-XL', 'https://placehold.co/400x400?text=Pastel Pink+XL', 49)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (6, 'Navy Blue', 'L', 'FLO-006-NAV-L', 'https://placehold.co/400x400?text=Navy Blue+L', 74)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (7, 'Luxury Corduroy Trousers', 'luxury-corduroy-trousers-7', 'The Luxury Corduroy Trousers is a must-have for your wardrobe. Features a luxury design and high-quality corduroy for maximum comfort.', 'https://placehold.co/600x400?text=trousers', 70.00, 70.00, TRUE, 4.1, 100);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (7, 'Charcoal', 'XXL', 'TRO-007-CHA-XXL', 'https://placehold.co/400x400?text=Charcoal+XXL', 48)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (7, 'White', 'XXL', 'TRO-007-WHI-XXL', 'https://placehold.co/400x400?text=White+XXL', 82)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (7, 'Black', 'XS', 'TRO-007-BLA-XS', 'https://placehold.co/400x400?text=Black+XS', 19)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (7, 'Beige', 'M', 'TRO-007-BEI-M', 'https://placehold.co/400x400?text=Beige+M', 53)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (8, 'Bohemian Canvas Bomber Jacket', 'bohemian-canvas-bomber-jacket-8', 'Elevate your style with the Bohemian Canvas Bomber Jacket. Crafted from canvas, this item offers a bohemian look suitable for any occasion.', 'https://placehold.co/600x400?text=bomber-jacket', 326.00, 260.80, TRUE, 3.6, 55);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (8, 'Grey', 'XS', 'BOM-008-GRE-XS', 'https://placehold.co/400x400?text=Grey+XS', 69)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (8, 'Beige', 'XS', 'BOM-008-BEI-XS', 'https://placehold.co/400x400?text=Beige+XS', 64)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (8, 'Navy Blue', 'L', 'BOM-008-NAV-L', 'https://placehold.co/400x400?text=Navy Blue+L', 87)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (9, 'Cozy Linen Floral Sundress', 'cozy-linen-floral-sundress-9', 'Discover the perfect blend of fashion and function with our Cozy Linen Floral Sundress. cozy style meets durable linen.', 'https://placehold.co/600x400?text=floral-sundress', 210.00, 210.00, TRUE, 4.2, 100);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (9, 'Olive Green', 'S', 'FLO-009-OLI-S', 'https://placehold.co/400x400?text=Olive Green+S', 82)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (9, 'Burgundy', 'L', 'FLO-009-BUR-L', 'https://placehold.co/400x400?text=Burgundy+L', 8)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (10, 'Minimalist Genuine Leather High Heels', 'minimalist-genuine-leather-high-heels-10', 'Get ready for the season with this Minimalist Genuine Leather High Heels. Made of breathable genuine leather, giving you a truly minimalist vibe.', 'https://placehold.co/600x400?text=high-heels', 297.00, 297.00, TRUE, 4.3, 37);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (10, 'White', '43', 'HIG-010-WHI-43', 'https://placehold.co/400x400?text=White+43', 25)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (10, 'Olive Green', '42', 'HIG-010-OLI-42', 'https://placehold.co/400x400?text=Olive Green+42', 54)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (10, 'Grey', '41', 'HIG-010-GRE-41', 'https://placehold.co/400x400?text=Grey+41', 45)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (11, 'Retro Linen Cardigan', 'retro-linen-cardigan-11', 'Get ready for the season with this Retro Linen Cardigan. Made of breathable linen, giving you a truly retro vibe.', 'https://placehold.co/600x400?text=cardigan', 298.00, 238.40, TRUE, 4.3, 22);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (11, 'White', 'XXL', 'CAR-011-WHI-XXL', 'https://placehold.co/400x400?text=White+XXL', 34)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (11, 'Charcoal', 'XS', 'CAR-011-CHA-XS', 'https://placehold.co/400x400?text=Charcoal+XS', 30)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (11, 'Pastel Pink', 'XS', 'CAR-011-PAS-XS', 'https://placehold.co/400x400?text=Pastel Pink+XS', 17)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (11, 'Olive Green', 'XXL', 'CAR-011-OLI-XXL', 'https://placehold.co/400x400?text=Olive Green+XXL', 94)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (12, 'Retro 100% Cotton Joggers', 'retro-100-cotton-joggers-12', 'Elevate your style with the Retro 100% Cotton Joggers. Crafted from 100% cotton, this item offers a retro look suitable for any occasion.', 'https://placehold.co/600x400?text=joggers', 215.00, 215.00, TRUE, 4.6, 95);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (12, 'Olive Green', 'L', 'JOG-012-OLI-L', 'https://placehold.co/400x400?text=Olive Green+L', 9)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (12, 'Burgundy', 'XL', 'JOG-012-BUR-XL', 'https://placehold.co/400x400?text=Burgundy+XL', 56)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (13, 'Athletic Denim Messenger Bag', 'athletic-denim-messenger-bag-13', 'Elevate your style with the Athletic Denim Messenger Bag. Crafted from denim, this item offers a athletic look suitable for any occasion.', 'https://placehold.co/600x400?text=messenger-bag', 81.00, 64.80, TRUE, 4.7, 74);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (13, 'Beige', 'One Size', 'MES-013-BEI-One Size', 'https://placehold.co/400x400?text=Beige+One Size', 28)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (13, 'Navy Blue', 'One Size', 'MES-013-NAV-One Size', 'https://placehold.co/400x400?text=Navy Blue+One Size', 96)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (13, 'Charcoal', 'One Size', 'MES-013-CHA-One Size', 'https://placehold.co/400x400?text=Charcoal+One Size', 16)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (13, 'Olive Green', 'One Size', 'MES-013-OLI-One Size', 'https://placehold.co/400x400?text=Olive Green+One Size', 79)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (14, 'Luxury Velvet Polo Shirt', 'luxury-velvet-polo-shirt-14', 'Discover the perfect blend of fashion and function with our Luxury Velvet Polo Shirt. luxury style meets durable velvet.', 'https://placehold.co/600x400?text=polo-shirt', 310.00, 310.00, TRUE, 4.2, 1);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (14, 'Black', 'XL', 'POL-014-BLA-XL', 'https://placehold.co/400x400?text=Black+XL', 15)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (14, 'Grey', 'XS', 'POL-014-GRE-XS', 'https://placehold.co/400x400?text=Grey+XS', 37)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (14, 'Beige', 'XL', 'POL-014-BEI-XL', 'https://placehold.co/400x400?text=Beige+XL', 85)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (14, 'Olive Green', 'S', 'POL-014-OLI-S', 'https://placehold.co/400x400?text=Olive Green+S', 39)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (15, 'Premium Silk Satin Knitted Sweater', 'premium-silk-satin-knitted-sweater-15', 'Discover the perfect blend of fashion and function with our Premium Silk Satin Knitted Sweater. premium style meets durable silk satin.', 'https://placehold.co/600x400?text=knitted-sweater', 293.00, 293.00, TRUE, 4.3, 56);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (15, 'Olive Green', 'XXL', 'KNI-015-OLI-XXL', 'https://placehold.co/400x400?text=Olive Green+XXL', 84)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (15, 'Black', 'M', 'KNI-015-BLA-M', 'https://placehold.co/400x400?text=Black+M', 16)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (15, 'Navy Blue', 'S', 'KNI-015-NAV-S', 'https://placehold.co/400x400?text=Navy Blue+S', 89)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (15, 'Beige', 'XL', 'KNI-015-BEI-XL', 'https://placehold.co/400x400?text=Beige+XL', 39)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (16, 'Cozy Wool Blend Messenger Bag', 'cozy-wool-blend-messenger-bag-16', 'Best-seller of the collection: Cozy Wool Blend Messenger Bag. Designed for those who love cozy aesthetics. Material: wool blend.', 'https://placehold.co/600x400?text=messenger-bag', 390.00, 312.00, TRUE, 4.0, 8);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (16, 'Beige', 'One Size', 'MES-016-BEI-One Size', 'https://placehold.co/400x400?text=Beige+One Size', 4)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (16, 'Black', 'One Size', 'MES-016-BLA-One Size', 'https://placehold.co/400x400?text=Black+One Size', 10)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (16, 'Charcoal', 'One Size', 'MES-016-CHA-One Size', 'https://placehold.co/400x400?text=Charcoal+One Size', 66)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (16, 'Grey', 'One Size', 'MES-016-GRE-One Size', 'https://placehold.co/400x400?text=Grey+One Size', 96)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (17, 'Vintage 100% Cotton Joggers', 'vintage-100-cotton-joggers-17', 'Get ready for the season with this Vintage 100% Cotton Joggers. Made of breathable 100% cotton, giving you a truly vintage vibe.', 'https://placehold.co/600x400?text=joggers', 294.00, 294.00, TRUE, 4.9, 75);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (17, 'Burgundy', 'L', 'JOG-017-BUR-L', 'https://placehold.co/400x400?text=Burgundy+L', 26)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (17, 'Charcoal', 'XL', 'JOG-017-CHA-XL', 'https://placehold.co/400x400?text=Charcoal+XL', 97)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (17, 'Grey', 'S', 'JOG-017-GRE-S', 'https://placehold.co/400x400?text=Grey+S', 0)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (17, 'Navy Blue', 'M', 'JOG-017-NAV-M', 'https://placehold.co/400x400?text=Navy Blue+M', 4)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (18, 'Classic Canvas Knitted Sweater', 'classic-canvas-knitted-sweater-18', 'Discover the perfect blend of fashion and function with our Classic Canvas Knitted Sweater. classic style meets durable canvas.', 'https://placehold.co/600x400?text=knitted-sweater', 74.00, 59.20, TRUE, 3.7, 12);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (18, 'Charcoal', 'M', 'KNI-018-CHA-M', 'https://placehold.co/400x400?text=Charcoal+M', 56)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (18, 'Beige', 'M', 'KNI-018-BEI-M', 'https://placehold.co/400x400?text=Beige+M', 33)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (19, 'Luxury Polyester Chinos', 'luxury-polyester-chinos-19', 'Discover the perfect blend of fashion and function with our Luxury Polyester Chinos. luxury style meets durable polyester.', 'https://placehold.co/600x400?text=chinos', 272.00, 272.00, TRUE, 4.1, 45);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (19, 'Beige', 'XL', 'CHI-019-BEI-XL', 'https://placehold.co/400x400?text=Beige+XL', 27)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (19, 'Burgundy', 'S', 'CHI-019-BUR-S', 'https://placehold.co/400x400?text=Burgundy+S', 5)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (20, 'Oversized Velvet Evening Gown', 'oversized-velvet-evening-gown-20', 'Elevate your style with the Oversized Velvet Evening Gown. Crafted from velvet, this item offers a oversized look suitable for any occasion.', 'https://placehold.co/600x400?text=evening-gown', 348.00, 348.00, TRUE, 4.4, 75);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (20, 'Grey', 'M', 'EVE-020-GRE-M', 'https://placehold.co/400x400?text=Grey+M', 75)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (20, 'Olive Green', 'L', 'EVE-020-OLI-L', 'https://placehold.co/400x400?text=Olive Green+L', 23)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (21, 'Cozy Silk Satin Polo Shirt', 'cozy-silk-satin-polo-shirt-21', 'The Cozy Silk Satin Polo Shirt is a must-have for your wardrobe. Features a cozy design and high-quality silk satin for maximum comfort.', 'https://placehold.co/600x400?text=polo-shirt', 483.00, 386.40, TRUE, 4.0, 92);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (21, 'Beige', 'S', 'POL-021-BEI-S', 'https://placehold.co/400x400?text=Beige+S', 79)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (21, 'Burgundy', 'XL', 'POL-021-BUR-XL', 'https://placehold.co/400x400?text=Burgundy+XL', 51)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (21, 'Grey', 'XXL', 'POL-021-GRE-XXL', 'https://placehold.co/400x400?text=Grey+XXL', 22)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (21, 'Navy Blue', 'L', 'POL-021-NAV-L', 'https://placehold.co/400x400?text=Navy Blue+L', 60)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (22, 'Elegant Chiffon Running Shoes', 'elegant-chiffon-running-shoes-22', 'Elevate your style with the Elegant Chiffon Running Shoes. Crafted from chiffon, this item offers a elegant look suitable for any occasion.', 'https://placehold.co/600x400?text=running-shoes', 126.00, 100.80, TRUE, 3.8, 12);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (22, 'Charcoal', '44', 'RUN-022-CHA-44', 'https://placehold.co/400x400?text=Charcoal+44', 6)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (22, 'Burgundy', '41', 'RUN-022-BUR-41', 'https://placehold.co/400x400?text=Burgundy+41', 46)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (23, 'Athletic Wool Blend T-Shirt', 'athletic-wool-blend-t-shirt-23', 'The Athletic Wool Blend T-Shirt is a must-have for your wardrobe. Features a athletic design and high-quality wool blend for maximum comfort.', 'https://placehold.co/600x400?text=t-shirt', 59.00, 47.20, TRUE, 4.4, 76);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (23, 'Grey', 'XL', 'T-S-023-GRE-XL', 'https://placehold.co/400x400?text=Grey+XL', 16)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (23, 'Pastel Pink', 'M', 'T-S-023-PAS-M', 'https://placehold.co/400x400?text=Pastel Pink+M', 96)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (23, 'White', 'L', 'T-S-023-WHI-L', 'https://placehold.co/400x400?text=White+L', 20)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (24, 'Retro Canvas Tote Bag', 'retro-canvas-tote-bag-24', 'Discover the perfect blend of fashion and function with our Retro Canvas Tote Bag. retro style meets durable canvas.', 'https://placehold.co/600x400?text=tote-bag', 392.00, 392.00, TRUE, 4.1, 63);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (24, 'White', 'One Size', 'TOT-024-WHI-One Size', 'https://placehold.co/400x400?text=White+One Size', 38)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (24, 'Beige', 'One Size', 'TOT-024-BEI-One Size', 'https://placehold.co/400x400?text=Beige+One Size', 32)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (24, 'Grey', 'One Size', 'TOT-024-GRE-One Size', 'https://placehold.co/400x400?text=Grey+One Size', 79)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (24, 'Olive Green', 'One Size', 'TOT-024-OLI-One Size', 'https://placehold.co/400x400?text=Olive Green+One Size', 43)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (25, 'Luxury Velvet Knitted Sweater', 'luxury-velvet-knitted-sweater-25', 'Get ready for the season with this Luxury Velvet Knitted Sweater. Made of breathable velvet, giving you a truly luxury vibe.', 'https://placehold.co/600x400?text=knitted-sweater', 401.00, 401.00, TRUE, 4.1, 78);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (25, 'Black', 'XL', 'KNI-025-BLA-XL', 'https://placehold.co/400x400?text=Black+XL', 100)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (25, 'Burgundy', 'XL', 'KNI-025-BUR-XL', 'https://placehold.co/400x400?text=Burgundy+XL', 9)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (25, 'Beige', 'XXL', 'KNI-025-BEI-XXL', 'https://placehold.co/400x400?text=Beige+XXL', 26)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (26, 'Vintage Polyester Oxford Shirt', 'vintage-polyester-oxford-shirt-26', 'Discover the perfect blend of fashion and function with our Vintage Polyester Oxford Shirt. vintage style meets durable polyester.', 'https://placehold.co/600x400?text=oxford-shirt', 351.00, 351.00, TRUE, 4.7, 38);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (26, 'Navy Blue', 'S', 'OXF-026-NAV-S', 'https://placehold.co/400x400?text=Navy Blue+S', 12)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (26, 'Burgundy', 'L', 'OXF-026-BUR-L', 'https://placehold.co/400x400?text=Burgundy+L', 85)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (26, 'Grey', 'M', 'OXF-026-GRE-M', 'https://placehold.co/400x400?text=Grey+M', 94)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (27, 'Urban Denim Ankle Boots', 'urban-denim-ankle-boots-27', 'Discover the perfect blend of fashion and function with our Urban Denim Ankle Boots. urban style meets durable denim.', 'https://placehold.co/600x400?text=ankle-boots', 491.00, 491.00, TRUE, 4.5, 95);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (27, 'Olive Green', '43', 'ANK-027-OLI-43', 'https://placehold.co/400x400?text=Olive Green+43', 16)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (27, 'Beige', '39', 'ANK-027-BEI-39', 'https://placehold.co/400x400?text=Beige+39', 92)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (27, 'Navy Blue', '41', 'ANK-027-NAV-41', 'https://placehold.co/400x400?text=Navy Blue+41', 74)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (28, 'Minimalist Silk Satin Pleated Skirt', 'minimalist-silk-satin-pleated-skirt-28', 'The Minimalist Silk Satin Pleated Skirt is a must-have for your wardrobe. Features a minimalist design and high-quality silk satin for maximum comfort.', 'https://placehold.co/600x400?text=pleated-skirt', 262.00, 209.60, TRUE, 5.0, 84);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (28, 'Navy Blue', 'S', 'PLE-028-NAV-S', 'https://placehold.co/400x400?text=Navy Blue+S', 53)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (28, 'White', 'L', 'PLE-028-WHI-L', 'https://placehold.co/400x400?text=White+L', 12)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (28, 'Burgundy', 'XS', 'PLE-028-BUR-XS', 'https://placehold.co/400x400?text=Burgundy+XS', 100)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (28, 'Grey', 'XXL', 'PLE-028-GRE-XXL', 'https://placehold.co/400x400?text=Grey+XXL', 43)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (29, 'Urban Chiffon Clutch', 'urban-chiffon-clutch-29', 'Elevate your style with the Urban Chiffon Clutch. Crafted from chiffon, this item offers a urban look suitable for any occasion.', 'https://placehold.co/600x400?text=clutch', 459.00, 367.20, TRUE, 4.1, 90);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (29, 'Grey', 'One Size', 'CLU-029-GRE-One Size', 'https://placehold.co/400x400?text=Grey+One Size', 3)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (29, 'Black', 'One Size', 'CLU-029-BLA-One Size', 'https://placehold.co/400x400?text=Black+One Size', 0)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (29, 'Navy Blue', 'One Size', 'CLU-029-NAV-One Size', 'https://placehold.co/400x400?text=Navy Blue+One Size', 46)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (29, 'Pastel Pink', 'One Size', 'CLU-029-PAS-One Size', 'https://placehold.co/400x400?text=Pastel Pink+One Size', 91)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (30, 'Vintage Wool Blend Evening Gown', 'vintage-wool-blend-evening-gown-30', 'Discover the perfect blend of fashion and function with our Vintage Wool Blend Evening Gown. vintage style meets durable wool blend.', 'https://placehold.co/600x400?text=evening-gown', 362.00, 362.00, TRUE, 3.8, 16);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (30, 'White', 'XL', 'EVE-030-WHI-XL', 'https://placehold.co/400x400?text=White+XL', 14)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (30, 'Beige', 'XL', 'EVE-030-BEI-XL', 'https://placehold.co/400x400?text=Beige+XL', 17)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (30, 'Navy Blue', 'XS', 'EVE-030-NAV-XS', 'https://placehold.co/400x400?text=Navy Blue+XS', 31)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (30, 'Pastel Pink', 'XS', 'EVE-030-PAS-XS', 'https://placehold.co/400x400?text=Pastel Pink+XS', 25)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (31, 'Urban Velvet Cocktail Dress', 'urban-velvet-cocktail-dress-31', 'The Urban Velvet Cocktail Dress is a must-have for your wardrobe. Features a urban design and high-quality velvet for maximum comfort.', 'https://placehold.co/600x400?text=cocktail-dress', 66.00, 66.00, TRUE, 4.2, 70);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (31, 'Navy Blue', 'XS', 'COC-031-NAV-XS', 'https://placehold.co/400x400?text=Navy Blue+XS', 66)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (31, 'Black', 'XXL', 'COC-031-BLA-XXL', 'https://placehold.co/400x400?text=Black+XXL', 6)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (31, 'Pastel Pink', 'XXL', 'COC-031-PAS-XXL', 'https://placehold.co/400x400?text=Pastel Pink+XXL', 29)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (32, 'Bohemian Silk Satin Jeans', 'bohemian-silk-satin-jeans-32', 'Best-seller of the collection: Bohemian Silk Satin Jeans. Designed for those who love bohemian aesthetics. Material: silk satin.', 'https://placehold.co/600x400?text=jeans', 74.00, 59.20, TRUE, 3.9, 19);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (32, 'Pastel Pink', 'S', 'JEA-032-PAS-S', 'https://placehold.co/400x400?text=Pastel Pink+S', 95)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (32, 'Burgundy', 'L', 'JEA-032-BUR-L', 'https://placehold.co/400x400?text=Burgundy+L', 19)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (32, 'Charcoal', 'M', 'JEA-032-CHA-M', 'https://placehold.co/400x400?text=Charcoal+M', 72)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (33, 'Vintage Genuine Leather Maxi Dress', 'vintage-genuine-leather-maxi-dress-33', 'Best-seller of the collection: Vintage Genuine Leather Maxi Dress. Designed for those who love vintage aesthetics. Material: genuine leather.', 'https://placehold.co/600x400?text=maxi-dress', 397.00, 397.00, TRUE, 4.4, 79);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (33, 'Olive Green', 'L', 'MAX-033-OLI-L', 'https://placehold.co/400x400?text=Olive Green+L', 71)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (33, 'Navy Blue', 'XS', 'MAX-033-NAV-XS', 'https://placehold.co/400x400?text=Navy Blue+XS', 13)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (33, 'Burgundy', 'M', 'MAX-033-BUR-M', 'https://placehold.co/400x400?text=Burgundy+M', 28)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (33, 'Black', 'S', 'MAX-033-BLA-S', 'https://placehold.co/400x400?text=Black+S', 62)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (34, 'Luxury Polyester Messenger Bag', 'luxury-polyester-messenger-bag-34', 'Get ready for the season with this Luxury Polyester Messenger Bag. Made of breathable polyester, giving you a truly luxury vibe.', 'https://placehold.co/600x400?text=messenger-bag', 271.00, 271.00, TRUE, 4.4, 23);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (34, 'Beige', 'One Size', 'MES-034-BEI-One Size', 'https://placehold.co/400x400?text=Beige+One Size', 46)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (34, 'Charcoal', 'One Size', 'MES-034-CHA-One Size', 'https://placehold.co/400x400?text=Charcoal+One Size', 89)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (34, 'White', 'One Size', 'MES-034-WHI-One Size', 'https://placehold.co/400x400?text=White+One Size', 31)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (35, 'Elegant Linen Ankle Boots', 'elegant-linen-ankle-boots-35', 'The Elegant Linen Ankle Boots is a must-have for your wardrobe. Features a elegant design and high-quality linen for maximum comfort.', 'https://placehold.co/600x400?text=ankle-boots', 324.00, 259.20, TRUE, 4.1, 75);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (35, 'Grey', '44', 'ANK-035-GRE-44', 'https://placehold.co/400x400?text=Grey+44', 72)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (35, 'Olive Green', '43', 'ANK-035-OLI-43', 'https://placehold.co/400x400?text=Olive Green+43', 53)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (35, 'Charcoal', '44', 'ANK-035-CHA-44', 'https://placehold.co/400x400?text=Charcoal+44', 8)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (36, 'Urban Linen Cargo Shorts', 'urban-linen-cargo-shorts-36', 'Best-seller of the collection: Urban Linen Cargo Shorts. Designed for those who love urban aesthetics. Material: linen.', 'https://placehold.co/600x400?text=cargo-shorts', 286.00, 286.00, TRUE, 3.9, 90);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (36, 'Olive Green', 'S', 'CAR-036-OLI-S', 'https://placehold.co/400x400?text=Olive Green+S', 18)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (36, 'Burgundy', 'S', 'CAR-036-BUR-S', 'https://placehold.co/400x400?text=Burgundy+S', 10)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (37, 'Athletic Denim Ankle Boots', 'athletic-denim-ankle-boots-37', 'The Athletic Denim Ankle Boots is a must-have for your wardrobe. Features a athletic design and high-quality denim for maximum comfort.', 'https://placehold.co/600x400?text=ankle-boots', 95.00, 95.00, TRUE, 4.0, 90);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (37, 'Grey', '41', 'ANK-037-GRE-41', 'https://placehold.co/400x400?text=Grey+41', 38)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (37, 'Pastel Pink', '39', 'ANK-037-PAS-39', 'https://placehold.co/400x400?text=Pastel Pink+39', 57)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (38, 'Minimalist Denim Evening Gown', 'minimalist-denim-evening-gown-38', 'Discover the perfect blend of fashion and function with our Minimalist Denim Evening Gown. minimalist style meets durable denim.', 'https://placehold.co/600x400?text=evening-gown', 458.00, 366.40, TRUE, 4.0, 52);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (38, 'White', 'XXL', 'EVE-038-WHI-XXL', 'https://placehold.co/400x400?text=White+XXL', 4)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (38, 'Olive Green', 'M', 'EVE-038-OLI-M', 'https://placehold.co/400x400?text=Olive Green+M', 2)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (38, 'Grey', 'S', 'EVE-038-GRE-S', 'https://placehold.co/400x400?text=Grey+S', 29)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (38, 'Black', 'XL', 'EVE-038-BLA-XL', 'https://placehold.co/400x400?text=Black+XL', 91)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (39, 'Cozy Polyester Loafers', 'cozy-polyester-loafers-39', 'Elevate your style with the Cozy Polyester Loafers. Crafted from polyester, this item offers a cozy look suitable for any occasion.', 'https://placehold.co/600x400?text=loafers', 467.00, 467.00, TRUE, 3.7, 41);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (39, 'Charcoal', '41', 'LOA-039-CHA-41', 'https://placehold.co/400x400?text=Charcoal+41', 9)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (39, 'Olive Green', '42', 'LOA-039-OLI-42', 'https://placehold.co/400x400?text=Olive Green+42', 81)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (39, 'Grey', '40', 'LOA-039-GRE-40', 'https://placehold.co/400x400?text=Grey+40', 43)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (39, 'Navy Blue', '38', 'LOA-039-NAV-38', 'https://placehold.co/400x400?text=Navy Blue+38', 33)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (40, 'Vintage Wool Blend Joggers', 'vintage-wool-blend-joggers-40', 'The Vintage Wool Blend Joggers is a must-have for your wardrobe. Features a vintage design and high-quality wool blend for maximum comfort.', 'https://placehold.co/600x400?text=joggers', 388.00, 310.40, TRUE, 3.6, 86);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (40, 'Olive Green', 'L', 'JOG-040-OLI-L', 'https://placehold.co/400x400?text=Olive Green+L', 31)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (40, 'Grey', 'L', 'JOG-040-GRE-L', 'https://placehold.co/400x400?text=Grey+L', 5)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (40, 'Navy Blue', 'L', 'JOG-040-NAV-L', 'https://placehold.co/400x400?text=Navy Blue+L', 4)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (41, 'Modern Genuine Leather Cocktail Dress', 'modern-genuine-leather-cocktail-dress-41', 'Best-seller of the collection: Modern Genuine Leather Cocktail Dress. Designed for those who love modern aesthetics. Material: genuine leather.', 'https://placehold.co/600x400?text=cocktail-dress', 176.00, 140.80, TRUE, 3.5, 99);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (41, 'Olive Green', 'M', 'COC-041-OLI-M', 'https://placehold.co/400x400?text=Olive Green+M', 73)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (41, 'Pastel Pink', 'XXL', 'COC-041-PAS-XXL', 'https://placehold.co/400x400?text=Pastel Pink+XXL', 86)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (42, 'Slim-Fit Corduroy Crop Top', 'slim-fit-corduroy-crop-top-42', 'Elevate your style with the Slim-Fit Corduroy Crop Top. Crafted from corduroy, this item offers a slim-fit look suitable for any occasion.', 'https://placehold.co/600x400?text=crop-top', 377.00, 377.00, TRUE, 3.7, 84);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (42, 'Olive Green', 'L', 'CRO-042-OLI-L', 'https://placehold.co/400x400?text=Olive Green+L', 74)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (42, 'Navy Blue', 'L', 'CRO-042-NAV-L', 'https://placehold.co/400x400?text=Navy Blue+L', 9)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (43, 'Retro Chiffon Floral Sundress', 'retro-chiffon-floral-sundress-43', 'The Retro Chiffon Floral Sundress is a must-have for your wardrobe. Features a retro design and high-quality chiffon for maximum comfort.', 'https://placehold.co/600x400?text=floral-sundress', 228.00, 228.00, TRUE, 4.9, 73);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (43, 'Black', 'XS', 'FLO-043-BLA-XS', 'https://placehold.co/400x400?text=Black+XS', 45)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (43, 'Burgundy', 'L', 'FLO-043-BUR-L', 'https://placehold.co/400x400?text=Burgundy+L', 43)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (43, 'Grey', 'M', 'FLO-043-GRE-M', 'https://placehold.co/400x400?text=Grey+M', 43)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (43, 'Beige', 'S', 'FLO-043-BEI-S', 'https://placehold.co/400x400?text=Beige+S', 72)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (44, 'Slim-Fit Denim Loafers', 'slim-fit-denim-loafers-44', 'Elevate your style with the Slim-Fit Denim Loafers. Crafted from denim, this item offers a slim-fit look suitable for any occasion.', 'https://placehold.co/600x400?text=loafers', 458.00, 458.00, TRUE, 4.6, 12);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (44, 'Navy Blue', '44', 'LOA-044-NAV-44', 'https://placehold.co/400x400?text=Navy Blue+44', 17)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (44, 'Burgundy', '44', 'LOA-044-BUR-44', 'https://placehold.co/400x400?text=Burgundy+44', 93)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (45, 'Premium Canvas Sandals', 'premium-canvas-sandals-45', 'Get ready for the season with this Premium Canvas Sandals. Made of breathable canvas, giving you a truly premium vibe.', 'https://placehold.co/600x400?text=sandals', 130.00, 130.00, TRUE, 3.5, 5);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (45, 'Grey', '42', 'SAN-045-GRE-42', 'https://placehold.co/400x400?text=Grey+42', 27)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (45, 'Beige', '43', 'SAN-045-BEI-43', 'https://placehold.co/400x400?text=Beige+43', 38)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (45, 'Navy Blue', '40', 'SAN-045-NAV-40', 'https://placehold.co/400x400?text=Navy Blue+40', 36)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (45, 'Olive Green', '41', 'SAN-045-OLI-41', 'https://placehold.co/400x400?text=Olive Green+41', 94)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (46, 'Athletic Silk Satin T-Shirt', 'athletic-silk-satin-t-shirt-46', 'Best-seller of the collection: Athletic Silk Satin T-Shirt. Designed for those who love athletic aesthetics. Material: silk satin.', 'https://placehold.co/600x400?text=t-shirt', 371.00, 296.80, TRUE, 4.4, 57);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (46, 'Beige', 'XS', 'T-S-046-BEI-XS', 'https://placehold.co/400x400?text=Beige+XS', 4)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (46, 'Charcoal', 'XS', 'T-S-046-CHA-XS', 'https://placehold.co/400x400?text=Charcoal+XS', 87)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (47, 'Cozy Polyester Chinos', 'cozy-polyester-chinos-47', 'Elevate your style with the Cozy Polyester Chinos. Crafted from polyester, this item offers a cozy look suitable for any occasion.', 'https://placehold.co/600x400?text=chinos', 101.00, 101.00, TRUE, 4.5, 32);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (47, 'Grey', 'XL', 'CHI-047-GRE-XL', 'https://placehold.co/400x400?text=Grey+XL', 12)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (47, 'Pastel Pink', 'L', 'CHI-047-PAS-L', 'https://placehold.co/400x400?text=Pastel Pink+L', 90)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (47, 'Burgundy', 'M', 'CHI-047-BUR-M', 'https://placehold.co/400x400?text=Burgundy+M', 18)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (48, 'Athletic 100% Cotton Evening Gown', 'athletic-100-cotton-evening-gown-48', 'Discover the perfect blend of fashion and function with our Athletic 100% Cotton Evening Gown. athletic style meets durable 100% cotton.', 'https://placehold.co/600x400?text=evening-gown', 374.00, 374.00, TRUE, 4.5, 9);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (48, 'Black', 'XL', 'EVE-048-BLA-XL', 'https://placehold.co/400x400?text=Black+XL', 42)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (48, 'Burgundy', 'XXL', 'EVE-048-BUR-XXL', 'https://placehold.co/400x400?text=Burgundy+XXL', 65)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (49, 'Urban Silk Satin Tank Top', 'urban-silk-satin-tank-top-49', 'Best-seller of the collection: Urban Silk Satin Tank Top. Designed for those who love urban aesthetics. Material: silk satin.', 'https://placehold.co/600x400?text=tank-top', 353.00, 282.40, TRUE, 3.7, 52);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (49, 'Charcoal', 'XL', 'TAN-049-CHA-XL', 'https://placehold.co/400x400?text=Charcoal+XL', 34)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (49, 'White', 'XL', 'TAN-049-WHI-XL', 'https://placehold.co/400x400?text=White+XL', 34)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (49, 'Burgundy', 'S', 'TAN-049-BUR-S', 'https://placehold.co/400x400?text=Burgundy+S', 14)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (50, 'Oversized Polyester Silk Blouse', 'oversized-polyester-silk-blouse-50', 'The Oversized Polyester Silk Blouse is a must-have for your wardrobe. Features a oversized design and high-quality polyester for maximum comfort.', 'https://placehold.co/600x400?text=silk-blouse', 428.00, 342.40, TRUE, 4.9, 75);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (50, 'Black', 'M', 'SIL-050-BLA-M', 'https://placehold.co/400x400?text=Black+M', 55)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (50, 'Burgundy', 'S', 'SIL-050-BUR-S', 'https://placehold.co/400x400?text=Burgundy+S', 18)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (51, 'Modern Wool Blend Ankle Boots', 'modern-wool-blend-ankle-boots-51', 'Best-seller of the collection: Modern Wool Blend Ankle Boots. Designed for those who love modern aesthetics. Material: wool blend.', 'https://placehold.co/600x400?text=ankle-boots', 306.00, 306.00, TRUE, 5.0, 18);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (51, 'Black', '41', 'ANK-051-BLA-41', 'https://placehold.co/400x400?text=Black+41', 51)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (51, 'Charcoal', '43', 'ANK-051-CHA-43', 'https://placehold.co/400x400?text=Charcoal+43', 62)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (51, 'Pastel Pink', '38', 'ANK-051-PAS-38', 'https://placehold.co/400x400?text=Pastel Pink+38', 85)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (52, 'Modern Silk Satin Cargo Shorts', 'modern-silk-satin-cargo-shorts-52', 'Best-seller of the collection: Modern Silk Satin Cargo Shorts. Designed for those who love modern aesthetics. Material: silk satin.', 'https://placehold.co/600x400?text=cargo-shorts', 235.00, 235.00, TRUE, 4.6, 90);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (52, 'White', 'S', 'CAR-052-WHI-S', 'https://placehold.co/400x400?text=White+S', 35)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (52, 'Pastel Pink', 'M', 'CAR-052-PAS-M', 'https://placehold.co/400x400?text=Pastel Pink+M', 80)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (52, 'Grey', 'L', 'CAR-052-GRE-L', 'https://placehold.co/400x400?text=Grey+L', 72)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (53, 'Premium Chiffon Polo Shirt', 'premium-chiffon-polo-shirt-53', 'Get ready for the season with this Premium Chiffon Polo Shirt. Made of breathable chiffon, giving you a truly premium vibe.', 'https://placehold.co/600x400?text=polo-shirt', 324.00, 259.20, TRUE, 4.7, 81);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (53, 'Grey', 'M', 'POL-053-GRE-M', 'https://placehold.co/400x400?text=Grey+M', 97)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (53, 'Charcoal', 'M', 'POL-053-CHA-M', 'https://placehold.co/400x400?text=Charcoal+M', 97)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (53, 'White', 'XS', 'POL-053-WHI-XS', 'https://placehold.co/400x400?text=White+XS', 70)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (54, 'Cozy Genuine Leather Evening Gown', 'cozy-genuine-leather-evening-gown-54', 'Elevate your style with the Cozy Genuine Leather Evening Gown. Crafted from genuine leather, this item offers a cozy look suitable for any occasion.', 'https://placehold.co/600x400?text=evening-gown', 230.00, 230.00, TRUE, 3.8, 27);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (54, 'White', 'XS', 'EVE-054-WHI-XS', 'https://placehold.co/400x400?text=White+XS', 61)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (54, 'Pastel Pink', 'M', 'EVE-054-PAS-M', 'https://placehold.co/400x400?text=Pastel Pink+M', 17)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (54, 'Grey', 'XL', 'EVE-054-GRE-XL', 'https://placehold.co/400x400?text=Grey+XL', 80)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (54, 'Charcoal', 'XL', 'EVE-054-CHA-XL', 'https://placehold.co/400x400?text=Charcoal+XL', 58)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (55, 'Minimalist Linen Jeans', 'minimalist-linen-jeans-55', 'The Minimalist Linen Jeans is a must-have for your wardrobe. Features a minimalist design and high-quality linen for maximum comfort.', 'https://placehold.co/600x400?text=jeans', 292.00, 292.00, TRUE, 3.8, 41);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (55, 'Grey', 'XL', 'JEA-055-GRE-XL', 'https://placehold.co/400x400?text=Grey+XL', 56)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (55, 'Burgundy', 'M', 'JEA-055-BUR-M', 'https://placehold.co/400x400?text=Burgundy+M', 1)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (56, 'Modern Genuine Leather Polo Shirt', 'modern-genuine-leather-polo-shirt-56', 'Get ready for the season with this Modern Genuine Leather Polo Shirt. Made of breathable genuine leather, giving you a truly modern vibe.', 'https://placehold.co/600x400?text=polo-shirt', 206.00, 164.80, TRUE, 3.6, 69);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (56, 'Grey', 'S', 'POL-056-GRE-S', 'https://placehold.co/400x400?text=Grey+S', 98)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (56, 'Beige', 'XXL', 'POL-056-BEI-XXL', 'https://placehold.co/400x400?text=Beige+XXL', 45)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (57, 'Slim-Fit Denim Clutch', 'slim-fit-denim-clutch-57', 'Elevate your style with the Slim-Fit Denim Clutch. Crafted from denim, this item offers a slim-fit look suitable for any occasion.', 'https://placehold.co/600x400?text=clutch', 335.00, 268.00, TRUE, 4.3, 48);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (57, 'White', 'One Size', 'CLU-057-WHI-One Size', 'https://placehold.co/400x400?text=White+One Size', 31)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (57, 'Black', 'One Size', 'CLU-057-BLA-One Size', 'https://placehold.co/400x400?text=Black+One Size', 5)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (57, 'Olive Green', 'One Size', 'CLU-057-OLI-One Size', 'https://placehold.co/400x400?text=Olive Green+One Size', 77)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (57, 'Grey', 'One Size', 'CLU-057-GRE-One Size', 'https://placehold.co/400x400?text=Grey+One Size', 28)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (58, 'Elegant Chiffon Chinos', 'elegant-chiffon-chinos-58', 'Discover the perfect blend of fashion and function with our Elegant Chiffon Chinos. elegant style meets durable chiffon.', 'https://placehold.co/600x400?text=chinos', 157.00, 157.00, TRUE, 4.5, 10);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (58, 'Beige', 'XS', 'CHI-058-BEI-XS', 'https://placehold.co/400x400?text=Beige+XS', 64)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (58, 'Pastel Pink', 'S', 'CHI-058-PAS-S', 'https://placehold.co/400x400?text=Pastel Pink+S', 11)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (58, 'Charcoal', 'M', 'CHI-058-CHA-M', 'https://placehold.co/400x400?text=Charcoal+M', 40)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (58, 'White', 'S', 'CHI-058-WHI-S', 'https://placehold.co/400x400?text=White+S', 19)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (59, 'Classic Polyester Trousers', 'classic-polyester-trousers-59', 'Best-seller of the collection: Classic Polyester Trousers. Designed for those who love classic aesthetics. Material: polyester.', 'https://placehold.co/600x400?text=trousers', 94.00, 75.20, TRUE, 3.8, 43);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (59, 'Beige', 'XS', 'TRO-059-BEI-XS', 'https://placehold.co/400x400?text=Beige+XS', 53)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (59, 'Pastel Pink', 'XXL', 'TRO-059-PAS-XXL', 'https://placehold.co/400x400?text=Pastel Pink+XXL', 95)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (60, 'Cozy Genuine Leather Chinos', 'cozy-genuine-leather-chinos-60', 'Get ready for the season with this Cozy Genuine Leather Chinos. Made of breathable genuine leather, giving you a truly cozy vibe.', 'https://placehold.co/600x400?text=chinos', 199.00, 199.00, TRUE, 3.6, 68);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (60, 'Beige', 'S', 'CHI-060-BEI-S', 'https://placehold.co/400x400?text=Beige+S', 14)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (60, 'Black', 'M', 'CHI-060-BLA-M', 'https://placehold.co/400x400?text=Black+M', 45)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (60, 'Grey', 'M', 'CHI-060-GRE-M', 'https://placehold.co/400x400?text=Grey+M', 30)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (61, 'Premium Corduroy Sandals', 'premium-corduroy-sandals-61', 'Get ready for the season with this Premium Corduroy Sandals. Made of breathable corduroy, giving you a truly premium vibe.', 'https://placehold.co/600x400?text=sandals', 98.00, 78.40, TRUE, 5.0, 50);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (61, 'Charcoal', '44', 'SAN-061-CHA-44', 'https://placehold.co/400x400?text=Charcoal+44', 68)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (61, 'Black', '44', 'SAN-061-BLA-44', 'https://placehold.co/400x400?text=Black+44', 34)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (62, 'Elegant Denim High Heels', 'elegant-denim-high-heels-62', 'The Elegant Denim High Heels is a must-have for your wardrobe. Features a elegant design and high-quality denim for maximum comfort.', 'https://placehold.co/600x400?text=high-heels', 349.00, 279.20, TRUE, 4.9, 87);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (62, 'Grey', '43', 'HIG-062-GRE-43', 'https://placehold.co/400x400?text=Grey+43', 50)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (62, 'Beige', '38', 'HIG-062-BEI-38', 'https://placehold.co/400x400?text=Beige+38', 66)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (62, 'Burgundy', '44', 'HIG-062-BUR-44', 'https://placehold.co/400x400?text=Burgundy+44', 5)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (63, 'Luxury Polyester Knitted Sweater', 'luxury-polyester-knitted-sweater-63', 'Discover the perfect blend of fashion and function with our Luxury Polyester Knitted Sweater. luxury style meets durable polyester.', 'https://placehold.co/600x400?text=knitted-sweater', 144.00, 115.20, TRUE, 3.8, 17);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (63, 'Charcoal', 'XL', 'KNI-063-CHA-XL', 'https://placehold.co/400x400?text=Charcoal+XL', 48)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (63, 'Olive Green', 'S', 'KNI-063-OLI-S', 'https://placehold.co/400x400?text=Olive Green+S', 81)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (64, 'Classic Velvet Silk Blouse', 'classic-velvet-silk-blouse-64', 'Discover the perfect blend of fashion and function with our Classic Velvet Silk Blouse. classic style meets durable velvet.', 'https://placehold.co/600x400?text=silk-blouse', 283.00, 283.00, TRUE, 3.8, 19);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (64, 'Charcoal', 'L', 'SIL-064-CHA-L', 'https://placehold.co/400x400?text=Charcoal+L', 40)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (64, 'Beige', 'XXL', 'SIL-064-BEI-XXL', 'https://placehold.co/400x400?text=Beige+XXL', 83)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (64, 'White', 'XL', 'SIL-064-WHI-XL', 'https://placehold.co/400x400?text=White+XL', 4)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (65, 'Modern Wool Blend Tank Top', 'modern-wool-blend-tank-top-65', 'Elevate your style with the Modern Wool Blend Tank Top. Crafted from wool blend, this item offers a modern look suitable for any occasion.', 'https://placehold.co/600x400?text=tank-top', 292.00, 233.60, TRUE, 4.8, 25);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (65, 'White', 'XS', 'TAN-065-WHI-XS', 'https://placehold.co/400x400?text=White+XS', 97)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (65, 'Black', 'XL', 'TAN-065-BLA-XL', 'https://placehold.co/400x400?text=Black+XL', 8)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (65, 'Burgundy', 'XXL', 'TAN-065-BUR-XXL', 'https://placehold.co/400x400?text=Burgundy+XXL', 5)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (66, 'Athletic Velvet T-Shirt', 'athletic-velvet-t-shirt-66', 'Discover the perfect blend of fashion and function with our Athletic Velvet T-Shirt. athletic style meets durable velvet.', 'https://placehold.co/600x400?text=t-shirt', 331.00, 331.00, TRUE, 4.3, 88);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (66, 'Pastel Pink', 'S', 'T-S-066-PAS-S', 'https://placehold.co/400x400?text=Pastel Pink+S', 4)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (66, 'Olive Green', 'XL', 'T-S-066-OLI-XL', 'https://placehold.co/400x400?text=Olive Green+XL', 16)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (66, 'Black', 'XL', 'T-S-066-BLA-XL', 'https://placehold.co/400x400?text=Black+XL', 62)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (66, 'Beige', 'XXL', 'T-S-066-BEI-XXL', 'https://placehold.co/400x400?text=Beige+XXL', 12)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (67, 'Elegant Linen Evening Gown', 'elegant-linen-evening-gown-67', 'The Elegant Linen Evening Gown is a must-have for your wardrobe. Features a elegant design and high-quality linen for maximum comfort.', 'https://placehold.co/600x400?text=evening-gown', 344.00, 344.00, TRUE, 4.9, 1);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (67, 'White', 'XL', 'EVE-067-WHI-XL', 'https://placehold.co/400x400?text=White+XL', 30)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (67, 'Charcoal', 'S', 'EVE-067-CHA-S', 'https://placehold.co/400x400?text=Charcoal+S', 86)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (67, 'Beige', 'S', 'EVE-067-BEI-S', 'https://placehold.co/400x400?text=Beige+S', 36)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (67, 'Olive Green', 'S', 'EVE-067-OLI-S', 'https://placehold.co/400x400?text=Olive Green+S', 54)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (68, 'Slim-Fit Wool Blend Messenger Bag', 'slim-fit-wool-blend-messenger-bag-68', 'Get ready for the season with this Slim-Fit Wool Blend Messenger Bag. Made of breathable wool blend, giving you a truly slim-fit vibe.', 'https://placehold.co/600x400?text=messenger-bag', 458.00, 458.00, TRUE, 4.4, 2);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (68, 'Beige', 'One Size', 'MES-068-BEI-One Size', 'https://placehold.co/400x400?text=Beige+One Size', 48)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (68, 'Pastel Pink', 'One Size', 'MES-068-PAS-One Size', 'https://placehold.co/400x400?text=Pastel Pink+One Size', 13)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (68, 'Grey', 'One Size', 'MES-068-GRE-One Size', 'https://placehold.co/400x400?text=Grey+One Size', 37)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (69, 'Athletic Silk Satin Messenger Bag', 'athletic-silk-satin-messenger-bag-69', 'The Athletic Silk Satin Messenger Bag is a must-have for your wardrobe. Features a athletic design and high-quality silk satin for maximum comfort.', 'https://placehold.co/600x400?text=messenger-bag', 76.00, 76.00, TRUE, 4.1, 33);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (69, 'Black', 'One Size', 'MES-069-BLA-One Size', 'https://placehold.co/400x400?text=Black+One Size', 66)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (69, 'Charcoal', 'One Size', 'MES-069-CHA-One Size', 'https://placehold.co/400x400?text=Charcoal+One Size', 81)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (70, 'Minimalist Genuine Leather Loafers', 'minimalist-genuine-leather-loafers-70', 'The Minimalist Genuine Leather Loafers is a must-have for your wardrobe. Features a minimalist design and high-quality genuine leather for maximum comfort.', 'https://placehold.co/600x400?text=loafers', 474.00, 379.20, TRUE, 4.7, 87);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (70, 'Grey', '43', 'LOA-070-GRE-43', 'https://placehold.co/400x400?text=Grey+43', 21)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (70, 'Pastel Pink', '40', 'LOA-070-PAS-40', 'https://placehold.co/400x400?text=Pastel Pink+40', 73)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (70, 'Beige', '38', 'LOA-070-BEI-38', 'https://placehold.co/400x400?text=Beige+38', 2)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (71, 'Oversized Chiffon Tank Top', 'oversized-chiffon-tank-top-71', 'Elevate your style with the Oversized Chiffon Tank Top. Crafted from chiffon, this item offers a oversized look suitable for any occasion.', 'https://placehold.co/600x400?text=tank-top', 338.00, 338.00, TRUE, 3.9, 99);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (71, 'White', 'XS', 'TAN-071-WHI-XS', 'https://placehold.co/400x400?text=White+XS', 30)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (71, 'Beige', 'M', 'TAN-071-BEI-M', 'https://placehold.co/400x400?text=Beige+M', 73)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (72, 'Elegant Silk Satin Cocktail Dress', 'elegant-silk-satin-cocktail-dress-72', 'Best-seller of the collection: Elegant Silk Satin Cocktail Dress. Designed for those who love elegant aesthetics. Material: silk satin.', 'https://placehold.co/600x400?text=cocktail-dress', 431.00, 431.00, TRUE, 4.1, 64);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (72, 'Pastel Pink', 'XL', 'COC-072-PAS-XL', 'https://placehold.co/400x400?text=Pastel Pink+XL', 23)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (72, 'Navy Blue', 'XL', 'COC-072-NAV-XL', 'https://placehold.co/400x400?text=Navy Blue+XL', 71)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (73, 'Bohemian Velvet Floral Sundress', 'bohemian-velvet-floral-sundress-73', 'Get ready for the season with this Bohemian Velvet Floral Sundress. Made of breathable velvet, giving you a truly bohemian vibe.', 'https://placehold.co/600x400?text=floral-sundress', 342.00, 342.00, TRUE, 4.9, 8);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (73, 'Grey', 'M', 'FLO-073-GRE-M', 'https://placehold.co/400x400?text=Grey+M', 5)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (73, 'Beige', 'XS', 'FLO-073-BEI-XS', 'https://placehold.co/400x400?text=Beige+XS', 32)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (73, 'Burgundy', 'L', 'FLO-073-BUR-L', 'https://placehold.co/400x400?text=Burgundy+L', 81)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (74, 'Modern Linen Tank Top', 'modern-linen-tank-top-74', 'Best-seller of the collection: Modern Linen Tank Top. Designed for those who love modern aesthetics. Material: linen.', 'https://placehold.co/600x400?text=tank-top', 278.00, 278.00, TRUE, 4.1, 68);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (74, 'White', 'S', 'TAN-074-WHI-S', 'https://placehold.co/400x400?text=White+S', 30)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (74, 'Pastel Pink', 'XXL', 'TAN-074-PAS-XXL', 'https://placehold.co/400x400?text=Pastel Pink+XXL', 67)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (74, 'Grey', 'S', 'TAN-074-GRE-S', 'https://placehold.co/400x400?text=Grey+S', 48)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (75, 'Bohemian Velvet Crossbody Bag', 'bohemian-velvet-crossbody-bag-75', 'Elevate your style with the Bohemian Velvet Crossbody Bag. Crafted from velvet, this item offers a bohemian look suitable for any occasion.', 'https://placehold.co/600x400?text=crossbody-bag', 162.00, 162.00, TRUE, 3.9, 54);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (75, 'Grey', 'One Size', 'CRO-075-GRE-One Size', 'https://placehold.co/400x400?text=Grey+One Size', 11)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (75, 'Pastel Pink', 'One Size', 'CRO-075-PAS-One Size', 'https://placehold.co/400x400?text=Pastel Pink+One Size', 26)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (75, 'White', 'One Size', 'CRO-075-WHI-One Size', 'https://placehold.co/400x400?text=White+One Size', 60)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (75, 'Navy Blue', 'One Size', 'CRO-075-NAV-One Size', 'https://placehold.co/400x400?text=Navy Blue+One Size', 28)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (76, 'Cozy Silk Satin Sandals', 'cozy-silk-satin-sandals-76', 'The Cozy Silk Satin Sandals is a must-have for your wardrobe. Features a cozy design and high-quality silk satin for maximum comfort.', 'https://placehold.co/600x400?text=sandals', 290.00, 290.00, TRUE, 4.2, 56);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (76, 'Grey', '39', 'SAN-076-GRE-39', 'https://placehold.co/400x400?text=Grey+39', 50)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (76, 'Burgundy', '39', 'SAN-076-BUR-39', 'https://placehold.co/400x400?text=Burgundy+39', 0)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (76, 'Black', '44', 'SAN-076-BLA-44', 'https://placehold.co/400x400?text=Black+44', 5)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (76, 'Pastel Pink', '42', 'SAN-076-PAS-42', 'https://placehold.co/400x400?text=Pastel Pink+42', 12)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (77, 'Urban Canvas Loafers', 'urban-canvas-loafers-77', 'Elevate your style with the Urban Canvas Loafers. Crafted from canvas, this item offers a urban look suitable for any occasion.', 'https://placehold.co/600x400?text=loafers', 291.00, 232.80, TRUE, 4.4, 22);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (77, 'Navy Blue', '38', 'LOA-077-NAV-38', 'https://placehold.co/400x400?text=Navy Blue+38', 67)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (77, 'Olive Green', '42', 'LOA-077-OLI-42', 'https://placehold.co/400x400?text=Olive Green+42', 62)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (77, 'Pastel Pink', '40', 'LOA-077-PAS-40', 'https://placehold.co/400x400?text=Pastel Pink+40', 52)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (78, 'Cozy Chiffon Knitted Sweater', 'cozy-chiffon-knitted-sweater-78', 'Best-seller of the collection: Cozy Chiffon Knitted Sweater. Designed for those who love cozy aesthetics. Material: chiffon.', 'https://placehold.co/600x400?text=knitted-sweater', 407.00, 407.00, TRUE, 3.7, 37);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (78, 'Charcoal', 'XL', 'KNI-078-CHA-XL', 'https://placehold.co/400x400?text=Charcoal+XL', 94)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (78, 'Grey', 'XL', 'KNI-078-GRE-XL', 'https://placehold.co/400x400?text=Grey+XL', 91)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (79, 'Breathable Denim Floral Sundress', 'breathable-denim-floral-sundress-79', 'Discover the perfect blend of fashion and function with our Breathable Denim Floral Sundress. breathable style meets durable denim.', 'https://placehold.co/600x400?text=floral-sundress', 412.00, 412.00, TRUE, 4.7, 30);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (79, 'Olive Green', 'XXL', 'FLO-079-OLI-XXL', 'https://placehold.co/400x400?text=Olive Green+XXL', 72)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (79, 'Charcoal', 'XS', 'FLO-079-CHA-XS', 'https://placehold.co/400x400?text=Charcoal+XS', 3)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (79, 'White', 'XS', 'FLO-079-WHI-XS', 'https://placehold.co/400x400?text=White+XS', 10)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (80, 'Retro Corduroy Knitted Sweater', 'retro-corduroy-knitted-sweater-80', 'Best-seller of the collection: Retro Corduroy Knitted Sweater. Designed for those who love retro aesthetics. Material: corduroy.', 'https://placehold.co/600x400?text=knitted-sweater', 329.00, 329.00, TRUE, 4.6, 75);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (80, 'Burgundy', 'L', 'KNI-080-BUR-L', 'https://placehold.co/400x400?text=Burgundy+L', 62)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (80, 'White', 'M', 'KNI-080-WHI-M', 'https://placehold.co/400x400?text=White+M', 6)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (80, 'Pastel Pink', 'L', 'KNI-080-PAS-L', 'https://placehold.co/400x400?text=Pastel Pink+L', 11)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (81, 'Athletic Denim Pleated Skirt', 'athletic-denim-pleated-skirt-81', 'Discover the perfect blend of fashion and function with our Athletic Denim Pleated Skirt. athletic style meets durable denim.', 'https://placehold.co/600x400?text=pleated-skirt', 79.00, 79.00, TRUE, 4.5, 40);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (81, 'Navy Blue', 'XXL', 'PLE-081-NAV-XXL', 'https://placehold.co/400x400?text=Navy Blue+XXL', 11)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (81, 'Pastel Pink', 'S', 'PLE-081-PAS-S', 'https://placehold.co/400x400?text=Pastel Pink+S', 73)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (81, 'White', 'XS', 'PLE-081-WHI-XS', 'https://placehold.co/400x400?text=White+XS', 22)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (82, 'Premium Polyester Evening Gown', 'premium-polyester-evening-gown-82', 'Discover the perfect blend of fashion and function with our Premium Polyester Evening Gown. premium style meets durable polyester.', 'https://placehold.co/600x400?text=evening-gown', 203.00, 162.40, TRUE, 3.8, 18);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (82, 'Charcoal', 'S', 'EVE-082-CHA-S', 'https://placehold.co/400x400?text=Charcoal+S', 99)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (82, 'Pastel Pink', 'S', 'EVE-082-PAS-S', 'https://placehold.co/400x400?text=Pastel Pink+S', 22)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (82, 'White', 'XS', 'EVE-082-WHI-XS', 'https://placehold.co/400x400?text=White+XS', 79)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (83, 'Elegant Silk Satin Evening Gown', 'elegant-silk-satin-evening-gown-83', 'Discover the perfect blend of fashion and function with our Elegant Silk Satin Evening Gown. elegant style meets durable silk satin.', 'https://placehold.co/600x400?text=evening-gown', 122.00, 97.60, TRUE, 4.7, 90);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (83, 'Olive Green', 'XXL', 'EVE-083-OLI-XXL', 'https://placehold.co/400x400?text=Olive Green+XXL', 76)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (83, 'Beige', 'S', 'EVE-083-BEI-S', 'https://placehold.co/400x400?text=Beige+S', 4)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (84, 'Classic Velvet Tote Bag', 'classic-velvet-tote-bag-84', 'Get ready for the season with this Classic Velvet Tote Bag. Made of breathable velvet, giving you a truly classic vibe.', 'https://placehold.co/600x400?text=tote-bag', 77.00, 61.60, TRUE, 3.8, 0);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (84, 'Beige', 'One Size', 'TOT-084-BEI-One Size', 'https://placehold.co/400x400?text=Beige+One Size', 40)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (84, 'Pastel Pink', 'One Size', 'TOT-084-PAS-One Size', 'https://placehold.co/400x400?text=Pastel Pink+One Size', 28)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (84, 'Olive Green', 'One Size', 'TOT-084-OLI-One Size', 'https://placehold.co/400x400?text=Olive Green+One Size', 15)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (85, 'Cozy Linen Cardigan', 'cozy-linen-cardigan-85', 'Get ready for the season with this Cozy Linen Cardigan. Made of breathable linen, giving you a truly cozy vibe.', 'https://placehold.co/600x400?text=cardigan', 388.00, 310.40, TRUE, 3.6, 12);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (85, 'Navy Blue', 'XXL', 'CAR-085-NAV-XXL', 'https://placehold.co/400x400?text=Navy Blue+XXL', 56)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (85, 'Charcoal', 'L', 'CAR-085-CHA-L', 'https://placehold.co/400x400?text=Charcoal+L', 4)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (86, 'Vintage Corduroy Knitted Sweater', 'vintage-corduroy-knitted-sweater-86', 'The Vintage Corduroy Knitted Sweater is a must-have for your wardrobe. Features a vintage design and high-quality corduroy for maximum comfort.', 'https://placehold.co/600x400?text=knitted-sweater', 456.00, 456.00, TRUE, 4.8, 52);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (86, 'Navy Blue', 'XL', 'KNI-086-NAV-XL', 'https://placehold.co/400x400?text=Navy Blue+XL', 85)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (86, 'White', 'XL', 'KNI-086-WHI-XL', 'https://placehold.co/400x400?text=White+XL', 93)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (86, 'Olive Green', 'XL', 'KNI-086-OLI-XL', 'https://placehold.co/400x400?text=Olive Green+XL', 58)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (86, 'Burgundy', 'XL', 'KNI-086-BUR-XL', 'https://placehold.co/400x400?text=Burgundy+XL', 73)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (87, 'Bohemian Linen Polo Shirt', 'bohemian-linen-polo-shirt-87', 'Best-seller of the collection: Bohemian Linen Polo Shirt. Designed for those who love bohemian aesthetics. Material: linen.', 'https://placehold.co/600x400?text=polo-shirt', 346.00, 276.80, TRUE, 4.7, 23);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (87, 'Pastel Pink', 'XL', 'POL-087-PAS-XL', 'https://placehold.co/400x400?text=Pastel Pink+XL', 56)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (87, 'Navy Blue', 'XL', 'POL-087-NAV-XL', 'https://placehold.co/400x400?text=Navy Blue+XL', 28)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (87, 'Black', 'XS', 'POL-087-BLA-XS', 'https://placehold.co/400x400?text=Black+XS', 24)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (87, 'White', 'XS', 'POL-087-WHI-XS', 'https://placehold.co/400x400?text=White+XS', 23)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (88, 'Slim-Fit Genuine Leather Evening Gown', 'slim-fit-genuine-leather-evening-gown-88', 'Elevate your style with the Slim-Fit Genuine Leather Evening Gown. Crafted from genuine leather, this item offers a slim-fit look suitable for any occasion.', 'https://placehold.co/600x400?text=evening-gown', 182.00, 182.00, TRUE, 4.4, 3);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (88, 'Grey', 'XL', 'EVE-088-GRE-XL', 'https://placehold.co/400x400?text=Grey+XL', 45)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (88, 'Black', 'XS', 'EVE-088-BLA-XS', 'https://placehold.co/400x400?text=Black+XS', 54)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (88, 'Pastel Pink', 'M', 'EVE-088-PAS-M', 'https://placehold.co/400x400?text=Pastel Pink+M', 15)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (89, 'Classic Chiffon Crop Top', 'classic-chiffon-crop-top-89', 'Get ready for the season with this Classic Chiffon Crop Top. Made of breathable chiffon, giving you a truly classic vibe.', 'https://placehold.co/600x400?text=crop-top', 60.00, 48.00, TRUE, 3.5, 62);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (89, 'Olive Green', 'XS', 'CRO-089-OLI-XS', 'https://placehold.co/400x400?text=Olive Green+XS', 23)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (89, 'Grey', 'L', 'CRO-089-GRE-L', 'https://placehold.co/400x400?text=Grey+L', 2)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (89, 'Beige', 'S', 'CRO-089-BEI-S', 'https://placehold.co/400x400?text=Beige+S', 6)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (90, 'Breathable Canvas Polo Shirt', 'breathable-canvas-polo-shirt-90', 'Get ready for the season with this Breathable Canvas Polo Shirt. Made of breathable canvas, giving you a truly breathable vibe.', 'https://placehold.co/600x400?text=polo-shirt', 208.00, 208.00, TRUE, 3.8, 75);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (90, 'Grey', 'L', 'POL-090-GRE-L', 'https://placehold.co/400x400?text=Grey+L', 64)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (90, 'Beige', 'XXL', 'POL-090-BEI-XXL', 'https://placehold.co/400x400?text=Beige+XXL', 85)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (91, 'Breathable Wool Blend Joggers', 'breathable-wool-blend-joggers-91', 'Elevate your style with the Breathable Wool Blend Joggers. Crafted from wool blend, this item offers a breathable look suitable for any occasion.', 'https://placehold.co/600x400?text=joggers', 399.00, 399.00, TRUE, 4.9, 68);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (91, 'Burgundy', 'M', 'JOG-091-BUR-M', 'https://placehold.co/400x400?text=Burgundy+M', 23)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (91, 'Navy Blue', 'S', 'JOG-091-NAV-S', 'https://placehold.co/400x400?text=Navy Blue+S', 4)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (92, 'Slim-Fit Polyester Chinos', 'slim-fit-polyester-chinos-92', 'Get ready for the season with this Slim-Fit Polyester Chinos. Made of breathable polyester, giving you a truly slim-fit vibe.', 'https://placehold.co/600x400?text=chinos', 321.00, 321.00, TRUE, 3.5, 89);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (92, 'Burgundy', 'S', 'CHI-092-BUR-S', 'https://placehold.co/400x400?text=Burgundy+S', 51)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (92, 'White', 'XXL', 'CHI-092-WHI-XXL', 'https://placehold.co/400x400?text=White+XXL', 72)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (92, 'Navy Blue', 'XS', 'CHI-092-NAV-XS', 'https://placehold.co/400x400?text=Navy Blue+XS', 22)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (93, 'Luxury Chiffon Cargo Shorts', 'luxury-chiffon-cargo-shorts-93', 'Discover the perfect blend of fashion and function with our Luxury Chiffon Cargo Shorts. luxury style meets durable chiffon.', 'https://placehold.co/600x400?text=cargo-shorts', 131.00, 131.00, TRUE, 4.2, 16);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (93, 'Charcoal', 'XS', 'CAR-093-CHA-XS', 'https://placehold.co/400x400?text=Charcoal+XS', 79)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (93, 'Pastel Pink', 'XS', 'CAR-093-PAS-XS', 'https://placehold.co/400x400?text=Pastel Pink+XS', 48)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (93, 'Grey', 'XL', 'CAR-093-GRE-XL', 'https://placehold.co/400x400?text=Grey+XL', 60)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (93, 'Burgundy', 'XL', 'CAR-093-BUR-XL', 'https://placehold.co/400x400?text=Burgundy+XL', 81)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (94, 'Classic Silk Satin Pleated Skirt', 'classic-silk-satin-pleated-skirt-94', 'Get ready for the season with this Classic Silk Satin Pleated Skirt. Made of breathable silk satin, giving you a truly classic vibe.', 'https://placehold.co/600x400?text=pleated-skirt', 313.00, 250.40, TRUE, 4.2, 95);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (94, 'Burgundy', 'XXL', 'PLE-094-BUR-XXL', 'https://placehold.co/400x400?text=Burgundy+XXL', 14)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (94, 'White', 'XS', 'PLE-094-WHI-XS', 'https://placehold.co/400x400?text=White+XS', 8)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (95, 'Urban Chiffon High Heels', 'urban-chiffon-high-heels-95', 'The Urban Chiffon High Heels is a must-have for your wardrobe. Features a urban design and high-quality chiffon for maximum comfort.', 'https://placehold.co/600x400?text=high-heels', 64.00, 64.00, TRUE, 4.1, 94);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (95, 'Beige', '43', 'HIG-095-BEI-43', 'https://placehold.co/400x400?text=Beige+43', 36)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (95, 'Navy Blue', '42', 'HIG-095-NAV-42', 'https://placehold.co/400x400?text=Navy Blue+42', 13)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (95, 'Burgundy', '38', 'HIG-095-BUR-38', 'https://placehold.co/400x400?text=Burgundy+38', 41)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (96, 'Modern Silk Satin Crossbody Bag', 'modern-silk-satin-crossbody-bag-96', 'Elevate your style with the Modern Silk Satin Crossbody Bag. Crafted from silk satin, this item offers a modern look suitable for any occasion.', 'https://placehold.co/600x400?text=crossbody-bag', 365.00, 365.00, TRUE, 4.2, 93);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (96, 'Beige', 'One Size', 'CRO-096-BEI-One Size', 'https://placehold.co/400x400?text=Beige+One Size', 75)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (96, 'White', 'One Size', 'CRO-096-WHI-One Size', 'https://placehold.co/400x400?text=White+One Size', 16)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (97, 'Luxury Polyester Cardigan', 'luxury-polyester-cardigan-97', 'Elevate your style with the Luxury Polyester Cardigan. Crafted from polyester, this item offers a luxury look suitable for any occasion.', 'https://placehold.co/600x400?text=cardigan', 496.00, 496.00, TRUE, 3.9, 90);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (97, 'White', 'L', 'CAR-097-WHI-L', 'https://placehold.co/400x400?text=White+L', 20)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (97, 'Grey', 'XXL', 'CAR-097-GRE-XXL', 'https://placehold.co/400x400?text=Grey+XXL', 66)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (97, 'Olive Green', 'XS', 'CAR-097-OLI-XS', 'https://placehold.co/400x400?text=Olive Green+XS', 24)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (98, 'Vintage Polyester Chinos', 'vintage-polyester-chinos-98', 'The Vintage Polyester Chinos is a must-have for your wardrobe. Features a vintage design and high-quality polyester for maximum comfort.', 'https://placehold.co/600x400?text=chinos', 274.00, 219.20, TRUE, 4.5, 96);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (98, 'White', 'XL', 'CHI-098-WHI-XL', 'https://placehold.co/400x400?text=White+XL', 6)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (98, 'Burgundy', 'XL', 'CHI-098-BUR-XL', 'https://placehold.co/400x400?text=Burgundy+XL', 9)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (98, 'Black', 'XL', 'CHI-098-BLA-XL', 'https://placehold.co/400x400?text=Black+XL', 95)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (98, 'Charcoal', 'XL', 'CHI-098-CHA-XL', 'https://placehold.co/400x400?text=Charcoal+XL', 71)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (99, 'Urban Denim Floral Sundress', 'urban-denim-floral-sundress-99', 'Best-seller of the collection: Urban Denim Floral Sundress. Designed for those who love urban aesthetics. Material: denim.', 'https://placehold.co/600x400?text=floral-sundress', 226.00, 226.00, TRUE, 3.7, 42);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (99, 'Charcoal', 'XS', 'FLO-099-CHA-XS', 'https://placehold.co/400x400?text=Charcoal+XS', 55)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (99, 'Pastel Pink', 'XXL', 'FLO-099-PAS-XXL', 'https://placehold.co/400x400?text=Pastel Pink+XXL', 50)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO Product (id, name, slug, description, thumbnail, original_price, price, is_active, rating, review_count) 
    VALUES (100, 'Slim-Fit Canvas Running Shoes', 'slim-fit-canvas-running-shoes-100', 'Get ready for the season with this Slim-Fit Canvas Running Shoes. Made of breathable canvas, giving you a truly slim-fit vibe.', 'https://placehold.co/600x400?text=running-shoes', 228.00, 228.00, TRUE, 4.0, 96);
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (100, 'White', '41', 'RUN-100-WHI-41', 'https://placehold.co/400x400?text=White+41', 2)
        ON CONFLICT (product_id, color, size) DO NOTHING;
INSERT INTO ProductVariant (product_id, color, size, sku, image, stock)
        VALUES (100, 'Charcoal', '39', 'RUN-100-CHA-39', 'https://placehold.co/400x400?text=Charcoal+39', 44)
        ON CONFLICT (product_id, color, size) DO NOTHING;
SELECT setval('Product_id_seq', 100, true);

-- 3. PRODUCT Category RELATIONS
INSERT INTO product_Category (product_id, category_id) VALUES (1, 6), (1, 2), (2, 9), (2, 3), (3, 9), (3, 3), (4, 6), (4, 2), (5, 4), (5, 1), (6, 6), (6, 2), (7, 5), (7, 1), (8, 4), (8, 1), (9, 6), (9, 2), (10, 9), (10, 3), (11, 7), (11, 2), (12, 5), (12, 1), (13, 8), (13, 3), (14, 4), (14, 1), (15, 7), (15, 2), (16, 8), (16, 3), (17, 5), (17, 1), (18, 7), (18, 2), (19, 5), (19, 1), (20, 6), (20, 2), (21, 4), (21, 1), (22, 9), (22, 3), (23, 4), (23, 1), (24, 8), (24, 3), (25, 7), (25, 2), (26, 4), (26, 1), (27, 9), (27, 3), (28, 6), (28, 2), (29, 8), (29, 3), (30, 6), (30, 2), (31, 6), (31, 2), (32, 5), (32, 1), (33, 6), (33, 2), (34, 8), (34, 3), (35, 9), (35, 3), (36, 5), (36, 1), (37, 9), (37, 3), (38, 6), (38, 2), (39, 9), (39, 3), (40, 5), (40, 1), (41, 6), (41, 2), (42, 7), (42, 2), (43, 6), (43, 2), (44, 9), (44, 3), (45, 9), (45, 3), (46, 4), (46, 1), (47, 5), (47, 1), (48, 6), (48, 2), (49, 7), (49, 2), (50, 7), (50, 2), (51, 9), (51, 3), (52, 5), (52, 1), (53, 4), (53, 1), (54, 6), (54, 2), (55, 5), (55, 1), (56, 4), (56, 1), (57, 8), (57, 3), (58, 5), (58, 1), (59, 5), (59, 1), (60, 5), (60, 1), (61, 9), (61, 3), (62, 9), (62, 3), (63, 7), (63, 2), (64, 7), (64, 2), (65, 7), (65, 2), (66, 4), (66, 1), (67, 6), (67, 2), (68, 8), (68, 3), (69, 8), (69, 3), (70, 9), (70, 3), (71, 7), (71, 2), (72, 6), (72, 2), (73, 6), (73, 2), (74, 7), (74, 2), (75, 8), (75, 3), (76, 9), (76, 3), (77, 9), (77, 3), (78, 7), (78, 2), (79, 6), (79, 2), (80, 7), (80, 2), (81, 6), (81, 2), (82, 6), (82, 2), (83, 6), (83, 2), (84, 8), (84, 3), (85, 7), (85, 2), (86, 7), (86, 2), (87, 4), (87, 1), (88, 6), (88, 2), (89, 7), (89, 2), (90, 4), (90, 1), (91, 5), (91, 1), (92, 5), (92, 1), (93, 5), (93, 1), (94, 6), (94, 2), (95, 9), (95, 3), (96, 8), (96, 3), (97, 7), (97, 2), (98, 5), (98, 1), (99, 6), (99, 2), (100, 9), (100, 3) ON CONFLICT DO NOTHING;

-- 4. DUMMY USERS
INSERT INTO users (email, password, name, role) VALUES ('admin@example.com', 'hashed_password_123', 'Admin User', 'ADMIN') ON CONFLICT DO NOTHING;
INSERT INTO users (email, password, name, role) VALUES ('john.doe@example.com', 'hashed_password_123', 'John Doe', 'CUSTOMER') ON CONFLICT DO NOTHING;
INSERT INTO users (email, password, name, role) VALUES ('alice.smith@example.com', 'hashed_password_123', 'Alice Smith', 'CUSTOMER') ON CONFLICT DO NOTHING;
COMMIT;
