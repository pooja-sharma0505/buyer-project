-- MySQL dump 10.13  Distrib 9.7.1, for macos26.4 (arm64)
--
-- Host: gateway01.ap-southeast-1.prod.aws.tidbcloud.com    Database: demostore
-- ------------------------------------------------------
-- Server version	8.0.11-TiDB-v8.5.3-serverless

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL DEFAULT '0',
  `product_id` int DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `unique_cart_item` (`user_id`,`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=300006;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,0,15,1,'2026-04-02 11:02:03'),(2,0,16,1,'2026-04-02 13:20:22'),(3,0,10,1,'2026-04-03 05:59:01'),(4,0,22,1,'2026-04-20 15:06:43'),(90006,30002,30,2,'2026-09-08 04:11:32'),(90007,30002,31,2,'2026-09-08 04:11:32'),(90008,30002,60078,2,'2026-09-08 04:11:32'),(120141,30002,90054,2,'2026-09-08 04:38:10'),(120996,1,1,1,'2026-09-08 05:07:21'),(121002,1,2,1,'2026-09-08 05:12:29'),(150117,30002,90053,2,'2026-09-08 05:38:35'),(150245,30002,90052,1,'2026-09-08 05:38:38'),(210194,30002,90055,1,'2026-09-09 04:33:35'),(240277,30002,90046,2,'2026-09-09 05:24:52');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `qty` int NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,'Apple iPhone 16',79999.00,1);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Processing',
  `full_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zip` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,79999.00,14399.82,94398.82,'Processing',NULL,NULL,NULL,NULL,NULL,'2026-09-07 16:59:54');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=120001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Apple iPhone 16',79999.00,84999.00,'https://images.unsplash.com/photo-1668003378110-409e437b3332?auto=format&fit=crop&w=800&q=80','Latest Apple iPhone','2026-08-06 12:47:20','Mobiles'),(2,'Samsung Galaxy S25',74999.00,79999.00,'https://images.pexels.com/photos/22604142/pexels-photo-22604142.jpeg?cs=srgb&dl=pexels-zeleboba-22604142.jpg&fm=jpg','Samsung flagship phone','2026-08-06 12:47:20','Mobiles'),(5,'OnePlus 13',59999.00,64999.00,'https://images.pexels.com/photos/22604142/pexels-photo-22604142.jpeg?cs=srgb&dl=pexels-zeleboba-22604142.jpg&fm=jpg','OnePlus flagship phone','2026-08-06 12:48:04','Mobiles'),(6,'HP Pavilion Laptop',65999.00,72999.00,'https://images.pexels.com/photos/131778/pexels-photo-131778.jpeg?cs=srgb&dl=pexels-markusspiske-131778.jpg&fm=jpg','15.6-inch laptop','2026-08-06 12:48:04','Laptops'),(7,'Dell Inspiron 15',58999.00,63999.00,'https://images.pexels.com/photos/131778/pexels-photo-131778.jpeg?cs=srgb&dl=pexels-markusspiske-131778.jpg&fm=jpg','Dell Inspiron Laptop','2026-08-06 12:48:04','Laptops'),(8,'MacBook Air M4',109999.00,114999.00,'https://images.pexels.com/photos/131778/pexels-photo-131778.jpeg?cs=srgb&dl=pexels-markusspiske-131778.jpg&fm=jpg','Apple MacBook Air','2026-08-06 12:48:04','Laptops'),(9,'Men Casual Shirt',999.00,1499.00,'https://images.pexels.com/photos/8442859/pexels-photo-8442859.jpeg?cs=srgb&dl=pexels-kaustubh-dixit-3320450-8442859.jpg&fm=jpg','Cotton casual shirt','2026-08-06 12:48:04','Fashion'),(10,'Men Denim Jeans',1799.00,2299.00,'https://images.pexels.com/photos/8442859/pexels-photo-8442859.jpeg?cs=srgb&dl=pexels-kaustubh-dixit-3320450-8442859.jpg&fm=jpg','Blue denim jeans','2026-08-06 12:48:04','Fashion'),(11,'Women Kurti',1299.00,1799.00,'https://images.pexels.com/photos/35521738/pexels-photo-35521738.jpeg?cs=srgb&dl=pexels-kunal-yadav-photography-2158088461-35521738.jpg&fm=jpg','Printed cotton kurti','2026-08-06 12:48:04','Fashion'),(12,'Women Saree',2499.00,2999.00,'https://images.pexels.com/photos/35521738/pexels-photo-35521738.jpeg?cs=srgb&dl=pexels-kunal-yadav-photography-2158088461-35521738.jpg&fm=jpg','Designer silk saree','2026-08-06 12:48:04','Fashion'),(13,'Nike Running Shoes',3999.00,4999.00,'https://images.pexels.com/photos/13525579/pexels-photo-13525579.jpeg?cs=srgb&dl=pexels-arturoaez225-13525579.jpg&fm=jpg','Running shoes','2026-08-06 12:48:04','Footwear'),(14,'Adidas Sneakers',4599.00,5599.00,'https://images.pexels.com/photos/13525579/pexels-photo-13525579.jpeg?cs=srgb&dl=pexels-arturoaez225-13525579.jpg&fm=jpg','Casual sneakers','2026-08-06 12:48:04','Footwear'),(15,'Sony WH-1000XM5',29999.00,34999.00,'https://images.pexels.com/photos/16303233/pexels-photo-16303233.jpeg?cs=srgb&dl=pexels-sogi-495844134-16303233.jpg&fm=jpg','Wireless headphones','2026-08-06 12:48:04','Electronics'),(16,'Apple Watch Series 10',45999.00,49999.00,'https://images.pexels.com/photos/8032783/pexels-photo-8032783.jpeg?cs=srgb&dl=pexels-mart-production-8032783.jpg&fm=jpg','Apple smartwatch','2026-08-06 12:48:04','Electronics'),(17,'JBL Bluetooth Speaker',5999.00,6999.00,'https://images.pexels.com/photos/16303233/pexels-photo-16303233.jpeg?cs=srgb&dl=pexels-sogi-495844134-16303233.jpg&fm=jpg','Portable speaker','2026-08-06 12:48:04','Electronics'),(18,'Wooden Office Chair',6999.00,8499.00,'https://images.pexels.com/photos/12725827/pexels-photo-12725827.jpeg?cs=srgb&dl=pexels-andreaedavis-12725827.jpg&fm=jpg','Comfort office chair','2026-08-06 12:48:04','Furniture'),(19,'Study Table',5499.00,6499.00,'https://images.pexels.com/photos/12725827/pexels-photo-12725827.jpeg?cs=srgb&dl=pexels-andreaedavis-12725827.jpg&fm=jpg','Wooden study table','2026-08-06 12:48:04','Furniture'),(20,'Modern Sofa',25999.00,29999.00,'https://images.pexels.com/photos/6970053/pexels-photo-6970053.jpeg?cs=srgb&dl=pexels-artbovich-6970053.jpg&fm=jpg','3-seater sofa','2026-08-06 12:48:04','Furniture'),(21,'Nivea Face Wash',299.00,399.00,'https://images.pexels.com/photos/7667664/pexels-photo-7667664.jpeg?cs=srgb&dl=pexels-didsss-7667664.jpg&fm=jpg','Daily face wash','2026-08-06 12:48:04','Beauty'),(22,'Lakme Lipstick',599.00,799.00,'https://images.pexels.com/photos/7667664/pexels-photo-7667664.jpeg?cs=srgb&dl=pexels-didsss-7667664.jpg&fm=jpg','Matte lipstick','2026-08-06 12:48:04','Beauty'),(23,'Body Lotion',499.00,699.00,'https://images.pexels.com/photos/7667664/pexels-photo-7667664.jpeg?cs=srgb&dl=pexels-didsss-7667664.jpg&fm=jpg','Moisturizing lotion','2026-08-06 12:48:04','Beauty'),(27,'Cricket Bat',2499.00,2999.00,'https://images.pexels.com/photos/35825597/pexels-photo-35825597.jpeg?cs=srgb&dl=pexels-mir-burhan-859107805-35825597.jpg&fm=jpg','English willow bat','2026-08-06 12:48:04','Sports'),(28,'Football',999.00,1299.00,'https://images.pexels.com/photos/3148452/pexels-photo-3148452.jpeg?cs=srgb&dl=pexels-expressivestanley-3148452.jpg&fm=jpg','Professional football','2026-08-06 12:48:04','Sports'),(29,'Yoga Mat',899.00,1199.00,'https://images.pexels.com/photos/6643393/pexels-photo-6643393.jpeg?cs=srgb&dl=pexels-a-darmel-6643393.jpg&fm=jpg','Non-slip yoga mat','2026-08-06 12:48:04','Sports'),(30,'Toy Car',599.00,799.00,'https://images.pexels.com/photos/4047581/pexels-photo-4047581.jpeg?cs=srgb&dl=pexels-rosesun-studio-1836141-4047581.jpg&fm=jpg','Remote control toy car','2026-08-06 12:48:04','Toys'),(31,'Teddy Bear',899.00,1199.00,'https://images.pexels.com/photos/10003868/pexels-photo-10003868.jpeg?cs=srgb&dl=pexels-laarkstudio-10003868.jpg&fm=jpg','Soft teddy bear','2026-08-06 12:48:04','Toys'),(32,'Building Blocks',1499.00,1799.00,'https://images.pexels.com/photos/7123080/pexels-photo-7123080.jpeg?cs=srgb&dl=pexels-tara-winstead-7123080.jpg&fm=jpg','Educational building blocks','2026-08-06 12:48:04','Toys'),(34,'Ergonomic Office Chair',6999.00,8499.00,'https://images.pexels.com/photos/12725827/pexels-photo-12725827.jpeg?cs=srgb&dl=pexels-andreaedavis-12725827.jpg&fm=jpg','Mesh ergonomic office chair','2026-08-06 12:50:18','Furniture'),(35,'Women Cotton Kurti',999.00,1499.00,'https://images.pexels.com/photos/35521738/pexels-photo-35521738.jpeg?cs=srgb&dl=pexels-kunal-yadav-photography-2158088461-35521738.jpg&fm=jpg','Blue cotton kurti','2026-08-06 12:50:18','Women Fashion'),(42,'HP Pavilion 15',65999.00,71999.00,'https://images.pexels.com/photos/131778/pexels-photo-131778.jpeg?cs=srgb&dl=pexels-markusspiske-131778.jpg&fm=jpg','HP Pavilion Laptop','2026-08-06 12:55:00','Laptops'),(43,'Men Cotton Shirt',999.00,1499.00,'https://images.pexels.com/photos/8442859/pexels-photo-8442859.jpeg?cs=srgb&dl=pexels-kaustubh-dixit-3320450-8442859.jpg&fm=jpg','Premium Cotton Shirt','2026-08-06 12:55:00','Fashion'),(44,'Women Printed Kurti',1299.00,1699.00,'https://images.pexels.com/photos/35521738/pexels-photo-35521738.jpeg?cs=srgb&dl=pexels-kunal-yadav-photography-2158088461-35521738.jpg&fm=jpg','Printed Cotton Kurti','2026-08-06 12:55:00','Fashion'),(45,'Nike Air Max',6999.00,7999.00,'https://images.pexels.com/photos/13525579/pexels-photo-13525579.jpeg?cs=srgb&dl=pexels-arturoaez225-13525579.jpg&fm=jpg','Running Shoes','2026-08-06 12:55:00','Footwear'),(46,'Adidas Sneakers',5499.00,6499.00,'https://images.pexels.com/photos/13525579/pexels-photo-13525579.jpeg?cs=srgb&dl=pexels-arturoaez225-13525579.jpg&fm=jpg','Casual Sneakers','2026-08-06 12:55:00','Footwear'),(50,'Wooden Study Table',5499.00,6499.00,'https://images.pexels.com/photos/12725827/pexels-photo-12725827.jpeg?cs=srgb&dl=pexels-andreaedavis-12725827.jpg&fm=jpg','Study Table','2026-08-06 12:55:00','Furniture'),(30001,'Apple iPhone 16',79999.00,84999.00,'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-ultramarine-select-202409?wid=5120&hei=2880&fmt=png-alpha','Apple iPhone 16','2026-09-07 16:45:35','Mobiles'),(30002,'Samsung Galaxy S25',74999.00,79999.00,'https://static.androidworld.nl/orca/products/24596/samsung-galaxy-s25.png','Samsung Galaxy S25','2026-09-07 16:45:35','Mobiles'),(30003,'OnePlus 13',59999.00,64999.00,'https://oasis.opstatics.com/content/dam/oasis/page/2024/global/phones/13/specs/13-blue.png','OnePlus 13','2026-09-07 16:45:35','Mobiles'),(30004,'HP Pavilion 15',65999.00,71999.00,'https://www.hp.com/content/dam/sites/worldwide/laptops-and-2-in-1s/pavilion/HP_Pavilion14Laptop_NaturalSilver_desktop%402x.jpg','HP Pavilion Laptop','2026-09-07 16:45:35','Laptops'),(30005,'MacBook Air M4',109999.00,114999.00,'https://i5.walmartimages.com/asr/bbec431b-dc14-4754-b258-31551ac1799c.4cd5ad02868f18a67cf985c72c476117.jpeg','Apple MacBook Air M4','2026-09-07 16:45:35','Laptops'),(30006,'Men Cotton Shirt',999.00,1499.00,'https://www.punekarcotton.com/cdn/shop/products/copper-color-dobby-cotton-shirt-for-men-564304.jpg?v=1718702493&width=1500','Premium Cotton Shirt','2026-09-07 16:45:35','Fashion'),(30007,'Men Denim Jeans',1799.00,2299.00,'https://lscoglobal.scene7.com/is/image/lscoglobal/MB_04511_GLO_CM_VD?fit=crop%2C1&fmt=jpeg&hei=2667&op_usm=0.6%2C0.6%2C8&qlt=70&resMode=sharp2&wid=2000','Levis Denim Jeans','2026-09-07 16:45:35','Fashion'),(30008,'Nike Air Max',6999.00,7999.00,'https://static.nike.com/a/images/t_PDP_144_v1/f_auto%2Cq_auto%3Aeco%2Cu_9ddf04c7-2a9a-4d76-add1-d15af8f0263d%2Cc_scale%2Cfl_relative%2Cw_1.0%2Ch_1.0%2Cfl_layer_apply/8cf758f3-b3af-4029-85c4-0a01e4fde8eb/NIKE%2BAIR%2BMAX%2B270.png','Nike Air Max Running Shoes','2026-09-07 16:45:35','Footwear'),(30009,'Adidas Sneakers',5499.00,6499.00,'https://assets.adidas.com/images/w_1880%2Cf_auto%2Cq_auto/506681c25cee4ece9a6aaf500104dbb2_9366/HQ8708_02_standard_hover.jpg','Adidas Campus Sneakers','2026-09-07 16:45:35','Footwear'),(30010,'Sony WH-1000XM5',29999.00,32999.00,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=90','Sony Wireless Noise Cancelling Headphones','2026-09-07 16:45:35','Electronics'),(30011,'Apple Watch Series 10',45999.00,49999.00,'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=90','Apple Watch Series 10','2026-09-07 16:45:35','Electronics'),(30012,'JBL Bluetooth Speaker',5999.00,6999.00,'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1000&q=90','JBL Bluetooth Speaker','2026-09-07 16:45:35','Electronics'),(30013,'Wooden Office Chair',6999.00,8499.00,'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1000&q=90','Wooden Office Chair','2026-09-07 16:45:35','Furniture'),(30014,'Study Table',5499.00,6499.00,'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=90','Wooden Study Table','2026-09-07 16:45:35','Furniture'),(30015,'Modern Sofa',25999.00,29999.00,'https://www.richfurniture.net/uploads/202312580/home-furniture-fabric-metal-legs-sofa-couchb9407519-4f5b-463c-9adf-8b66fb061594.jpg','Modern Three Seater Sofa','2026-09-07 16:45:35','Furniture'),(30016,'Nivea Face Wash',299.00,399.00,'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1000&q=90','Nivea Face Wash','2026-09-07 16:45:35','Beauty'),(30017,'Lakme Lipstick',599.00,799.00,'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=90','Lakme Matte Lipstick','2026-09-07 16:45:35','Beauty'),(30018,'Body Lotion',499.00,699.00,'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1000&q=90','Moisturizing Body Lotion','2026-09-07 16:45:35','Beauty'),(30022,'Cricket Bat',2499.00,2999.00,'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=90','English Willow Cricket Bat','2026-09-07 16:45:35','Sports'),(30023,'Football',999.00,1299.00,'https://http2.mlstatic.com/D_NQ_NP_897968-MLC89671241068_082025-O.webp','Professional Football','2026-09-07 16:45:35','Sports'),(30024,'Yoga Mat',899.00,1199.00,'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=90','Non Slip Yoga Mat','2026-09-07 16:45:35','Sports'),(30025,'Toy Car',599.00,799.00,'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1000&q=90','Remote Control Toy Car','2026-09-07 16:45:35','Toys'),(30026,'Teddy Bear',899.00,1199.00,'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=90','Soft Teddy Bear','2026-09-07 16:45:35','Toys'),(30027,'Building Blocks',1499.00,1799.00,'https://m.media-amazon.com/images/I/81D9vyIHXbL._AC_SL3840_.jpg','Classic Building Blocks Set','2026-09-07 16:45:35','Toys'),(60001,'Essence Mascara Lash Princess',899.00,1099.00,'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp','Essence Lash Princess volumizing mascara','2026-09-07 16:48:56','Beauty'),(60002,'Eyeshadow Palette with Mirror',1299.00,1599.00,'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp','Eyeshadow palette with built-in mirror','2026-09-07 16:48:56','Beauty'),(60003,'Powder Canister',799.00,999.00,'https://cdn.dummyjson.com/product-images/beauty/powder-canister/1.webp','Fine setting powder canister','2026-09-07 16:48:56','Beauty'),(60004,'Red Lipstick',599.00,799.00,'https://cdn.dummyjson.com/product-images/beauty/red-lipstick/1.webp','Classic red lipstick','2026-09-07 16:48:56','Beauty'),(60005,'Red Nail Polish',399.00,499.00,'https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/1.webp','Glossy red nail polish','2026-09-07 16:48:56','Beauty'),(60006,'Calvin Klein CK One',3999.00,4599.00,'https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/1.webp','Calvin Klein CK One fragrance','2026-09-07 16:48:56','Beauty'),(60007,'Chanel Coco Noir Eau De',8999.00,9999.00,'https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/1.webp','Chanel Coco Noir fragrance','2026-09-07 16:48:56','Beauty'),(60008,'Dior J adore',7999.00,8999.00,'https://cdn.dummyjson.com/product-images/fragrances/dior-j%27adore/1.webp','Dior J adore fragrance','2026-09-07 16:48:56','Beauty'),(60009,'Dolce Shine Eau de',5999.00,6999.00,'https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/1.webp','Dolce Shine fragrance','2026-09-07 16:48:56','Beauty'),(60010,'Gucci Bloom Eau de',6999.00,7999.00,'https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/1.webp','Gucci Bloom fragrance','2026-09-07 16:48:56','Beauty'),(60011,'Annibale Colombo Bed',159999.00,179999.00,'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/1.webp','Premium wooden bed','2026-09-07 16:48:56','Furniture'),(60012,'Annibale Colombo Sofa',129999.00,149999.00,'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/1.webp','Premium living room sofa','2026-09-07 16:48:56','Furniture'),(60013,'Bedside Table African Cherry',18999.00,22999.00,'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/1.webp','African cherry bedside table','2026-09-07 16:48:56','Furniture'),(60014,'Knoll Saarinen Executive Chair',39999.00,44999.00,'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/1.webp','Executive conference chair','2026-09-07 16:48:56','Furniture'),(60015,'Wooden Bathroom Sink With Mirror',49999.00,59999.00,'https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/1.webp','Wooden bathroom sink with mirror','2026-09-07 16:48:56','Furniture'),(60026,'iPhone 6',19999.00,22999.00,'https://cdn.dummyjson.com/products/images/smartphones/iPhone%206/1.png','Apple iPhone with compact design and reliable performance.','2026-09-07 16:52:53','Mobiles'),(60027,'Samsung Galaxy S10',24999.00,28999.00,'https://cdn.dummyjson.com/products/images/smartphones/Samsung%20Galaxy%20S10/1.png','Samsung Galaxy smartphone with vibrant display and powerful performance.','2026-09-07 16:52:53','Mobiles'),(60028,'Huawei P30',27999.00,31999.00,'https://cdn.dummyjson.com/products/images/smartphones/Huawei%20P30/1.png','Huawei smartphone with advanced camera and premium design.','2026-09-07 16:52:53','Mobiles'),(60029,'Oppo A57',17999.00,20999.00,'https://cdn.dummyjson.com/products/images/smartphones/Oppo%20A57/1.png','Oppo smartphone with stylish design and smooth performance.','2026-09-07 16:52:53','Mobiles'),(60030,'Vivo S1',18999.00,21999.00,'https://cdn.dummyjson.com/products/images/smartphones/Vivo%20S1/1.png','Vivo smartphone designed for everyday performance and photography.','2026-09-07 16:52:53','Mobiles'),(60031,'Apple MacBook Pro 14 Inch Space Grey',129999.00,139999.00,'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.png','Premium Apple laptop for professional work and productivity.','2026-09-07 16:52:53','Laptops'),(60032,'Asus Zenbook Pro Dual Screen Laptop',114999.00,124999.00,'https://cdn.dummyjson.com/products/images/laptops/Asus%20Zenbook%20Pro%20Dual%20Screen%20Laptop/1.png','Premium dual-screen laptop for creative professionals.','2026-09-07 16:52:53','Laptops'),(60033,'Huawei MateBook X Pro',99999.00,109999.00,'https://cdn.dummyjson.com/products/images/laptops/Huawei%20MateBook%20X%20Pro/1.png','Slim premium laptop with high-resolution display.','2026-09-07 16:52:53','Laptops'),(60034,'Lenovo Yoga 920',89999.00,99999.00,'https://cdn.dummyjson.com/products/images/laptops/Lenovo%20Yoga%20920/1.png','Convertible Lenovo laptop for work and entertainment.','2026-09-07 16:52:53','Laptops'),(60035,'Dell XPS 13',109999.00,119999.00,'https://cdn.dummyjson.com/products/images/laptops/Dell%20XPS%2013/1.png','Compact premium laptop with powerful hardware.','2026-09-07 16:52:53','Laptops'),(60036,'Gigabyte Aorus Men Tshirt',1299.00,1799.00,'https://cdn.dummyjson.com/products/images/mens-shirts/Gigabyte%20Aorus%20Men%20Tshirt/1.png','Casual printed t-shirt for men.','2026-09-07 16:52:53','Fashion'),(60037,'Man Plaid Shirt',1599.00,2199.00,'https://cdn.dummyjson.com/products/images/mens-shirts/Man%20Plaid%20Shirt/1.png','Classic plaid casual shirt for men.','2026-09-07 16:52:53','Fashion'),(60038,'Men Check Shirt',1499.00,1999.00,'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90','Comfortable checked shirt for everyday wear.','2026-09-07 16:52:53','Fashion'),(60039,'Men Short Sleeve Shirt',1199.00,1699.00,'https://cdn.dummyjson.com/products/images/mens-shirts/Men%20Short%20Sleeve%20Shirt/1.png','Lightweight short-sleeve shirt for casual occasions.','2026-09-07 16:52:53','Fashion'),(60040,'Women Printed Dress',2299.00,2999.00,'https://cdn.dummyjson.com/products/images/womens-dresses/Black%20Whim%20Women%20Dress/1.png','Stylish printed dress for women.','2026-09-07 16:52:53','Fashion'),(60041,'Sports Sneakers Off White Red',2999.00,3999.00,'https://cdn.dummyjson.com/products/images/mens-shoes/Sports%20Sneakers%20Off%20White%20Red/1.png','Sporty sneakers designed for everyday comfort.','2026-09-07 16:52:53','Footwear'),(60042,'Nike Air Jordan 1 Red And Black',6999.00,7999.00,'https://cdn.dummyjson.com/products/images/mens-shoes/Nike%20Air%20Jordan%201%20Red%20And%20Black/1.png','Classic basketball-inspired sneakers.','2026-09-07 16:52:53','Footwear'),(60043,'Puma Future Rider Trainers',4999.00,5999.00,'https://cdn.dummyjson.com/products/images/mens-shoes/Puma%20Future%20Rider%20Trainers/1.png','Comfortable lifestyle trainers for everyday use.','2026-09-07 16:52:53','Footwear'),(60044,'Skechers Go Walk 7',4499.00,5499.00,'https://cdn.dummyjson.com/products/images/mens-shoes/Skechers%20Go%20Walk%207/1.png','Lightweight walking shoes with comfortable cushioning.','2026-09-07 16:52:53','Footwear'),(60045,'Formal Leather Shoes',3799.00,4499.00,'https://cdn.dummyjson.com/products/images/mens-shoes/Leather%20Formal%20Shoes/1.png','Classic formal leather shoes for office and occasions.','2026-09-07 16:52:53','Footwear'),(60046,'Apple AirPods Max Silver',54999.00,59999.00,'https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods%20Max%20Silver/1.png','Premium wireless over-ear headphones.','2026-09-07 16:52:53','Electronics'),(60047,'Apple Watch Series 4 Gold',32999.00,37999.00,'https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20Watch%20Series%204%20Gold/1.png','Smart watch with fitness and notification features.','2026-09-07 16:52:53','Electronics'),(60048,'iPhone 12 Silicone Case with MagSafe Plum',1999.00,2499.00,'https://cdn.dummyjson.com/products/images/mobile-accessories/iPhone%2012%20Silicone%20Case%20with%20MagSafe%20Plum/1.png','Protective silicone phone case with MagSafe support.','2026-09-07 16:52:53','Electronics'),(60049,'Selfie Stick Monopod',899.00,1299.00,'https://cdn.dummyjson.com/products/images/mobile-accessories/Selfie%20Stick%20Monopod/1.png','Extendable selfie stick for smartphones.','2026-09-07 16:52:53','Electronics'),(60050,'Apple MagSafe Battery Pack',7999.00,8999.00,'https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20MagSafe%20Battery%20Pack/1.png','Compact magnetic battery pack for compatible smartphones.','2026-09-07 16:52:53','Electronics'),(60051,'Annibale Colombo Bed',89999.00,99999.00,'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/1.png','Premium modern bedroom bed.','2026-09-07 16:52:53','Furniture'),(60052,'Annibale Colombo Sofa',74999.00,84999.00,'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/1.png','Comfortable premium sofa for living rooms.','2026-09-07 16:52:53','Furniture'),(60053,'Bedside Table African Cherry',12999.00,15999.00,'https://cdn.dummyjson.com/products/images/furniture/Bedside%20Table%20African%20Cherry/1.png','Elegant wooden bedside table.','2026-09-07 16:52:53','Furniture'),(60054,'Knoll Saarinen Executive Conference Chair',29999.00,34999.00,'https://cdn.dummyjson.com/products/images/furniture/Knoll%20Saarinen%20Executive%20Conference%20Chair/1.png','Premium executive chair for offices and meeting rooms.','2026-09-07 16:52:53','Furniture'),(60055,'Wooden Bathroom Sink With Mirror',22999.00,27999.00,'https://cdn.dummyjson.com/products/images/furniture/Wooden%20Bathroom%20Sink%20With%20Mirror/1.png','Modern wooden bathroom sink with mirror.','2026-09-07 16:52:53','Furniture'),(60056,'Essence Mascara Lash Princess',699.00,899.00,'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png','Volumizing and lengthening mascara.','2026-09-07 16:52:53','Beauty'),(60057,'Eyeshadow Palette With Mirror',999.00,1299.00,'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20With%20Mirror/1.png','Multi-shade eyeshadow palette with mirror.','2026-09-07 16:52:53','Beauty'),(60058,'Powder Canister',599.00,799.00,'https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/1.png','Compact cosmetic powder for everyday makeup.','2026-09-07 16:52:53','Beauty'),(60059,'Red Lipstick',499.00,699.00,'https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/1.png','Classic red lipstick with smooth finish.','2026-09-07 16:52:53','Beauty'),(60060,'Red Nail Polish',299.00,399.00,'https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/1.png','Bright red nail polish for a glossy finish.','2026-09-07 16:52:53','Beauty'),(60071,'Cricket Helmet',3499.00,3999.00,'https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Helmet/1.png','Protective helmet for cricket players.','2026-09-07 16:52:53','Sports'),(60072,'Cricket Ball',499.00,699.00,'https://cdn.dummyjson.com/products/images/sports-accessories/Cricket%20Ball/1.png','Professional cricket ball for training and matches.','2026-09-07 16:52:53','Sports'),(60073,'Cricket Bat',2499.00,2999.00,'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=90','Professional cricket bat for players.','2026-09-07 16:52:53','Sports'),(60074,'Football',999.00,1299.00,'https://images.unsplash.com/photo-1508098682722-e99c643e7485?auto=format&fit=crop&w=900&q=90','Match-quality football for outdoor games.','2026-09-07 16:52:53','Sports'),(60075,'Yoga Mat',799.00,1099.00,'https://images.pexels.com/photos/6643393/pexels-photo-6643393.jpeg?cs=srgb&dl=pexels-a-darmel-6643393.jpg&fm=jpg','Comfortable non-slip yoga and exercise mat.','2026-09-07 16:52:53','Sports'),(60078,'Building Blocks',699.00,999.00,'https://images.pexels.com/photos/7123080/pexels-photo-7123080.jpeg?cs=srgb&dl=pexels-tara-winstead-7123080.jpg&fm=jpg','Creative building blocks for kids.','2026-09-07 16:52:53','Toys'),(60094,'Fresh Apple',180.00,220.00,'https://cdn.dummyjson.com/products/images/groceries/Apple/1.png','Fresh and crisp apples.','2026-09-07 16:55:23','Grocery'),(60095,'Fresh Cucumber',80.00,100.00,'https://cdn.dummyjson.com/products/images/groceries/Cucumber/1.png','Fresh green cucumber.','2026-09-07 16:55:23','Grocery'),(60096,'Green Bell Pepper',120.00,150.00,'https://cdn.dummyjson.com/products/images/groceries/Green%20Bell%20Pepper/1.png','Fresh green bell peppers.','2026-09-07 16:55:23','Grocery'),(60097,'Premium Rice',399.00,449.00,'https://cdn.dummyjson.com/products/images/groceries/Rice/1.png','Premium quality rice.','2026-09-07 16:55:23','Grocery'),(60098,'Cooking Oil',180.00,220.00,'https://cdn.dummyjson.com/products/images/groceries/Cooking%20Oil/1.png','Vegetable cooking oil.','2026-09-07 16:55:23','Grocery'),(60099,'Fresh Potato',99.00,129.00,'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=90','Fresh potatoes.','2026-09-07 16:55:23','Grocery'),(60100,'Fresh Tomato',89.00,119.00,'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=90','Fresh ripe tomatoes.','2026-09-07 16:55:23','Grocery'),(60101,'Fresh Banana',79.00,99.00,'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=90','Fresh bananas.','2026-09-07 16:55:23','Grocery'),(60102,'Green Peas',129.00,159.00,'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=900&q=90','Fresh green peas.','2026-09-07 16:55:23','Grocery'),(60103,'Whole Wheat Bread',59.00,75.00,'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=90','Fresh whole wheat bread.','2026-09-07 16:55:23','Grocery'),(60104,'Orange Juice',149.00,179.00,'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=90','Refreshing orange juice.','2026-09-07 16:55:23','Grocery'),(60105,'Coffee Powder',299.00,349.00,'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=90','Rich roasted coffee powder.','2026-09-07 16:55:23','Grocery'),(60106,'Tea Powder',249.00,299.00,'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=900&q=90','Aromatic tea powder.','2026-09-07 16:55:23','Grocery'),(60107,'Chocolate Bar',99.00,129.00,'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=90','Creamy milk chocolate bar.','2026-09-07 16:55:23','Grocery'),(60108,'Fresh Carrot',89.00,109.00,'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=900&q=90','Fresh carrots.','2026-09-07 16:55:23','Grocery'),(90001,'iPhone 6',19999.00,22999.00,'https://cdn.dummyjson.com/product-images/smartphones/iphone-6/1.webp','Apple iPhone smartphone with compact design.','2026-09-07 17:02:05','Mobiles'),(90002,'Samsung Galaxy S10',34999.00,39999.00,'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/1.webp','Samsung Galaxy smartphone with premium display.','2026-09-07 17:02:05','Mobiles'),(90003,'Huawei P30',29999.00,34999.00,'https://cdn.dummyjson.com/product-images/smartphones/huawei-p30/1.webp','Huawei smartphone with advanced camera features.','2026-09-07 17:02:05','Mobiles'),(90004,'Oppo A57',17999.00,21999.00,'https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/1.webp','Oppo smartphone for everyday use.','2026-09-07 17:02:05','Mobiles'),(90005,'Vivo S1',18999.00,22999.00,'https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/1.webp','Vivo smartphone with stylish design.','2026-09-07 17:02:05','Mobiles'),(90006,'Apple MacBook Pro 14 Inch Space Grey',159999.00,174999.00,'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp','Premium Apple laptop for professional work.','2026-09-07 17:02:05','Laptops'),(90007,'Asus Zenbook Pro Dual Screen Laptop',139999.00,154999.00,'https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp','High-performance dual-screen Asus laptop.','2026-09-07 17:02:05','Laptops'),(90008,'Huawei Matebook X Pro',109999.00,124999.00,'https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/1.webp','Slim premium Huawei laptop.','2026-09-07 17:02:05','Laptops'),(90009,'Lenovo Yoga 920',89999.00,99999.00,'https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/1.webp','Convertible Lenovo laptop for work and entertainment.','2026-09-07 17:02:05','Laptops'),(90010,'New DELL XPS 13 9300 Laptop',119999.00,134999.00,'https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/1.webp','Compact Dell laptop with premium performance.','2026-09-07 17:02:05','Laptops'),(90011,'Blue & Black Check Shirt',1999.00,2499.00,'https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp','Blue and black checked casual shirt.','2026-09-07 17:02:05','Fashion'),(90012,'Gigabyte Aorus Men Tshirt',1499.00,1999.00,'https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/1.webp','Casual printed t-shirt for men.','2026-09-07 17:02:05','Fashion'),(90013,'Man Plaid Shirt',2299.00,2899.00,'https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp','Classic plaid shirt for men.','2026-09-07 17:02:05','Fashion'),(90014,'Man Short Sleeve Shirt',1399.00,1899.00,'https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp','Comfortable short-sleeve shirt.','2026-09-07 17:02:05','Fashion'),(90015,'Men Check Shirt',1799.00,2299.00,'https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/1.webp','Smart casual checked shirt.','2026-09-07 17:02:05','Fashion'),(90016,'Black Women Gown',3999.00,4999.00,'https://cdn.dummyjson.com/product-images/womens-dresses/black-women%27s-gown/1.webp','Elegant black gown for women.','2026-09-07 17:02:05','Women Fashion'),(90017,'Marni Red And Black Suit',4999.00,5999.00,'https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-%26-black-suit/1.webp','Stylish red and black suit.','2026-09-07 17:02:05','Women Fashion'),(90018,'Corset With Black Skirt',4499.00,5499.00,'https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/1.webp','Fashionable corset and skirt outfit.','2026-09-07 17:02:05','Women Fashion'),(90019,'Corset Leather With Skirt',5299.00,6499.00,'https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/1.webp','Premium leather-style fashion outfit.','2026-09-07 17:02:05','Women Fashion'),(90020,'Dress Pea',2999.00,3799.00,'https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/1.webp','Stylish modern women dress.','2026-09-07 17:02:05','Women Fashion'),(90021,'Nike Air Jordan 1 Red And Black',11999.00,13999.00,'https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp','Classic Nike basketball-inspired sneakers.','2026-09-07 17:02:05','Footwear'),(90022,'Puma Future Rider Trainers',6999.00,7999.00,'https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/1.webp','Comfortable Puma lifestyle trainers.','2026-09-07 17:02:05','Footwear'),(90023,'Sports Sneakers Off White And Red',5999.00,6999.00,'https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-%26-red/1.webp','Sporty sneakers for everyday activities.','2026-09-07 17:02:05','Footwear'),(90024,'Nike Baseball Cleats',7499.00,8499.00,'https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/1.webp','Performance baseball cleats.','2026-09-07 17:02:05','Footwear'),(90025,'Formal Leather Shoes',4499.00,5499.00,'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=90','Classic leather formal shoes.','2026-09-07 17:02:05','Footwear'),(90026,'Apple AirPods Max Silver',54999.00,59999.00,'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp','Premium wireless over-ear headphones.','2026-09-07 17:02:05','Electronics'),(90027,'Apple Watch Series 4 Gold',32999.00,37999.00,'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/1.webp','Smart watch with fitness features.','2026-09-07 17:02:05','Electronics'),(90028,'Selfie Stick Monopod',999.00,1499.00,'https://cdn.dummyjson.com/product-images/mobile-accessories/selfie-stick-monopod/1.webp','Extendable smartphone selfie stick.','2026-09-07 17:02:05','Electronics'),(90029,'Selfie Lamp with iPhone',1499.00,1999.00,'https://cdn.dummyjson.com/product-images/mobile-accessories/selfie-lamp-with-iphone/1.webp','LED selfie lamp for smartphone photography.','2026-09-07 17:02:05','Electronics'),(90030,'Apple MagSafe Battery Pack',8999.00,9999.00,'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/1.webp','Magnetic portable battery pack.','2026-09-07 17:02:05','Electronics'),(90031,'Annibale Colombo Bed',89999.00,99999.00,'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/1.webp','Premium modern bedroom bed.','2026-09-07 17:02:05','Furniture'),(90032,'Annibale Colombo Sofa',74999.00,84999.00,'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/1.webp','Comfortable premium living room sofa.','2026-09-07 17:02:05','Furniture'),(90033,'Bedside Table African Cherry',14999.00,17999.00,'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/1.webp','Elegant African cherry bedside table.','2026-09-07 17:02:05','Furniture'),(90034,'Knoll Saarinen Executive Chair',29999.00,34999.00,'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/1.webp','Premium executive office chair.','2026-09-07 17:02:05','Furniture'),(90035,'Wooden Bathroom Sink With Mirror',24999.00,29999.00,'https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/1.webp','Modern wooden bathroom sink with mirror.','2026-09-07 17:02:05','Furniture'),(90036,'Essence Mascara Lash Princess',699.00,899.00,'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp','Volumizing and lengthening mascara.','2026-09-07 17:02:05','Beauty'),(90037,'Eyeshadow Palette With Mirror',999.00,1299.00,'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp','Multi-color eyeshadow palette with mirror.','2026-09-07 17:02:05','Beauty'),(90038,'Powder Canister',599.00,799.00,'https://cdn.dummyjson.com/product-images/beauty/powder-canister/1.webp','Compact cosmetic powder.','2026-09-07 17:02:05','Beauty'),(90039,'Red Lipstick',499.00,699.00,'https://cdn.dummyjson.com/product-images/beauty/red-lipstick/1.webp','Classic red lipstick.','2026-09-07 17:02:05','Beauty'),(90040,'Red Nail Polish',299.00,399.00,'https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/1.webp','Glossy red nail polish.','2026-09-07 17:02:05','Beauty'),(90041,'Fresh Apple',180.00,220.00,'https://cdn.dummyjson.com/product-images/groceries/apple/1.webp','Fresh and crisp apples.','2026-09-07 17:02:05','Grocery'),(90042,'Fresh Cucumber',80.00,100.00,'https://cdn.dummyjson.com/product-images/groceries/cucumber/1.webp','Fresh green cucumber.','2026-09-07 17:02:05','Grocery'),(90043,'Cooking Oil',180.00,220.00,'https://cdn.dummyjson.com/product-images/groceries/cooking-oil/1.webp','Vegetable cooking oil.','2026-09-07 17:02:05','Grocery'),(90044,'Green Bell Pepper',120.00,150.00,'https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/1.webp','Fresh green bell peppers.','2026-09-07 17:02:05','Grocery'),(90045,'Premium Rice',399.00,449.00,'https://cdn.dummyjson.com/product-images/groceries/rice/1.webp','Premium quality rice.','2026-09-07 17:02:05','Grocery'),(90046,'Fresh Milk',70.00,90.00,'https://cdn.dummyjson.com/product-images/groceries/milk/1.webp','Fresh dairy milk.','2026-09-07 17:02:05','Grocery'),(90047,'Fresh Potatoes',99.00,129.00,'https://cdn.dummyjson.com/product-images/groceries/potatoes/1.webp','Fresh potatoes for cooking.','2026-09-07 17:02:05','Grocery'),(90048,'Red Onions',89.00,119.00,'https://cdn.dummyjson.com/product-images/groceries/red-onions/1.webp','Fresh red onions.','2026-09-07 17:02:05','Grocery'),(90049,'Fresh Kiwi',199.00,249.00,'https://cdn.dummyjson.com/product-images/groceries/kiwi/1.webp','Fresh kiwi fruit.','2026-09-07 17:02:05','Grocery'),(90050,'Drinking Water',49.00,69.00,'https://cdn.dummyjson.com/product-images/groceries/water/1.webp','Packaged drinking water.','2026-09-07 17:02:05','Grocery'),(90051,'Cricket Helmet',3499.00,3999.00,'https://cdn.dummyjson.com/product-images/sports-accessories/cricket-helmet/1.webp','Protective cricket helmet.','2026-09-07 17:02:05','Sports'),(90052,'Cricket Ball',499.00,699.00,'https://cdn.dummyjson.com/product-images/sports-accessories/cricket-ball/1.webp','Professional cricket ball.','2026-09-07 17:02:05','Sports'),(90053,'Football',1299.00,1599.00,'https://cdn.dummyjson.com/product-images/sports-accessories/football/1.webp','Match-quality football.','2026-09-07 17:02:05','Sports'),(90054,'Tennis Racket',2999.00,3499.00,'https://cdn.dummyjson.com/product-images/sports-accessories/tennis-racket/1.webp','Lightweight tennis racket.','2026-09-07 17:02:05','Sports'),(90055,'Golf Ball',999.00,1299.00,'https://cdn.dummyjson.com/product-images/sports-accessories/golf-ball/1.webp','High-quality golf ball set.','2026-09-07 17:02:05','Sports');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `token` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('0b350b254424d7f4df56412fe3bfde316a4af32f4a0a919e43b32d49798cee81',1,'2026-09-14 22:25:36','2026-09-07 16:55:36'),('0f736c763ce71b3703a304973d3d4bbb75b14ceeee6d8c9893a0dc178219f00d',1,'2026-09-14 22:26:19','2026-09-07 16:56:19'),('181d3cb3e744622c58f730737905283c5f9f692f3a5be17ec2df3d960647eef5',30002,'2026-09-14 18:00:20','2026-09-07 12:30:20'),('8e4522ea225502b617c0628467614ae1e2d40372351fd14ab5c36170aabeaaa1',1,'2026-07-18 10:15:28','2026-07-11 04:45:28'),('c1f4b5e36c47cd82cc311a668a359c01dfdb8b104a4a8265fa394487c8646b09',1,'2026-09-15 10:08:15','2026-09-08 04:38:15');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=60002;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'9876543210','$2b$10$YJZbvnUu5GFJjIkWICjZa.GCYZDGoP1a78nesHyiuFqf2QhCu2mlm','Demo User','customer','2026-07-11 04:45:25'),(30002,'8949964104','$2b$10$/uaEVXwpagfhGtBqncJbcOM98vO6gsyA0sDkwuOqg48d4Wq7TGTG6','pooja','customer','2026-09-07 12:30:07');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `unique_wishlist_item` (`user_id`,`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-09 11:45:39
