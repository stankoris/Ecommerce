-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: ecommerce_db
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (10,'Garden','Stylish markers for labeling your indoor garden plants.','2026-02-21 12:25:11','2026-02-21 12:25:11'),(12,'Kitchen','Complete fondue set for chocolate and cheese parties.','2026-02-21 12:25:11','2026-02-21 12:25:11'),(13,'Tools','Sturdy mobile workbench with storage options.','2026-02-21 12:25:11','2026-02-21 12:25:11'),(29,'Food','Food','2026-03-11 17:12:24','2026-03-11 17:12:24');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (8,7,36,1,29.99),(9,7,41,3,59.99),(12,7,32,1,29.99),(14,8,31,1,24.99),(15,9,35,1,59.99),(16,9,41,1,59.99);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (5,10,'2026-02-20 05:06:45',120.00,'PENDING','test, test, 1234, test','COMPLETED','CASH_ON_DELIVERY'),(6,10,'2026-02-20 05:28:39',60.00,'PROCESSING','test, test, test, test','COMPLETED','PAYPAL'),(7,10,'2026-02-21 14:53:42',273.91,'DELIVERED','test, test, 123, retst','COMPLETED','CASH_ON_DELIVERY'),(8,10,'2026-03-11 16:26:28',24.99,'CANCELLED','123, 123, 123, 13','COMPLETED','CASH_ON_DELIVERY'),(9,10,'2026-03-11 17:18:16',119.98,'PENDING','123, 132, 123, 123','COMPLETED','CASH_ON_DELIVERY');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (31,'Woven Storage Baskets','Stylish baskets for organizing various items in your home.',24.99,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSYcyaoqNxM5jqaLrvhm-7n4iyew9YVXH7nQ&s',12,'2026-02-21 12:22:50','2026-03-11 16:26:28'),(32,'Solar String Lights','Eco-friendly string lights for outdoor decor.',29.99,0,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoqnIc7jZ704VbX7pVKfSBPIHt93OmJ71P5Q&s',10,'2026-02-21 12:23:25','2026-03-11 17:16:12'),(35,'Mini Indoor Hydroponic Garden','Grow herbs indoors with this easy-to-use hydroponic garden system.',59.99,3,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMa090HmxNeiqI0Fmy3-dbc3S4AZmGdUqhbQ&s',10,'2026-02-21 12:23:25','2026-03-11 17:18:16'),(36,'Compost Bin','Countertop compost bin for kitchen waste.',29.99,4,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbujAPQBIon8Ddk_MsfllwfLNJ7KWZazJQqg&s',10,'2026-02-21 12:23:25','2026-03-11 17:09:37'),(39,'Black Bean & Corn Salad','A fresh salad made with black beans, corn, and a zesty dressing, great for summer cookouts.',3.99,8,'https://www.eatyourselfskinny.com/wp-content/uploads/2021/08/black-bean-corn-salad-77.jpg',29,'2026-02-21 12:23:25','2026-03-11 17:12:31'),(40,'Roasted Chickpeas','Crispy roasted chickpeas seasoned to perfection',2.99,9,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtlIQLLU5v_MescHqxDv3MQZQLjhrA5VQyrA&s',29,'2026-02-21 12:23:25','2026-03-11 17:12:35'),(41,'Foot Spa Bath Massager','Relax and soothe tired feet with this foot spa.',59.99,6,'https://m.media-amazon.com/images/I/715rYkZ6TJL.jpg',13,'2026-02-21 12:23:25','2026-03-11 17:18:16'),(43,'Fitness Tracker Band','Affordable fitness tracker with heart rate monitor.',29.99,12,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU4-wPIW7wxLb8k-QNTBz0Pv69eXaEWE5bqA&s',13,'2026-02-21 12:23:25','2026-03-11 17:13:12');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (9,'admin','admin','admin@ecommerce.com','$2a$10$ZAevJByyAFnktLVGQBxpXOuIvcSGVmoFSWN.9XrpjezqUownO8Q5m','','','','','','ADMIN','2026-02-20 05:02:50','2026-02-20 05:03:42'),(10,'testuser','test','testuser@gmail.com','$2a$10$nl2kHJFdOlAewizmve1vsukAcdT1BoTAJhzpuVwUxWd/LwXfRWVy6','','','','','','CUSTOMER','2026-02-20 05:06:11','2026-02-20 05:06:11');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-11 18:21:13
