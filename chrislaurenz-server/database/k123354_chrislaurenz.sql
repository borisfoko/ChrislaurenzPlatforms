-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 10.35.46.56:3306
-- Erstellungszeit: 27. Mrz 2020 um 15:27
-- Server-Version: 5.7.28
-- PHP-Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Create DB User
--
CREATE USER 'k123354_bkfgoal'@'%' IDENTIFIED VIA mysql_native_password USING '*5799367BD1856E61D101FDA7F9CA9489081DBB0F';
GRANT ALL PRIVILEGES ON *.* TO 'k123354_bkfgoal'@'%' REQUIRE NONE WITH GRANT OPTION MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0; 

--
-- Datenbank: `k123354_chrislaurenz`
--
CREATE DATABASE IF NOT EXISTS `k123354_chrislaurenz` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `k123354_chrislaurenz`;

DELIMITER $$
--
-- Prozeduren
--
DROP PROCEDURE IF EXISTS `GetAllProductsWithBindData`$$
CREATE DEFINER=`k123354_bkfgoal`@`%` PROCEDURE `GetAllProductsWithBindData` ()  BEGIN
	SELECT 
        JSON_OBJECT(
          'id', P.id,
          'number', P.number,
          'name', P.name,
          'price', P.supplier_price,
          'salePrice', P.sale_price,
          'shortDetails', P.short_details ,
          'description', P.description,
          'stock', JSON_EXTRACT((SELECT JSON_OBJECT('stock', COUNT(A.id)) FROM article A WHERE A.product_id = P.id AND A.status = 'available'), '$.stock'),
		  'pictures',  JSON_EXTRACT(IFNULL((SELECT CONCAT('[',
            GROUP_CONCAT(DISTINCT JSON_OBJECT('id', PV.id, 'image', PP.file) ORDER BY PV.id), ']')
            FROM product_picture PP
            LEFT JOIN product_variant PV ON PP.product_variant_id = PV.id
			LEFT JOIN article A ON A.product_variant_id = PV.id
            WHERE PV.product_id = P.id AND A.status = 'available'
          ),'[]'),'$[*].image'),
          'productType', JSON_OBJECT(
			  'id', PT.id,
			  'number', PT.number,
			  'name', PT.name,
			  'description', PT.description
          ),
          'group', JSON_OBJECT(
            'id', PG.id,
            'name', PG.name,
            'description', PG.description,
            'salePriority', PG.sale_priority
          ),
          'category', JSON_OBJECT(
            'id', PCA.id,
            'name', PCA.name,
            'description', PCA.description,
            'theme', PCA.theme
          ),
          'collection', JSON_OBJECT(
            'id', PCO.id,
            'name', PCO.name,
            'description', PCO.description
          ),
		  'colors', JSON_EXTRACT(IFNULL((SELECT CONCAT('[',
            GROUP_CONCAT(
              DISTINCT JSON_OBJECT(
				'id', PV.id,
                'color', PV.color
              ) ORDER BY PV.id),
            ']')
            FROM product_variant PV
			LEFT JOIN article A ON A.product_variant_id = PV.id
            WHERE PV.product_id = P.id AND A.status = 'available'
          ),'[]'),'$[*].color'),
          'sizes', JSON_EXTRACT(IFNULL((SELECT CONCAT('[',
            GROUP_CONCAT(
              DISTINCT JSON_OBJECT(
                'size', PS.value_int
              )),
            ']')
            FROM product_has_product_size PPS
            INNER JOIN product_size PS ON PS.id = PPS.product_size_id
			LEFT JOIN article A ON A.product_size_id = PS.id
            WHERE PPS.product_id = P.id AND A.status = 'available'
          ),'[]'),'$[*].size'),
          'variants', JSON_EXTRACT(IFNULL((SELECT CONCAT('[',
            GROUP_CONCAT(
              JSON_OBJECT(
                'id', PV.id, 
                'name', PV.name,
                'color', PV.color,
                'image', PP.file
              ) ORDER BY PV.id),
            ']')
            FROM product_variant PV
			LEFT JOIN (
				SELECT PP1.id, PP1.file, PP1.product_variant_id, COUNT(*) AS row_num FROM product_picture PP1
				JOIN product_picture PP2 ON PP1.product_variant_id = PP2.product_variant_id AND PP1.id >= PP2.id
				GROUP BY PP1.product_variant_id, PP1.id
				) PP 
			ON PP.product_variant_id = PV.id AND PP.row_num = 1
			LEFT JOIN article A ON A.product_variant_id = PV.id
            WHERE PV.product_id = P.id AND A.status = 'available'
          ),'[]'),'$'),
          'discount', JSON_EXTRACT(IFNULL((SELECT CONCAT('[',
            GROUP_CONCAT(
              DISTINCT JSON_OBJECT(
                'percent', D.percent
              )),
            ']')
            FROM product_has_discount PHD
            INNER JOIN discount D ON D.id = PHD.discount_id
            WHERE PHD.product_id = P.id AND D.is_active = TRUE
          ),'[]'),'$[*].percent') 
      ) AS 'product'
    FROM product P
    LEFT JOIN product_type PT ON PT.id = P.product_type_id
    LEFT JOIN product_group PG ON PG.id = P.product_group_id
    LEFT JOIN product_category PCA ON PCA.id = P.product_category_id
    LEFT JOIN product_collection PCO ON PCO.id = P.product_collection_id
    ORDER BY P.id;
END$$

DROP PROCEDURE IF EXISTS `GetAllProductsWithBindDataForAdmin`$$
CREATE DEFINER=`k123354_bkfgoal`@`%` PROCEDURE `GetAllProductsWithBindDataForAdmin` ()  BEGIN
	SELECT 
        JSON_OBJECT(
          'id', P.id,
          'number', P.number,
          'name', P.name,
          'price', P.supplier_price,
          'salePrice', P.sale_price,
          'shortDetails', P.short_details ,
          'description', P.description,
          'pictures', JSON_EXTRACT(IFNULL((SELECT CONCAT('[',
            GROUP_CONCAT(
              JSON_OBJECT(
                'id', PV.id, 
                'image', file ,
                'rating', PP.rating 
              )),
            ']')
            FROM product_variant PV
            LEFT JOIN product_picture PP ON PP.product_variant_id = PV.id
            WHERE PV.product_id = P.id
          ),'[]'),'$'),
          'productType', JSON_OBJECT(
			  'id', PT.id,
			  'number', PT.number,
			  'name', PT.name,
			  'description', PT.description
          ),
          'supplier', JSON_OBJECT(
            'id', PS.id,
            'number', PS.number ,
            'name', PS.name ,
            'startDate', PS.contract_start_date,
            'email', PS.email,
            'phoneNumber', PS.phone_number,
            'telNumber', PS.tel_number,
            'address', JSON_OBJECT(
              'id', AD.id,
              'country', AD.country,
              'state', AD.state,
              'city', AD.city,
              'postCode', AD.post_code,
              'streetName', AD.street_name
            )
          ),
          'productGroup', JSON_OBJECT(
            'id', PG.id,
            'name', PG.name,
            'description', PG.description,
            'salePriority', PG.sale_priority
          ),
          'productCategory', JSON_OBJECT(
            'id', PCA.id,
            'name', PCA.name,
            'description', PCA.description,
            'theme', PCA.theme
          ),
          'productCollection', JSON_OBJECT(
            'id', PCO.id,
            'name', PCO.name,
            'description', PCO.description
          ),
          'variants', JSON_EXTRACT(IFNULL((SELECT CONCAT('[',
            GROUP_CONCAT(
              JSON_OBJECT(
                'id', PV.id, 
                'name', PV.name,
                'color', PV.color
              )),
            ']')
            FROM product_variant PV
            WHERE PV.product_id = P.id
          ),'[]'),'$')
      ) AS 'product'
    FROM product P
    LEFT JOIN product_type PT ON PT.id = P.product_type_id
    LEFT JOIN supplier PS ON PS.id = P.supplier_id
    LEFT JOIN address AD ON PS.address_id = AD.id
    LEFT JOIN product_group PG ON PG.id = P.product_group_id
    LEFT JOIN product_category PCA ON PCA.id = P.product_category_id
    LEFT JOIN product_collection PCO ON PCO.id = P.product_collection_id
    ORDER BY P.id;
END$$

DROP PROCEDURE IF EXISTS `GetAllSuppliers`$$
CREATE DEFINER=`k123354_bkfgoal`@`%` PROCEDURE `GetAllSuppliers` ()  BEGIN
	SELECT 
		JSON_OBJECT(
            'id', PS.id,
            'number', PS.number ,
            'name', PS.name ,
            'startDate', PS.contract_start_date,
            'email', PS.email,
            'phoneNumber', PS.phone_number,
            'telNumber', PS.tel_number,
            'address', JSON_OBJECT(
              'id', AD.id,
              'country', AD.country,
              'state', AD.state,
              'city', AD.city,
              'postCode', AD.post_code,
              'streetName', AD.street_name
			)
		  ) AS 'supplier'
	FROM supplier PS
    LEFT JOIN address AD ON PS.address_id = AD.id
    ORDER BY  PS.id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `address`
--

DROP TABLE IF EXISTS `address`;
CREATE TABLE IF NOT EXISTS `address` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `country` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `post_code` varchar(45) DEFAULT NULL,
  `street_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `address_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `address`
--

INSERT INTO `address` (`id`, `country`, `state`, `city`, `post_code`, `street_name`) VALUES
(1, 'Germany', 'Berlin', 'Berlin', '12590', 'Hermannstraße 202'),
(2, 'Germany', 'Hessen', 'Frankfurt', '60528', 'Mörfelder Landstr. 362'),
(3, 'Vietnam', 'Ho Chi Minh', 'Chieu Hoang', '22 Ly', 'Ward 10, Dist 6, '),
(4, 'Bangladesh ', 'Dhaka', 'Dhaka', '1208', '387 (South), Tejgaon Industrial Area '),
(5, 'Germany', 'Hessen', 'Frankfurt', '60528', 'Mörfelder Landstr. 362'),
(6, 'Germany', 'Hessen', 'Frankfurt', '60528', 'Mörfelder Landstr.  362'),
(7, 'Germany', 'Hessen', 'Frankfurt', '60528', 'Mörfelder Landstr. 362');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `article`
--

DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` varchar(45) DEFAULT NULL,
  `barcode` varchar(45) DEFAULT NULL,
  `status` enum('defect','sold','available') DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `supplier_invoice_id` bigint(20) DEFAULT NULL,
  `supplier_delivery_id` bigint(20) DEFAULT NULL,
  `product_variant_id` bigint(20) DEFAULT NULL,
  `product_size_id` int(11) DEFAULT NULL,
  `customer_order_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `article_id_UNIQUE` (`id`),
  KEY `fk_article_product1_idx` (`product_id`),
  KEY `fk_article_supplier_invoice1_idx` (`supplier_invoice_id`),
  KEY `fk_article_supplier_delivery1_idx` (`supplier_delivery_id`),
  KEY `fk_customer_order1_idx` (`customer_order_id`) USING BTREE,
  KEY `fk_product_variant1_idx` (`product_variant_id`) USING BTREE,
  KEY `fk_product_size1_idx` (`product_size_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `article`
--

INSERT INTO `article` (`id`, `number`, `barcode`, `status`, `product_id`, `supplier_invoice_id`, `supplier_delivery_id`, `product_variant_id`, `product_size_id`, `customer_order_id`) VALUES
(1, 'a0005001', '100000001', 'available', 1, NULL, NULL, 1, 3, NULL),
(2, 'a0005002', '100000002', 'available', 1, NULL, NULL, 2, 1, NULL),
(3, 'a0005003', '100000003', 'sold', 1, NULL, NULL, 3, 1, NULL),
(4, 'a0005004', '100000004', 'defect', 1, NULL, NULL, 3, 2, NULL),
(5, 'a0005005', '100000005', 'available', 2, NULL, NULL, 4, 3, NULL),
(6, 'a0005006', '100000006', 'available', 2, NULL, NULL, 4, 3, NULL),
(7, 'a0005007', '100000007', 'sold', 2, NULL, NULL, 4, 3, NULL),
(8, 'a0005008', '100000008', 'defect', 2, NULL, NULL, 4, 3, NULL),
(9, 'a000509', '100000009', 'available', 3, NULL, NULL, 5, 36, NULL),
(10, 'a0005010', '100000010', 'available', 3, NULL, NULL, 6, 37, NULL),
(11, 'a0005011', '100000011', 'sold', 3, NULL, NULL, 7, 38, NULL),
(12, 'a0005012', '100000012', 'defect', 3, NULL, NULL, 7, 38, NULL),
(13, 'a0005013', '100000013', 'available', 4, NULL, NULL, 8, 45, NULL),
(14, 'a0005014', '100000014', 'available', 4, NULL, NULL, 9, 46, NULL),
(15, 'a0005015', '100000015', 'sold', 4, NULL, NULL, 8, 45, NULL),
(16, 'a0005016', '100000016', 'defect', 4, NULL, NULL, 9, 46, NULL),
(17, 'a0005017', '100000017', 'available', 5, NULL, NULL, 10, 40, NULL),
(18, 'a0005018', '100000018', 'available', 5, NULL, NULL, 11, 41, NULL),
(19, 'a0005019', '100000019', 'sold', 5, NULL, NULL, 12, 42, NULL),
(20, 'a0005020', '100000020', 'defect', 5, NULL, NULL, 13, 43, NULL),
(21, 'a0005021', '100000021', 'available', 6, NULL, NULL, 16, 42, NULL),
(22, 'a0005022', '100000022', 'available', 6, NULL, NULL, 17, 40, NULL),
(23, 'a0005023', '100000023', 'sold', 6, NULL, NULL, 18, 42, NULL),
(24, 'a0005024', '100000024', 'defect', 6, NULL, NULL, 18, 41, NULL),
(25, 'a0005025', '100000025', 'available', 7, NULL, NULL, 19, 45, NULL),
(26, 'a0005026', '100000026', 'available', 7, NULL, NULL, 20, 46, NULL),
(27, 'a0005027', '100000027', 'sold', 7, NULL, NULL, 21, 47, NULL),
(28, 'a0005028', '100000028', 'defect', 7, NULL, NULL, 21, 47, NULL),
(29, 'a0005029', '100000029', 'available', 8, NULL, NULL, 22, 41, NULL),
(30, 'a0005030', '100000030', 'available', 8, NULL, NULL, 23, 40, NULL),
(31, 'a0005031', '100000031', 'sold', 8, NULL, NULL, 24, 43, NULL),
(32, 'a0005032', '100000032', 'defect', 8, NULL, NULL, 25, 42, NULL),
(33, 'a0005033', '100000033', 'available', 9, NULL, NULL, 26, 33, NULL),
(34, 'a0005034', '100000034', 'available', 9, NULL, NULL, 27, 34, NULL),
(35, 'a0005035', '100000035', 'sold', 9, NULL, NULL, 27, 33, NULL),
(36, 'a0005036', '100000036', 'defect', 9, NULL, NULL, 26, 34, NULL),
(37, 'a0005037', '100000037', 'available', 10, NULL, NULL, 28, 33, NULL),
(38, 'a0005038', '100000038', 'available', 10, NULL, NULL, 29, 34, NULL),
(39, 'a0005039', '100000039', 'sold', 10, NULL, NULL, 30, 35, NULL),
(40, 'a0005040', '100000040', 'defect', 10, NULL, NULL, 30, 35, NULL),
(41, 'a0005041', '100000041', 'available', 11, NULL, NULL, 31, 5, NULL),
(42, 'a0005042', '100000042', 'available', 11, NULL, NULL, 32, 4, NULL),
(43, 'a0005043', '100000043', 'sold', 11, NULL, NULL, 31, 4, NULL),
(44, 'a0005044', '100000044', 'defect', 11, NULL, NULL, 32, 5, NULL),
(45, 'a0005045', '100000045', 'available', 12, NULL, NULL, 33, 1, NULL),
(46, 'a0005046', '100000046', 'available', 12, NULL, NULL, 34, 2, NULL),
(47, 'a0005047', '100000047', 'sold', 12, NULL, NULL, 35, 3, NULL),
(48, 'a0005048', '100000048', 'defect', 12, NULL, NULL, 35, 4, NULL),
(49, 'a0005049', '100000049', 'available', 13, NULL, NULL, 36, 7, NULL),
(50, 'a0005050', '100000050', 'available', 13, NULL, NULL, 37, 8, NULL),
(51, 'a0005051', '100000051', 'sold', 13, NULL, NULL, 36, 8, NULL),
(52, 'a0005052', '100000052', 'defect', 13, NULL, NULL, 37, 7, NULL),
(53, 'a0005053', '100000053', 'available', 14, NULL, NULL, 38, 15, NULL),
(54, 'a0005054', '100000054', 'available', 14, NULL, NULL, 39, 16, NULL),
(55, 'a0005055', '100000055', 'sold', 14, NULL, NULL, 38, 16, NULL),
(56, 'a0005056', '100000056', 'defect', 14, NULL, NULL, 39, 15, NULL),
(57, 'a0005057', '100000057', 'available', 15, NULL, NULL, 40, 77, NULL),
(58, 'a0005058', '100000058', 'available', 15, NULL, NULL, 40, 78, NULL),
(59, 'a0005059', '100000059', 'sold', 15, NULL, NULL, 40, 79, NULL),
(60, 'a0005060', '100000060', 'defect', 15, NULL, NULL, 40, 79, NULL),
(61, 'a0005061', '100000061', 'available', 16, NULL, NULL, 41, 58, NULL),
(62, 'a0005062', '100000062', 'available', 16, NULL, NULL, 41, 59, NULL),
(63, 'a0005063', '100000063', 'sold', 16, NULL, NULL, 41, 60, NULL),
(64, 'a0005064', '100000064', 'defect', 16, NULL, NULL, 41, 60, NULL),
(65, 'a0005065', '100000065', 'available', 17, NULL, NULL, 42, 60, NULL),
(66, 'a0005066', '100000066', 'available', 17, NULL, NULL, 43, 58, NULL),
(67, 'a0005067', '100000067', 'sold', 17, NULL, NULL, 44, 60, NULL),
(68, 'a0005068', '100000068', 'defect', 17, NULL, NULL, 45, 59, NULL),
(69, 'a0005069', '100000069', 'available', 18, NULL, NULL, 46, 90, NULL),
(70, 'a0005070', '100000070', 'available', 18, NULL, NULL, 47, 91, NULL),
(71, 'a0005071', '100000071', 'sold', 18, NULL, NULL, 48, 92, NULL),
(72, 'a0005072', '100000072', 'defect', 18, NULL, NULL, 49, 93, NULL),
(73, 'a0005073', '100000073', 'available', 19, NULL, NULL, 50, 92, NULL),
(74, 'a0005074', '100000074', 'available', 19, NULL, NULL, 51, 92, NULL),
(75, 'a0005075', '100000075', 'sold', 19, NULL, NULL, 50, 92, NULL),
(76, 'a0005076', '100000076', 'defect', 19, NULL, NULL, 50, 92, NULL),
(77, 'a0005077', '100000077', 'available', 20, NULL, NULL, 51, 92, NULL),
(78, 'a0005078', '100000078', 'available', 20, NULL, NULL, 51, 92, NULL),
(79, 'a0005079', '100000079', 'sold', 20, NULL, NULL, 51, 92, NULL),
(80, 'a0005080', '100000080', 'defect', 20, NULL, NULL, 51, 92, NULL),
(81, 'a0005081', '100000081', 'available', 21, NULL, NULL, 52, NULL, NULL),
(82, 'a0005082', '100000082', 'available', 21, NULL, NULL, 53, NULL, NULL),
(83, 'a0005083', '100000083', 'sold', 21, NULL, NULL, 54, NULL, NULL),
(84, 'a0005084', '100000084', 'defect', 21, NULL, NULL, 54, NULL, NULL),
(85, 'a0005085', '100000085', 'available', 22, NULL, NULL, 55, NULL, NULL),
(86, 'a0005086', '100000086', 'available', 2, NULL, NULL, 4, 3, NULL),
(87, 'a0005087', '100000087', 'sold', 22, NULL, NULL, 56, NULL, NULL),
(88, 'a0005088', '100000088', 'defect', 2, NULL, NULL, 4, 3, NULL),
(89, 'a0005089', '100000089', 'available', 23, NULL, NULL, 57, NULL, NULL),
(90, 'a0005090', '100000090', 'available', 23, NULL, NULL, 58, NULL, NULL),
(91, 'a0005091', '100000091', 'sold', 23, NULL, NULL, 58, NULL, NULL),
(92, 'a0005092', '100000092', 'defect', 23, NULL, NULL, 57, NULL, NULL),
(93, 'a0005093', '100000093', 'available', 24, NULL, NULL, 59, NULL, NULL),
(94, 'a0005094', '100000094', 'available', 24, NULL, NULL, 60, NULL, NULL),
(95, 'a0005095', '100000095', 'sold', 24, NULL, NULL, 59, NULL, NULL),
(96, 'a0005096', '100000096', 'defect', 24, NULL, NULL, 60, NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `blog`
--

DROP TABLE IF EXISTS `blog`;
CREATE TABLE IF NOT EXISTS `blog` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(120) NOT NULL,
  `body` text,
  `creation_timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(250) DEFAULT NULL,
  `creator_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_id_UNIQUE` (`id`),
  KEY `fk_blog_user1_idx` (`creator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `blog`
--

INSERT INTO `blog` (`id`, `title`, `body`, `creation_timestamp`, `image`, `creator_id`) VALUES
(1, 'Cupcakes and Cashmere: Schönheit', NULL, '2020-01-22 18:29:48', 'assets/images/blog/1.jpg', 24),
(2, 'Glamour: Frauen mit schönen Kurven', NULL, '2020-01-22 18:40:53', 'assets/images/blog/2.jpg', 24),
(3, 'Der Still im Büro', NULL, '2020-01-22 18:40:53', 'assets/images/blog/3.jpg', 24),
(4, 'Schwangerschaft: Das Baby ist da.', 'Das Baby ist geboren! Mit diesem für Mütter und Väter oft unbeschreiblich glücklichen Moment wird alles anders. Hier gibt es Tipps zu allen wichtigen Fragen, die Eltern bewegen, wie Babys Ernährung, Schlafen und Pflege.', '2020-02-22 18:40:53', 'assets/images/blog/4.jpg', 24);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `invoice_address_id` bigint(20) DEFAULT NULL,
  `delivery_address_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_id_UNIQUE` (`id`),
  KEY `fk_customer_address1_idx` (`invoice_address_id`),
  KEY `fk_customer_address2_idx` (`delivery_address_id`),
  KEY `fk_customer_user1` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `customer`
--

INSERT INTO `customer` (`id`, `phone_number`, `email`, `invoice_address_id`, `delivery_address_id`, `user_id`) VALUES
(17, '+49 12488787878', 'fokokouti@insystems.de', 2, 7, 23),
(22, '4912488787878', 'boris.kouti@gmail.com', NULL, NULL, 29),
(23, '017672953490', 'bemyarobinson@ymail.com', NULL, NULL, 30);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customer_order`
--

DROP TABLE IF EXISTS `customer_order`;
CREATE TABLE IF NOT EXISTS `customer_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_price` float DEFAULT NULL,
  `status` enum('pending','done','canceled') DEFAULT NULL,
  `customer_id` bigint(20) NOT NULL,
  `customer_order_invoice_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_order_id_UNIQUE` (`id`),
  KEY `fk_customer_order_customer1_idx` (`customer_id`),
  KEY `fk_customer_order_customer_order_invoice1_idx` (`customer_order_invoice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `customer_order`
--

INSERT INTO `customer_order` (`id`, `date`, `total_price`, `status`, `customer_id`, `customer_order_invoice_id`) VALUES
(1, '2020-02-21 17:37:53', 250, 'pending', 17, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customer_order_delivery`
--

DROP TABLE IF EXISTS `customer_order_delivery`;
CREATE TABLE IF NOT EXISTS `customer_order_delivery` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` varchar(45) DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `status` enum('pending','shipped','delivered','abort','canceled') DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `customer_order_id` bigint(20) NOT NULL,
  `delivery_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_order_delivery_id_UNIQUE` (`id`),
  KEY `fk_customer_order_delivery_customer_order1_idx` (`customer_order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `customer_order_delivery`
--

INSERT INTO `customer_order_delivery` (`id`, `number`, `creation_date`, `status`, `due_date`, `customer_order_id`, `delivery_date`) VALUES
(1, 'B1122421', '2020-02-21 00:00:00', 'pending', '2020-02-23 00:00:00', 1, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customer_order_invoice`
--

DROP TABLE IF EXISTS `customer_order_invoice`;
CREATE TABLE IF NOT EXISTS `customer_order_invoice` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` varchar(45) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `creation_date` datetime DEFAULT NULL,
  `status` enum('pending','done','canceled') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_order_invoice_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `customer_order_invoice`
--

INSERT INTO `customer_order_invoice` (`id`, `number`, `due_date`, `creation_date`, `status`) VALUES
(1, 'B1243098', '2020-02-23 00:00:00', '2020-02-21 00:00:00', 'pending');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customer_payment`
--

DROP TABLE IF EXISTS `customer_payment`;
CREATE TABLE IF NOT EXISTS `customer_payment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `customer_payment_method_id` int(11) NOT NULL,
  `customer_order_invoice_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_payment_id_UNIQUE` (`id`),
  KEY `fk_customer_payment_customer_payment_method1_idx` (`customer_payment_method_id`),
  KEY `fk_customer_payment_customer_order_invoice1_idx` (`customer_order_invoice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customer_payment_method`
--

DROP TABLE IF EXISTS `customer_payment_method`;
CREATE TABLE IF NOT EXISTS `customer_payment_method` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `customer_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_payment_method_id_UNIQUE` (`id`),
  KEY `fk_customer_payment_method_customer1_idx` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `customer_payment_method`
--

INSERT INTO `customer_payment_method` (`id`, `name`, `description`, `customer_id`) VALUES
(1, 'paypal', 'testss', 17);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `discount`
--

DROP TABLE IF EXISTS `discount`;
CREATE TABLE IF NOT EXISTS `discount` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `percent` decimal(6,2) NOT NULL DEFAULT '0.00',
  `is_active` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `discount_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `discount`
--

INSERT INTO `discount` (`id`, `percent`, `is_active`) VALUES
(1, '10.00', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `newsletter`
--

DROP TABLE IF EXISTS `newsletter`;
CREATE TABLE IF NOT EXISTS `newsletter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(45) DEFAULT NULL,
  `creation_timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `token` varchar(45) NOT NULL,
  `gender` enum('M','F','U') NOT NULL,
  `is_activ` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `address_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `newsletter`
--

INSERT INTO `newsletter` (`id`, `email`, `creation_timestamp`, `token`, `gender`, `is_activ`) VALUES
(8, 'fokokouti@insystems.de', '2020-03-20 18:16:17', '9N6CqcO2Fqwbmz3AteCkXJh~zN5Pg0uigng1f2gK', 'U', 0),
(9, 'boris.kouti@gmail.com', '2020-03-20 18:44:02', 'aPqnh3fn8bNeacI2oGt~U-R4iJT6bkW7lGRBeHPA', 'U', 0),
(10, 'bemyarobinson@ymail.com', '2020-03-22 20:55:34', 'DXP6jzK.600mzC.lQ62iffcNfNw8yo7NdPIs3YJk', 'M', 0);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `post`
--

DROP TABLE IF EXISTS `post`;
CREATE TABLE IF NOT EXISTS `post` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(120) NOT NULL,
  `body` longtext,
  `creation_timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(250) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `blog_id` bigint(20) NOT NULL,
  `creator_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_id_UNIQUE` (`id`),
  KEY `fk_post_user1_idx` (`creator_id`),
  KEY `fk_post_blog1_idx` (`blog_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `post`
--

INSERT INTO `post` (`id`, `title`, `body`, `creation_timestamp`, `image`, `is_active`, `blog_id`, `creator_id`) VALUES
(1, '5 Schritte für die Suche nach dem perfekten Braut-Make-up-Künstler', 'Die Suche nach \"dem Einen\" hört nach Ihrem Engagement nicht auf.\r\nWhen it comes to wedding planning, I\'ve actually been displaying out-of-character levels of chill. Truly nothing in the process has phased me, except when it comes to wedding beauty. Perhaps it\'s because beauty is such a big part of my job or because I\'ve been dabbling in it since I was a kid, but I was not going to allow anything to fall through in regards to my makeup on the big day. \r\n\r\nMakeup artists are incredibly talented, and I\'m constantly amazed at how easily they can look at someone\'s face and just know what to do. That doesn\'t mean that every artist is for you, however. Each artist comes with their own style (think bold and bright versus barely there), and if you pick the wrong one, you could look completely different than intended on your wedding day. \r\n', '2020-01-22 18:36:29', 'assets/images/blog/blog1/1.jpeg', 1, 1, 24),
(2, 'Schöne Kurven', '', '2020-02-22 18:36:29', NULL, 1, 2, 24),
(3, 'Guter Still', '', '2020-02-12 18:36:29', NULL, 1, 2, 24),
(4, 'Perfekter Anzug', '', '2020-02-12 18:36:29', NULL, 1, 2, 24),
(5, 'Perfekter Meeting Auftritt', 'Der blaue Anzug finde ich perfekt.', '2020-02-22 18:36:29', NULL, 1, 3, 24),
(6, 'Das blaue passt immer', 'Der blaue Anzug finde ich perfekt.', '2020-01-22 18:36:29', NULL, 1, 3, 24),
(7, 'Schwangerschaft', 'Ich bin auch Schanger.', '2020-01-22 18:36:29', NULL, 1, 4, 24);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `post_has_comment`
--

DROP TABLE IF EXISTS `post_has_comment`;
CREATE TABLE IF NOT EXISTS `post_has_comment` (
  `post_id` bigint(20) NOT NULL,
  `comment_id` bigint(20) NOT NULL,
  PRIMARY KEY (`post_id`,`comment_id`),
  KEY `fk_post_has_post2_idx` (`comment_id`),
  KEY `fk_post_has_post1_idx` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` varchar(45) NOT NULL,
  `name` varchar(60) NOT NULL,
  `supplier_price` float DEFAULT NULL,
  `sale_price` float DEFAULT NULL,
  `short_details` varchar(240) DEFAULT NULL,
  `description` longtext,
  `product_picture_miniature` varchar(500) DEFAULT NULL,
  `product_type_id` int(11) DEFAULT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `product_group_id` int(11) DEFAULT NULL,
  `product_category_id` int(11) DEFAULT NULL,
  `product_collection_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id_UNIQUE` (`id`),
  KEY `fk_product_product_type1_idx` (`product_type_id`),
  KEY `fk_product_supplier1_idx` (`supplier_id`),
  KEY `fk_product_product_group1_idx` (`product_group_id`),
  KEY `fk_product_product_category1_idx` (`product_category_id`),
  KEY `fk_product_product_collection1_idx` (`product_collection_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `product`
--

INSERT INTO `product` (`id`, `number`, `name`, `supplier_price`, `sale_price`, `short_details`, `description`, `product_picture_miniature`, `product_type_id`, `supplier_id`, `product_group_id`, `product_category_id`, `product_collection_id`) VALUES
(1, 'w00001', 'en:Ladies pumps/de:Damenpumps/fr:escarpins pour femmes', 80, 100, 'en:LEATHER CLASSIC HEELS - Pumps/de:Leder Damenpumps/fr:Escarpins en cuire', 'en:Styled entirely in romantic lace, this pumps is perfect for your short-sleeve dress from Taylor features a subtle high-low hem with a classic V-neckline./de:Ganz aus romantischer Spitze gestylt, passen diese Pumps perfekt mit allen kurzärmeligen Kleider./fr:Entièrement conçue en dentelle romantique, ces escarpins sont parfaits pour toutes vos robes.', 'assets/images/fashion/product/1.jpg', 13, 2, 4, 1, 2),
(2, 'w00002', 'en:Ballerinas/de:Ballerinas/fr:Ballerines', 40, 50, 'en:LEATHER - Ballerinas/de:Leder Ballerinas/fr:Ballerines en cuire', 'en:Styled entirely in romantic lace, this ballerinas is perfect  your flexibility and all your moves in onthe street./de:Ganz aus romantischer Spitze gestylt, passen diese Ballerinas perfekt für all Ihre Bewegungen in der Stadt./fr:Entièrement conçue et faconné pour vous, ces ballerines sont parfaites pour tous vos deplacements.', 'assets/images/fashion/product/4.jpg', 12, 2, 4, 1, 2),
(3, 'w00003', 'en:Belt Sandal/de:Riemensandalette/fr:sandalles pour enfants', 20, 20, 'en:Girl\'s Belt Sandal/de:Riemensandalette für Mädchen/fr:Sandale pour fille', 'en:Perfect belt sandal for the street./de:Perfekte sandalette für Spaziergänge./fr:Sandale pour toutes vos balade d\'été.', 'assets/images/fashion/product/5.jpg', 29, 2, 4, 3, 2),
(4, 'w00004', 'en:Slippers/de:Badeschuhe/fr:Babouche', 20, 20, 'en:Girl\'s slippers/de:Badeschuhe für Mädchen/fr:babouche pour fille', 'en:Perfect slipper for your angel./de:Perfekte Badeschuhe für dein Engel./fr:Babouches pour toutes les occasions.', 'assets/images/fashion/product/8.jpg', 29, 2, 4, 3, 2),
(5, 'b00005', 'en:Sneakers (CL)/de:Sneakers (CL)/fr:Baskets (CL)', 40, 50, 'en:Boy\'s sneakers (CL)/de:Sneakers für Junge (CL)/fr:Baskets pour garçons (CL)', 'en:ChrisLaurenz High quality sneakers for boys./de:Perfekte & Hochwertige Sneackers für Junge./fr:Basket de qualité superieur de la marque CL.', 'assets/images/fashion/product/10.jpg', 29, 2, 4, 4, 6),
(6, 'b00006', 'en:MulticolorSneakers (CL)/de:Mehrfarbige Sneakers (CL)/fr:B', 60, 75, 'en: boys\'s multicolor sneakers (CL)/de:mehrfarbige Sneackers für Jungen (CL)/fr:baskets multicolores pour garçons (CL)', 'en:ChrisLaurenz High quality sneakers for boys, choose the style, that correspond to your personality./de:Perfekte & Hochwertige Sneackers für Junge./fr:Avec les baskets multicolores pour garçons (CL) personalise ton style.', 'assets/images/fashion/product/16.jpg', 29, 2, 4, 4, 6),
(7, 'b00007', 'en:Sport Sneakers (CL)/de:Sport Sneakers (CL)/fr:Baskets de ', 90, 100, 'en:boy\'s sport sneakers (CL)/de:Sport Sneackers für Jungen (CL)/fr:baskets de sport pour garçons (CL)', 'en:Sport sneakers. Keep in touch./de:Mit den neuen Sport Sneakers von CL immer fit bleiben./fr:Gardez la forme et soyez près en toute occasion.', 'assets/images/fashion/product/19.jpg', 35, 2, 6, 4, 6),
(8, 'a00008', 'en:Football shoe (CL)/de:Football sneackers (CL)/fr:Godasses', 40, 50, 'en:Football shoes for the best sport in the world (CL)/de:Football sneackers für alle (CL)/fr:Godasses de foot en plusieurs coleurs (CL)', 'en:Football shoes for girls and boys./de:Football Schuhe für Mädchen und Jungs./fr:Godasses pour fille, garçon, hommes et femmes.', 'assets/images/fashion/product/22.jpg', 35, 2, 6, 6, 6),
(9, 'g00009', 'en:Leather belt sandal (CL)/de:Leder Riemensandalette (CL)/f', 20, 25, 'en:girl\'s belt sandal from CL/de:Riemensandalette für Mädchen (CL)/fr:sandalles pour filles (CL)', 'en:girl\'s belt sandal for all occations./de:Spezial für Sie angefertigt: hier sind die neu Riemensandalette./fr:Des sandalle class pour toutes les occasions.', 'assets/images/fashion/product/26.jpg', 16, 2, 4, 3, 2),
(10, 'g00010', 'en:LULU - Leather belt sandal/de:LULU - Leder Riemensandalet', 25, 25, 'en:girl\'s LULU - belt sandal from CL/de:LULU - Riemensandalette für Mädchen (CL)/fr:sandalles pour filles - LULU(CL)', 'en:girl\'s LULU belt sandal for all occations./de:Spezial für Sie angefertigt: hier die neue LULU Riemensandalette./fr:Des sandalle class pour toutes les occasions: LULU', 'assets/images/fashion/product/28.jpg', 16, 2, 4, 3, 2),
(11, 'w00011', 'en:Sport Sneackers/de:Sport Sneackers/fr:Baskets de sport', 90, 100, 'en:Women\'s sport sneackers/de:Sport Sneackers für Frauen/fr:Baskets pour femmes', 'en:Women\'s sport sneackers./de:Sport Sneackers für Frauen./fr:Baskets pour femmes.', 'assets/images/fashion/product/31.jpg', 35, 2, 6, 1, 6),
(12, 'w00012', 'en:Slippers/de:Slipper/fr:Baskets de marche', 80, 90, 'en:Women\'s slippers (CL)/de:Slippers für Frauen (CL)/fr:Baskets de marche pour femme (CL)', 'en:Women\'s slippers (CL)./de:Slippers für Frauen (CL)./fr:Baskets de marche pour femme (CL).', 'assets/images/fashion/product/33.jpg', 35, 2, 4, 1, 6),
(13, 'w00013', 'en:Mickey Slippers/de:Mickey Slipper/fr:Baskets Mickey', 80, 90, 'en:Women\'s Mickey Slippers (CL)/de:Mickey Slippers für Frauen (CL)/fr:Baskets Mickey de marche pour femme (CL)', 'en:Women\'s Mickey Slippers (CL)./de:Mickey Slippers für Frauen (CL)./fr:Baskets Mickey de marche pour femme (CL).', 'assets/images/fashion/product/40.jpg', 34, 2, 4, 1, 6),
(14, 'm00014', 'en:Sandal (CL)/de:Badeschuhe (CL)/fr:Bebouche (CL)', 15, 15, 'en:Men\'s sandal from (CL)/de:Badeschuhe (CL)/fr:Bebouche (CL)', 'en:Men\'s sandal for all occations./de:Spezial für Sie angefertigt: hier die neuen Badeschuhe./fr:Des sandalle class pour la piscine.', 'assets/images/fashion/product/42.jpg', 35, 2, 4, 2, 1),
(15, 'w00015', 'en:Maxidress/de:Langes Kleid/fr:Longe Robe', 50, 60, 'en:LONG DRESS NEW - Maxidress/de:Blumiges langes Kleid/fr:Longe robe fleuri', 'en:LONG DRESS NEW - Maxidress with wrap detail in smudge print/de:Blumiges langes Kleid mit Wickeldetail im Wickeldruck/fr:Longe robe fleuri avec détail d\'écharpe en imprimé tacheté', 'assets/images/fashion/product/44.jpg', 3, 2, 4, 1, 1),
(16, 'w00016', 'en:Overalls Jeans/de:Overalls Jeans/fr:Salopette en Jean', 60, 60, 'en:Overalls jeans/de:Overalls jeans/fr:Salopette en jean', 'en:Overall super high rise mom jean/de:Overall Jeans/fr:Salopette en jean', 'assets/images/fashion/product/47.jpg', 5, 2, 3, 1, 1),
(17, 'w00017', 'en:Danim Jeans/de:Danim Jeans/fr:Danim Jeans', 30, 30, 'en:Dr Denim Nora jeans/de:Dr Denim Nora jeans/fr:Jeans Denim Nora', 'en:Dr Denim Nora super high rise mom jean/de:Dr. Denim Nora Superhochhaus Mama Jeans/fr:Dr Denim Nora, jean de maman de grande taille', 'assets/images/fashion/product/50.jpg', 5, 2, 3, 1, 6),
(18, 'm00018', 'en:Half T-Shirt/de:Halb T-Shirt/fr:T-Shirt', 25, 30, 'en:T-shirt Fila Abramo/de:T-shirt Fila Abramo/fr:T-shirt Fila Abramo', 'en:Fila Abramo half and half texture t-shirt in bran/de:Fila Abramo halb und halb Textur T-Shirt aus Kleie/fr:T-shirt Fila Abramo texture moitié-moitié en son', 'assets/images/fashion/product/54.jpg', 9, 2, 3, 2, 6),
(19, 'm00019', 'en:Half sleeve/de:kurzärmeliges Hemd/fr:Chemise courte manch', 35, 40, 'en:AllSaints Redondo/de:AllSaints Redondo/fr:AllSaints Redondo', 'en:AllSaints Redondo half sleeve shirt with ramskull in white/de:AllSaints Redondo Halbarm-Shirt mit Totenkopf in weiß/fr:AllSaints Redondo chemise demi-manches avec tête de mort en blanc', 'assets/images/fashion/product/58.jpg', 9, 2, 3, 2, 6),
(20, 'm00020', 'en:Half sleeve/de:kurzärmeliges Hemd/fr:Chemise courte manch', 35, 40, 'en:AllSaints Redondo/de:AllSaints Redondo/fr:AllSaints Redondo', 'en:AllSaints Redondo half sleeve shirt with ramskull in white/de:AllSaints Redondo Halbarm-Shirt mit Totenkopf in weiß/fr:AllSaints Redondo chemise demi-manches avec tête de mort en blanc', 'assets/images/fashion/product/59.jpg', 9, 2, 3, 2, 6),
(21, 'm00021', 'en:BOSS - Watch/de:Armbanduhr/fr:Montres à main', 120, 120, 'en:Business Watch from BOSS/de:BOSS - Business Armbanduhr/fr:Montre de luxe: BOSS', 'en:Business Watch from BOSS/de:BOSS - Business Armbanduhr/fr:Montre de luxe: BOSS', 'assets/images/fashion/product/60.jpg', 25, 1, 5, 2, 6),
(22, 'w00022', 'en:Watch/de:Armbanduhr/fr:Montres à main', 120, 120, 'en:Women\'s business Watch from BOSS/de:BOSS - Business Frauenarmbanduhr/fr:Montre de luxe pour elle', 'en:Women\'s business Watch from BOSS/de:BOSS - Business Frauenarmbanduhr/fr:Montre de luxe BOSS pour elle', 'assets/images/fashion/product/63.jpg', 25, 1, 5, 1, 6),
(23, 'a00023', 'en:Home desk/de:Deko Tisch/fr:Gueridon deco', 40, 40, 'en:Home desk/de:Perfekt gestylter Tisch/fr:Gueridon deco', 'en:Home desk (New style)/de:Perfekt gestylter Tisch/fr:Gueridon deco', 'assets/images/fashion/product/65.jpg', 27, 1, 5, 6, 6),
(24, 'w00024', 'en:Skin cream/de:Hautcream/fr:BB Crême', 40, 40, 'en:BB Cream (BALI Body)/de:BB Cream (BALI Body)/fr:Bébé Cream (BALI Body)', 'en:BB Cream (BALI Body)/de:BB Cream (BALI Body)/fr:Bébé Cream (BALI Body)', 'assets/images/fashion/product/67.jpg', 27, 1, 5, 1, 6);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product_category`
--

DROP TABLE IF EXISTS `product_category`;
CREATE TABLE IF NOT EXISTS `product_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `side_picture` varchar(250) DEFAULT NULL,
  `mega_picture` varchar(250) DEFAULT NULL,
  `sub_banner_picture` varchar(250) DEFAULT NULL,
  `theme` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_category_name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `product_category`
--

INSERT INTO `product_category` (`id`, `name`, `description`, `side_picture`, `mega_picture`, `sub_banner_picture`, `theme`) VALUES
(1, 'en:Women/de:Damen/fr:Femme', 'en:Find here everything for her/de:Damenmode, alles passend zu dir/fr:La mode au feminin', 'assets/images/side-banner1.png', 'assets/images/mega-menu/1.jpg', 'assets/images/sub-banner1.jpg', 'pink'),
(2, 'en:Men/de:Herren/fr:Homme', 'en:Menwear and all accessories/de:Herrenmode/fr:Boutique Homme, chaussures, vêtemens et accessoires', 'assets/images/side-banner2.png', 'assets/images/mega-menu/2.jpg', 'assets/images/sub-banner2.jpg', 'black'),
(3, 'en:Girl/de:Mädchen/fr:Fille', 'en:Find here all kids wears/de:Finden Sie hier alles für die kleinen Engel/fr:articles de mode pour enfants', 'assets/images/side-banner3.png', 'assets/images/mega-menu/3.jpg', 'assets/images/sub-banner3.jpg', 'violet'),
(4, 'en:Boy/de:Junge/fr:Garçon', 'en:Find here all boys wears/de:Finden Sie hier alles für Junge/fr:articles de mode pour garçon', 'assets/images/side-banner4.png', 'assets/images/mega-menu/4.jpg', 'assets/images/sub-banner4.jpg', 'blue'),
(5, 'en:Kids/de:Kinder/fr:Enfants', 'en:Find here all kids wears/de:Finden Sie hier alles für die kleinen Engel/fr:articles de mode pour enfants', 'assets/images/side-banner5.png', 'assets/images/mega-menu/5.jpg', 'assets/images/sub-banner5.jpg', 'white'),
(6, 'en:All/de:Alle/fr:All', 'en:Find here all articles for all/de:Finden Sie hier alles Modeartikel/fr:Meilleur selection d\'articles pour vous.', 'assets/images/side-banner6.png', 'assets/images/mega-menu/6.jpg', 'assets/images/sub-banner6.jpg', 'blue');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product_collection`
--

DROP TABLE IF EXISTS `product_collection`;
CREATE TABLE IF NOT EXISTS `product_collection` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(480) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `product_collection`
--

INSERT INTO `product_collection` (`id`, `name`, `description`) VALUES
(1, 'en:Summer/de:Sommer/fr:Été', 'en:The perfect ideas for your personalized summer outfit./de:Die perfekten Ideen für dein personalisiertes Sommeroutfit./fr:L\'idée parfaite pour un été parfait.'),
(2, 'en:Spring/de:Frühling/fr:Printemps', 'en:For a pleasant spring, we have combined the most beautiful outfits especially for you./de:Für einen angenehmen Frühling haben wir die schönsten Outfits extra für dich kombiniert./fr:Pour un agrémen'),
(3, 'en:Autumn/de:Herbst/fr:Automne', 'en:Find here the inspiration for your autumn outfit ideas/de:Hier finden Sie die Inspiration für Ihre Herbst-Outfit-Ideen/fr:Trouvez ici l\'inspiration pour vos idées de tenues d\'automne'),
(4, 'en:Winter/de:Winter/fr:Hiver', 'en:Find here the most inspiring winter outfit ideas/de:Hier finden Sie die inspirierendsten Ideen für Winter-Outfits/fr:Trouvez ici les idées de tenues d\'hiver les plus inspirantes'),
(5, 'en:Christmas/de:Weihnachten/fr:Noel', 'en:Find here the most inspiring christmas autfit ideas/de:Hier finden Sie die inspirierendsten Ideen für Weihnachts-Outfits/fr:Trouvez ici les idées de tenues de Noël les plus inspirantes'),
(6, 'en:All seasons/de:Alle Jahrzeiten/fr:Toute saison', 'en:The perfect ideas for your personalized outfit for all seasons./de:Die perfekten Ideen für dein personalisiertes Outfit./fr:L\'idée parfaite pour une année parfaite.');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product_group`
--

DROP TABLE IF EXISTS `product_group`;
CREATE TABLE IF NOT EXISTS `product_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(480) DEFAULT NULL,
  `sale_priority` int(11) DEFAULT NULL COMMENT 'from 1 to 10',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `product_group`
--

INSERT INTO `product_group` (`id`, `name`, `description`, `sale_priority`) VALUES
(1, 'en:Get the look/de:Get the look/fr:Nouveautés', 'en:Perfectly combined by fashion experts. Get fresh outfit ideas for the new season and every occasion./de:Perfekt kombiniert von Mode-Kennern: Hol dir frische Outfit-Ideen für die neue Saison und jeden Anlass./fr:Le style parfait: obtenez de nouvelles idées de tenues pour la nouvelle saison et chaque occasion.', 1),
(2, 'en:Collection/de:Kollektion/fr:Collection', 'en:/de:/fr:', 2),
(3, 'en:Clothing/de:Bekleidung/fr:Vêtements', 'en:Clothing/de:bekleidung/fr:Vêtements', 3),
(4, 'en:Shoes/de:Schuhe/fr:Chaussures', 'en:Shoes for all occasions/de:Schuhen für alle Anlässe/fr:Chaussures pour toutes les occasions', 4),
(5, 'en:Accessories/de:Accessoires/fr:Accessoires', 'en:Accessories/de:Accessoires/fr:Accessoires', 5),
(6, 'en:Sports/de:Sport/fr:Sport', 'en:When Function meets fashion/de:Funktion triff Style/fr:L\'alliance entre le performance et style', 6);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product_has_customer_order`
--

DROP TABLE IF EXISTS `product_has_customer_order`;
CREATE TABLE IF NOT EXISTS `product_has_customer_order` (
  `product_id` bigint(20) NOT NULL,
  `customer_order_id` bigint(20) NOT NULL,
  `product_variant_id` bigint(20) DEFAULT NULL,
  `product_size_id` int(11) DEFAULT NULL,
  `product_order_quantity` int(11) DEFAULT NULL,
  `product_order_comment` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`product_id`,`customer_order_id`),
  KEY `fk_product_has_customer_order_customer_order1_idx` (`customer_order_id`) USING BTREE,
  KEY `fk_product_has_customer_order_product1_idx` (`product_id`) USING BTREE,
  KEY `product_has_customer_order_product_variant1_idx` (`product_variant_id`),
  KEY `product_has_customer_order_product_size1_idx` (`product_size_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Daten für Tabelle `product_has_customer_order`
--

INSERT INTO `product_has_customer_order` (`product_id`, `customer_order_id`, `product_variant_id`, `product_size_id`, `product_order_quantity`, `product_order_comment`) VALUES
(1, 1, 1, 1, 1, 'black'),
(3, 1, 5, 36, 1, 'yellow');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product_has_discount`
--

DROP TABLE IF EXISTS `product_has_discount`;
CREATE TABLE IF NOT EXISTS `product_has_discount` (
  `product_id` bigint(20) NOT NULL,
  `discount_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`discount_id`),
  KEY `fk_product_has_discount_discount1_idx` (`discount_id`),
  KEY `fk_product_has_discount_product1_idx` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `product_has_discount`
--

INSERT INTO `product_has_discount` (`product_id`, `discount_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product_has_product_size`
--

DROP TABLE IF EXISTS `product_has_product_size`;
CREATE TABLE IF NOT EXISTS `product_has_product_size` (
  `product_id` bigint(20) NOT NULL,
  `product_size_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`product_size_id`),
  KEY `fk_product_has_product_size_product_size1_idx` (`product_size_id`),
  KEY `fk_product_has_product_size_product1_idx` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `product_has_product_size`
--

INSERT INTO `product_has_product_size` (`product_id`, `product_size_id`) VALUES
(1, 1),
(12, 1),
(1, 2),
(12, 2),
(1, 3),
(2, 3),
(12, 3),
(11, 4),
(12, 4),
(11, 5),
(12, 5),
(12, 6),
(12, 7),
(13, 7),
(13, 8),
(14, 15),
(14, 16),
(9, 33),
(10, 33),
(9, 34),
(10, 34),
(10, 35),
(3, 36),
(3, 37),
(3, 38),
(5, 40),
(6, 40),
(8, 40),
(5, 41),
(6, 41),
(8, 41),
(5, 42),
(6, 42),
(8, 42),
(5, 43),
(8, 43),
(5, 44),
(4, 45),
(5, 45),
(7, 45),
(4, 46),
(7, 46),
(7, 47),
(16, 58),
(17, 58),
(16, 59),
(17, 59),
(16, 60),
(17, 60),
(17, 61),
(15, 77),
(15, 78),
(15, 79),
(18, 90),
(18, 91),
(18, 92),
(19, 92),
(20, 92),
(18, 93);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product_picture`
--

DROP TABLE IF EXISTS `product_picture`;
CREATE TABLE IF NOT EXISTS `product_picture` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `file` varchar(250) NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL COMMENT 'Picture quality and angle rating from 1 to 10',
  `product_variant_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_picture_id_UNIQUE` (`id`),
  KEY `fk_product_picture_product_variant1_idx` (`product_variant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `product_picture`
--

INSERT INTO `product_picture` (`id`, `file`, `description`, `rating`, `product_variant_id`) VALUES
(1, 'assets/images/fashion/product/1.jpg', 'Damenpumps', 1, 1),
(2, 'assets/images/fashion/product/2.jpg', 'Damenpumps', 1, 2),
(3, 'assets/images/fashion/product/3.jpg', 'Damenpumps', 1, 3),
(4, 'assets/images/fashion/product/4.jpg', 'Ballerinas', 1, 4),
(5, 'assets/images/fashion/product/5.jpg', 'Riemensandalette', 1, 5),
(6, 'assets/images/fashion/product/6.jpg', 'Riemensandalette', 1, 6),
(7, 'assets/images/fashion/product/7.jpg', 'Riemensandalette', 1, 7),
(8, 'assets/images/fashion/product/8.jpg', 'girl\'s slippers', 1, 8),
(9, 'assets/images/fashion/product/9.jpg', 'girl\'s slippers', 1, 9),
(10, 'assets/images/fashion/product/10.jpg', 'boy\'s sneakers (CL)', 1, 10),
(11, 'assets/images/fashion/product/11.jpg', 'boy\'s sneakers (CL)', 1, 11),
(12, 'assets/images/fashion/product/12.jpg', 'boy\'s sneakers (CL)', 1, 12),
(13, 'assets/images/fashion/product/13.jpg', 'boy\'s sneakers (CL)', 1, 13),
(14, 'assets/images/fashion/product/14.jpg', 'boy\'s sneakers (CL)', 1, 14),
(15, 'assets/images/fashion/product/15.jpg', 'boy\'s sneakers (CL)', 1, 15),
(16, 'assets/images/fashion/product/16.jpg', 'multicolor boy\'s sneakers (CL)', 1, 16),
(17, 'assets/images/fashion/product/17.jpg', 'multicolor boy\'s sneakers (CL)', 1, 17),
(18, 'assets/images/fashion/product/18.jpg', 'multicolor boy\'s sneakers (CL)', 1, 18),
(19, 'assets/images/fashion/product/19.jpg', 'boy\'s sport sneakers (CL)', 1, 19),
(20, 'assets/images/fashion/product/20.jpg', 'boy\'s sport sneakers (CL)', 1, 20),
(21, 'assets/images/fashion/product/21.jpg', 'boy\'s sport sneakers (CL)', 1, 21),
(22, 'assets/images/fashion/product/22.jpg', 'football shoe (CL)', 1, 22),
(23, 'assets/images/fashion/product/23.jpg', 'football shoe (CL)', 1, 23),
(24, 'assets/images/fashion/product/24.jpg', 'football shoe (CL)', 1, 24),
(25, 'assets/images/fashion/product/25.jpg', 'football shoe (CL)', 1, 25),
(26, 'assets/images/fashion/product/26.jpg', 'girl\'s belt sandal', 1, 26),
(27, 'assets/images/fashion/product/27.jpg', 'girl\'s belt sandal', 1, 27),
(28, 'assets/images/fashion/product/28.jpg', 'girl\'s LULU belt sandal', 1, 28),
(29, 'assets/images/fashion/product/29.jpg', 'girl\'s LULU belt sandal', 1, 29),
(30, 'assets/images/fashion/product/30.jpg', 'girl\'s LULU belt sandal', 1, 30),
(31, 'assets/images/fashion/product/31.jpg', 'Women\'s sport sneackers', 1, 31),
(32, 'assets/images/fashion/product/32.jpg', 'Women\'s sport sneackers', 1, 32),
(33, 'assets/images/fashion/product/33.jpg', 'Women\'s slippers (CL)', 1, 33),
(34, 'assets/images/fashion/product/34.jpg', 'Women\'s slippers (CL)', 1, 34),
(35, 'assets/images/fashion/product/35.jpg', 'Women\'s slippers (CL)', 1, 35),
(36, 'assets/images/fashion/product/36.jpg', 'Women\'s slippers (CL)', 1, 35),
(37, 'assets/images/fashion/product/37.jpg', 'Women\'s slippers (CL)', 1, 35),
(38, 'assets/images/fashion/product/38.jpg', 'Women\'s slippers (CL)', 1, 35),
(39, 'assets/images/fashion/product/39.jpg', 'Women\'s slippers (CL)', 1, 35),
(40, 'assets/images/fashion/product/40.jpg', 'Women\'s Mickey Slippers (CL)', 1, 36),
(41, 'assets/images/fashion/product/41.jpg', 'Women\'s Mickey Slippers (CL)', 1, 37),
(42, 'assets/images/fashion/product/42.jpg', 'Men\'s sandal (CL)', 1, 38),
(43, 'assets/images/fashion/product/43.jpg', 'Men\'s sandal (CL)', 1, 39),
(44, 'assets/images/fashion/product/44.jpg', 'LONG DRESS NEW - Maxikleid - Front', 1, 40),
(45, 'assets/images/fashion/product/45.jpg', 'LONG DRESS NEW - Maxikleid - Front', 1, 40),
(46, 'assets/images/fashion/product/46.jpg', 'LONG DRESS NEW - Maxikleid - Front', 1, 40),
(47, 'assets/images/fashion/product/47.jpg', 'Women\'s Overalls Jeans - Front', 1, 41),
(48, 'assets/images/fashion/product/48.jpg', 'Women\'s Overalls Jeans - Front', 1, 41),
(49, 'assets/images/fashion/product/49.jpg', 'Women\'s Overalls Jeans - Front', 1, 41),
(50, 'assets/images/fashion/product/50.jpg', 'Women\'s Demin Jean', 1, 42),
(51, 'assets/images/fashion/product/51.jpg', 'Women\'s Demin Jean', 1, 43),
(52, 'assets/images/fashion/product/52.jpg', 'Women\'s Demin Jean', 1, 44),
(53, 'assets/images/fashion/product/53.jpg', 'Women\'s Demin Jean', 1, 45),
(54, 'assets/images/fashion/product/54.jpg', 'Men\'s T-Shirt', 1, 46),
(55, 'assets/images/fashion/product/55.jpg', 'Men\'s T-Shirt', 1, 47),
(56, 'assets/images/fashion/product/56.jpg', 'Men\'s T-Shirt', 1, 48),
(57, 'assets/images/fashion/product/57.jpg', 'Men\'s T-Shirt', 1, 49),
(58, 'assets/images/fashion/product/58.jpg', 'Men\'s shirt', 1, 50),
(59, 'assets/images/fashion/product/59.jpg', 'Men\'s shirt', 1, 51),
(60, 'assets/images/fashion/product/60.jpg', 'Men\'s Watch - BOSS', 1, 52),
(61, 'assets/images/fashion/product/61.jpg', 'Men\'s Watch - BOSS', 1, 53),
(62, 'assets/images/fashion/product/62.jpg', 'Men\'s Watch - BOSS', 1, 54),
(63, 'assets/images/fashion/product/63.jpg', 'Women\'s Watch', 1, 55),
(64, 'assets/images/fashion/product/64.jpg', 'Women\'s Watch', 1, 56),
(65, 'assets/images/fashion/product/65.jpg', 'Home desk (New style)', 1, 57),
(66, 'assets/images/fashion/product/66.jpg', 'Home desk (New style)', 1, 58),
(67, 'assets/images/fashion/product/67.jpg', 'BB Cream (BALI Body)', 1, 59),
(68, 'assets/images/fashion/product/68.jpg', 'BB Cream (BALI Body)', 1, 60);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product_size`
--

DROP TABLE IF EXISTS `product_size`;
CREATE TABLE IF NOT EXISTS `product_size` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  `value_int` varchar(45) DEFAULT NULL,
  `value_eu` varchar(45) DEFAULT NULL,
  `value_us` varchar(45) DEFAULT NULL,
  `value_uk` varchar(45) DEFAULT NULL,
  `value_fr` varchar(45) DEFAULT NULL,
  `value_it` varchar(45) DEFAULT NULL,
  `details` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_size_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=159 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `product_size`
--

INSERT INTO `product_size` (`id`, `type`, `value_int`, `value_eu`, `value_us`, `value_uk`, `value_fr`, `value_it`, `details`) VALUES
(1, 'shoe_size_women_36', '36', '36', '5', '3', '36', '36', '22,9 cm'),
(2, 'shoe_size_women_36.5', '36,5', '36,5', '5,5', '3,5', '36,5', '36,5', '23,4 cm'),
(3, 'shoe_size_women_37', '37', '37', '6', '4', '37', '37', '23,8 cm'),
(4, 'shoe_size_women_38', '38', '38', '6,5', '5', '38', '38', '24,3 cm'),
(5, 'shoe_size_women_38.5', '38,5', '38,5', '7', '5,5', '38,5', '38,5', '24,6 cm'),
(6, 'shoe_size_women_39', '39', '39', '7,5', '6', '39', '39', '25,1 cm'),
(7, 'shoe_size_women_40', '40', '40', '8', '7', '40', '40', '25,4 cm'),
(8, 'shoe_size_women_40.5', '40,5', '40,5', '8,5', '7,5', '40,5', '40,5', '25,8 cm'),
(9, 'shoe_size_women_41', '41', '41', '9', '8', '41', '41', '26,3 cm'),
(10, 'shoe_size_women_42', '42', '42', '9,5', '9', '42', '42', '26,7 cm'),
(11, 'shoe_size_men_39', '39', '39', '7', '5', '39', '39', '25,1 cm'),
(12, 'shoe_size_men_40', '40', '40', '7,5', '6', '40', '40', '25,4 cm'),
(13, 'shoe_size_men_40.5', '40,5', '40,5', '8', '6,5', '40,5', '40,5', '25,8 cm'),
(14, 'shoe_size_men_41', '41', '41', '8,5', '7', '41', '41', '26,3 cm'),
(15, 'shoe_size_men_42', '42', '42', '9', '8', '42', '42', '26,7 cm'),
(16, 'shoe_size_men_42.5', '42,5', '42,5', '9,5', '8,5', '42,5', '42,5', '27,1 cm'),
(17, 'shoe_size_men_43', '43', '43', '10', '9', '43', '43', '27,6 cm'),
(18, 'shoe_size_men_44', '44', '44', '10,5', '10', '44', '44', '28 cm'),
(19, 'shoe_size_men_44.5', '44,5', '44,5', '11', '10,5', '44,5', '44,5', '28,4 cm'),
(20, 'shoe_size_men_45', '45', '45', '11,5', '11', '45', '45', '28,9 cm'),
(21, 'shoe_size_men_46', '46', '46', '12', '12', '46', '46', '29,3 cm'),
(22, 'shoe_size_men_46.5', '46,5', '46,5', '12,5', '12,5', '46,5', '46,5', '29,7 cm'),
(23, 'shoe_size_men_47', '47', '47', '13', '13', '47', '47', '30,1 cm'),
(24, 'shoe_size_men_48', '48', '48', '13,5', '14', '48', '48', '30,6 cm'),
(25, 'shoe_size_kids_16', '16', '16', NULL, NULL, '16', '16', '9.7 cm, 0 - 1 Year'),
(26, 'shoe_size_kids_17', '17', '17', NULL, NULL, '17', '17', '10.4 cm, 0 - 1 Year'),
(27, 'shoe_size_kids_18', '18', '18', NULL, NULL, '18', '18', '11 cm, 0 - 1 Year'),
(28, 'shoe_size_kids_19', '19', '19', NULL, NULL, '19', '19', '11.5 cm, 0 - 1 Year'),
(29, 'shoe_size_kids_20', '20', '20', NULL, NULL, '20', '20', '12.3 cm, 0 - 1 Year'),
(30, 'shoe_size_kids_21', '21', '21', NULL, NULL, '21', '21', '13 cm, 1 - 3 Year'),
(31, 'shoe_size_kids_22', '22', '22', NULL, NULL, '22', '22', '13.7 cm, 1 - 3 Year'),
(32, 'shoe_size_kids_23', '23', '23', NULL, NULL, '23', '23', '14.3 cm, 1 - 3 Year'),
(33, 'shoe_size_kids_24', '24', '24', NULL, NULL, '24', '24', '14.9 cm, 1 - 3 Year'),
(34, 'shoe_size_kids_25', '25', '25', NULL, NULL, '25', '25', '15.5 cm, 1 - 3 Year'),
(35, 'shoe_size_kids_26', '26', '26', NULL, NULL, '26', '26', '16.2 cm, 1 - 3 Year'),
(36, 'shoe_size_kids_27', '27', '27', NULL, NULL, '27', '27', '16.8 cm, 4 - 6 Year'),
(37, 'shoe_size_kids_28', '28', '28', NULL, NULL, '28', '28', '17.4 cm, 4 - 6 Year'),
(38, 'shoe_size_kids_29', '29', '29', NULL, NULL, '29', '29', '18.1 cm, 4 - 6 Year'),
(39, 'shoe_size_kids_30', '30', '30', NULL, NULL, '30', '30', '18.7 cm, 4 - 6 Year'),
(40, 'shoe_size_kids_31', '31', '31', NULL, NULL, '31', '31', '19.4 cm, 4 - 6 Year'),
(41, 'shoe_size_kids_32', '32', '32', NULL, NULL, '32', '32', '20.1 cm, 7 - 10 Year'),
(42, 'shoe_size_kids_33', '33', '33', NULL, NULL, '33', '33', '20.7 cm, 7 - 10 Year'),
(43, 'shoe_size_kids_34', '34', '34', NULL, NULL, '34', '34', '21.4 cm, 7 - 10 Year'),
(44, 'shoe_size_kids_35', '35', '35', NULL, NULL, '35', '35', '22 cm, more than 10 Year'),
(45, 'shoe_size_kids_36', '36', '36', NULL, NULL, '36', '36', '22.5 cm, more than 10 Year'),
(46, 'shoe_size_kids_36.5', '36,5', '36,5', NULL, NULL, '36,5', '36,5', '22.9 cm, more than 10 Year'),
(47, 'shoe_size_kids_37', '37', '37', NULL, NULL, '37', '37', '23.4 cm, more than 10 Year'),
(48, 'shoe_size_kids_38', '38', '38', NULL, NULL, '38', '38', '23.8 cm, more than 10 Year'),
(49, 'shoe_size_kids_38.5', '38.5', '38.5', NULL, NULL, '38.5', '38.5', '24.3 cm, more than 10 Year'),
(50, 'shoe_size_kids_39', '39', '39', NULL, NULL, '39', '39', '24.6 cm, more than 10 Year'),
(51, 'shoe_size_kids_40', '40', '40', NULL, NULL, '40', '40', '25.1 cm, more than 10 Year'),
(52, 'shoe_size_kids_40.5', '40.5', '40.5', NULL, NULL, '40.5', '40.5', '25.4 cm, more than 10 Year'),
(53, 'shoe_size_kids_41', '41', '41', NULL, NULL, '41', '41', '25.8 cm, more than 10 Year'),
(54, 'shoe_size_kids_42', '42', '42', NULL, NULL, '42', '42', '26.5 cm, more than 10 Year'),
(55, 'jeans_pants_women_30_XS', 'XS', '30', NULL, '2', '32', '36', '23 cm'),
(56, 'jeans_pants_women_32_XS', 'XS', '32', NULL, '4', '34', '38', '24 - 25 cm'),
(57, 'jeans_pants_women_34_S', 'S', '34', NULL, '6', '36', '40', '26 - 27 cm'),
(58, 'jeans_pants_women_36_S', 'S', '36', NULL, '8', '38', '42', '28 cm'),
(59, 'jeans_pants_women_36_M', 'M', '36', NULL, '8', '38', '42', '29 cm'),
(60, 'jeans_pants_women_38_M', 'M', '38', NULL, '10', '40', '44', '30 - 31 cm'),
(61, 'jeans_pants_women_40_L', 'L', '40', NULL, '12', '42', '46', '32 - 33 cm'),
(62, 'jeans_pants_women_42_L', 'L', '42', NULL, '14', '44', '48', '34 cm'),
(63, 'jeans_pants_women_44_XL', 'XL', '44', NULL, '14', '46', '50', '36 cm'),
(64, 'jeans_pants_women_46_XXL', 'XXL', '46', NULL, '16', '48', '52', '38 cm'),
(65, 'jeans_pants_women_48_XXL', 'XXL', '48', NULL, '18', '50', '54', '40 cm'),
(66, 'jeans_pants_women_50_3XL', '3XL', '50', NULL, '20', '52', '56', '42 cm'),
(67, 'jeans_pants_women_52_4XL', '4XL', '52', NULL, '22', '54', '58', '44 cm'),
(68, 'jeans_pants_women_54_4XL', '4XL', '54', NULL, '24', '56', '60', '46 cm'),
(69, 'jeans_pants_women_56_5XL', '5XL', '56', NULL, '26', '58', '62', '48 cm'),
(70, 'jeans_pants_women_58_6XL', '6XL', '58', NULL, '28', '60', '64', '50 cm'),
(71, 'jeans_pants_women_60_6XL', '6XL', '60', NULL, '30', '62', '66', '52 cm'),
(72, 'jeans_pants_women_62_7XL', '7XL', '62', NULL, '32', '64', '68', '54 cm'),
(73, 'jeans_pants_women_64_8XL', '8XL', '64', NULL, '34', '66', '70', '56 cm'),
(74, 'jeans_pants_women_66_8XL', '8XL', '66', NULL, '36', '68', '72', '58 cm'),
(75, 'clothes_women_32_XXS', 'XXS', '32', NULL, NULL, '34', '38', 'B: 76 cm; T: 63 cm'),
(76, 'clothes_women_34_XS', 'XS', '34', NULL, NULL, '36', '40', 'B: 80 cm; T: 66 cm'),
(77, 'clothes_women_36_S', 'S', '36', NULL, NULL, '38', '42', 'B: 84 cm; T: 69 cm'),
(78, 'clothes_women_38_M', 'M', '38', NULL, NULL, '40', '44', 'B: 88 cm; T: 72 cm'),
(79, 'clothes_women_40_L', 'L', '40', NULL, NULL, '42', '46', 'B: 92 cm; T: 76 cm'),
(80, 'clothes_women_42_XL', 'XL', '42', NULL, NULL, '44', '48', 'B: 96 cm; T: 80 cm'),
(81, 'clothes_women_44_XXL', 'XXL', '44', NULL, NULL, '46', '50', 'B: 100 cm; T: 85 cm'),
(82, 'clothes_women_46_3XL', '3XL', '46', NULL, NULL, '48', '52', 'B: 104 cm; T: 90 cm'),
(83, 'clothes_women_48_4XL', '4XL', '48', NULL, NULL, '50', '54', 'B: 110 cm; T: 96,5 cm'),
(84, 'clothes_women_50_5XL', '5XL', '50', NULL, NULL, '52', '56', 'B: 116 cm; T: 103 cm'),
(85, 'clothes_women_52_6XL', '6XL', '52', NULL, NULL, '54', '58', 'B: 122 cm; T: 109,5 cm'),
(86, 'clothes_women_54_7XL', '7XL', '54', NULL, NULL, '56', '60', 'B: 128 cm; T: 116 cm'),
(87, 'clothes_women_56_8XL', '8XL', '56', NULL, NULL, '58', '62', 'B: 134 cm; T: 122,5 cm'),
(88, 'clothes_men_42_XS', 'XS', '42', NULL, '32', '42', '42', 'B: 84 cm; T: 70 cm'),
(89, 'clothes_men_44_S', 'S', '44', NULL, '34', '44', '44', 'B: 88 cm; T: 74 cm'),
(90, 'clothes_men_46_S', 'S', '46', NULL, '36', '46', '46', 'B: 92 cm; T: 78 cm'),
(91, 'clothes_men_48_M', 'M', '48', NULL, '38', '48', '48', 'B: 96 cm; T: 83 cm'),
(92, 'clothes_men_50_M', 'M', '50', NULL, '40', '50', '50', 'B: 100 cm; T: 88 cm'),
(93, 'clothes_men_52_L', 'L', '52', NULL, '42', '52', '52', 'B: 104 cm; T: 93 cm'),
(94, 'clothes_men_54_XL', 'XL', '54', NULL, '44', '54', '54', 'B: 108 cm; T: 98 cm'),
(95, 'clothes_men_56_XXL', 'XXL', '56', NULL, '46', '56', '56', 'B: 112 cm; T: 102 cm'),
(96, 'clothes_men_58_3XL', '3XL', '58', NULL, '48', '58', '58', 'B: 116 cm; T: 107 cm'),
(97, 'clothes_men_60_4XL', '4XL', '60', NULL, '50', '60', '60', 'B: 120 cm; T: 111 cm'),
(98, 'clothes_men_90_XS_BIG', 'XS (BIG)', '90', NULL, '80', '90', '90', 'B: 92 cm; T: 78 cm'),
(99, 'clothes_men_94_S_BIG', 'S(BIG)', '94', NULL, '84', '94', '94', 'B: 96 cm; T: 82 cm'),
(100, 'clothes_men_98_M_BIG', 'M(BIG)', '98', NULL, '88', '98', '98', 'B: 98 cm; T: 100 cm'),
(101, 'clothes_men_102_L_BIG', 'L(BIG)', '102', NULL, '92', '102', '102', 'B: 104 cm; T: 92 cm'),
(102, 'clothes_men_106_XL_BIG', 'XL(BIG)', '106', NULL, '96', '106', '106', 'B: 108 cm; T: 97 cm'),
(103, 'clothes_men_110_XXL_BIG', 'XXL(BIG)', '110', NULL, '100', '110', '110', 'B: 112 cm; T: 101 cm'),
(104, 'clothes_men_114_3XL_BIG', '3XL(BIG)', '114', NULL, '104', '114', '114', 'B: 116 cm; T: 106 cm'),
(105, 'clothes_men_118_4XL_BIG', '4XL(BIG)', '118', NULL, '108', '118', '118', 'B: 120 cm; T: 110 cm'),
(106, 'jeans_pants_men_44_S', 'S', '44', NULL, '34', '36 - 38', '36 - 38', '27 - 28 cm'),
(107, 'jeans_pants_men_46_S', 'S', '46', NULL, '36', '38', '38', '29 cm'),
(108, 'jeans_pants_men_46_M', 'M', '46', NULL, '36', '40', '40', '30 cm'),
(109, 'jeans_pants_men_48_M', 'M', '48', NULL, '38', '40 - 42', '40 - 42', '31 - 32 cm'),
(110, 'jeans_pants_men_50_L', 'L', '50', NULL, '40', '42 - 44', '42 - 44', '33 - 34 cm'),
(111, 'jeans_pants_men_52_XL', 'XL', '52', NULL, '42', '46', '46', '36 cm'),
(112, 'jeans_pants_men_54_XL', 'XL', '54', NULL, '44', '48', '48', '38 cm'),
(113, 'jeans_pants_men_56_XXL', 'XXL', '56', NULL, '46', '50', '50', '40 cm'),
(114, 'jeans_pants_men_58_3XL', '3XL', '58', NULL, '48', '52', '52', '42 cm'),
(115, 'jeans_pants_men_60_3XL', '3XL', '60', NULL, '50', '54', '54', '44 cm'),
(116, 'jeans_pants_men_62_4XL', '4XL', '62', NULL, '52', '56', '56', '46 cm'),
(117, 'jeans_pants_men_64_5XL', '5XL', '64', NULL, '54', '58', '58', '48 cm'),
(118, 'clothes_kids_44_PRE', 'PRE', '44', 'PRE', 'PRE', 'PRE', '44', 'Prenatal'),
(119, 'clothes_kids_50_NB', 'NB', '50', 'NB', 'NB', 'NB', '50', 'New Born'),
(120, 'clothes_kids_56_1_M', '0-1m', '56', '0-1m', '0-1m', '0-1m', '56', '0-1 Month'),
(121, 'clothes_kids_62_3_M', '1-3m', '62', '1-3m', '1-3m', '1-3m', '62', '1-3 Months'),
(122, 'clothes_kids_68_6_M', '6m', '68', '6m', '6m', '6m', '68', '6 Months'),
(123, 'clothes_kids_74_9_M', '9m', '74', '9m', '9m', '9m', '74', '9 Months'),
(124, 'clothes_kids_80_12_M', '12m', '80', '12m', '12m', '12m', '80', '12 Months'),
(125, 'clothes_kids_86_18_M', '18m', '86', '18m', '18m', '18m', '86', '18 Months'),
(126, 'clothes_kids_92_24_M', '24m', '92', '24m', '24m', '24m', '92', '24 Months'),
(127, 'clothes_kids_98_3_Y', '3y', '98', '3y', '3y', '3y', '98', '3 Years'),
(128, 'clothes_kids_104_4_Y', '4y', '104', '4y', '4y', '4y', '104', '4 Years'),
(129, 'clothes_kids_110_5_Y', '5y', '110', '5y', '5y', '5y', '110', '5 Years'),
(130, 'clothes_kids_116_6_Y', '6y', '116', '6y', '6y', '6y', '116', '6 Years'),
(131, 'clothes_kids_122_7_Y', '7y', '122', '7y', '7y', '7y', '122', '7 Years'),
(132, 'clothes_kids_128_8_Y', '8y', '128', '8y', '8y', '8y', '128', '8 Years'),
(133, 'clothes_kids_134_9_Y', '9y', '134', '9y', '9y', '9y', '134', '9 Years'),
(134, 'clothes_kids_140_10_Y', '10y', '140', '10y', '10y', '10y', '140', '10 Years'),
(135, 'clothes_kids_146_11_Y', '11y', '146', '11y', '11y', '11y', '146', '11 Years'),
(136, 'clothes_kids_152_12_Y', '12y', '152', '12y', '12y', '12y', '152', '12 Years'),
(137, 'clothes_kids_158_13_Y', '13y', '158', '13y', '13y', '13y', '158', '13 Years'),
(138, 'clothes_kids_164_14_Y', '14y', '164', '14y', '14y', '14y', '164', '14 Years'),
(139, 'clothes_kids_170_15_Y', '15y', '170', '15y', '15y', '15y', '170', '15 Years'),
(140, 'clothes_kids_176_16_Y', '16y', '176', '16y', '16y', '16y', '176', '16 Years');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product_type`
--

DROP TABLE IF EXISTS `product_type`;
CREATE TABLE IF NOT EXISTS `product_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` varchar(45) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(600) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_type_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `product_type`
--

INSERT INTO `product_type` (`id`, `number`, `name`, `description`) VALUES
(1, 'women_clothing_blouses_&_tunics', 'en:Blouses & Tunics/de:Blusen & Tuniken/fr:Chemises et blouses', 'en:Women\'s Blouses, Tunics, Shirts and more/de:Damenblusen, Tuniken, Hemden und mehr/fr:Blouses, tuniques, chemises et plus pour vous mes dames'),
(2, 'all_clothing_coats', 'en:Coats/de:Mäntel/fr:Manteaux', 'en:Down Coats, Parkas, Short Coats, Trench Coats, Winter Coats, WoolCoats/de:Parkas, Trenchcoats, Kurzmäntel, Wollmäntel, Wintermäntel, Daunenmäntel/fr:Trench-coats,Parkas, Manteaux courts, Manteaux classiques, Manteaux d\'hiver, Doudounes'),
(3, 'women_clothing_dresses', 'en:Dresses/de:Kleider/fr:Robes', 'en:Casual Dresses, Cocktail Dresses, Denim Dresses, Jersey Dresses, Knitted Dresses, Maxi Dresses, Shirt Dresses, Work Dresses/de:Sommerkleider, Abendkleider, Blusenkleider, Jerseykleider, Etuikleider, Maxikleider, Jeanskleider, Strickkleider/fr:Robes de jour, Robes liongues, Robes de soirée, Robes pull, Robes chemise, Robes en jean, Robes T-shirt, Robes forreau'),
(4, 'all_clothing_jackets', 'en:Jackets/de:Jacken/fr:Veste', 'en:Athletic Jackets, Leather Jackets, Denim Jackets, Lightweight Jackets, Blazers, Gilets & Waistcoats, Capes, Down Jackets, Winter Jackets, Fleece Jackets, Outdoor Jacket/de:Leichte Jacken, Lederjacken, Jeanjacken, Blazer, Capes, Westen, Outdoorjacken, Fleece Jacken, Trainingsjacken, Winterjacken, Daumenjacken/fr:Blazers, Vestes en jean, Vestes en cuir, Bombers, Vestes légères, Vestes sans manches, Vestes d\'hiver, Vestes de survêtemen, vestes d\'extérieur'),
(5, 'all_clothing_jeans', 'en:Jeans/de:Jeans/fr:Jeans', 'en:Skinny Fit, Flares, Bootcut, Denim Shorts, Loose Fit, Slim Fit, Straight Leg/de:Skinny Fit, Slim Fit, Straight Leg, Bootcut, Jeans Shorts, Relaxed Fit, Jeggings/fr:Skinny, Droit, Slim, Boyfriend, Bootcut, Jeggings'),
(6, 'all_clothing_jumper_&_cardigans', 'en:Jumper & Cardigans/de:Pullover und Strickjacken/fr:Pulls & Gilets', 'en:Athletic Jackets, Hoodies, Jumpers, Sweatshirts, Cardigans, Fleece Jumpers/de:Strickjacken, Strickpullover, Swearjacken, Sweatshirts, Hoodies, Fleecepullover/fr:Pulls, Sweats, Gilets, Ponchos, Polaires'),
(7, 'women_clothing_lingerie_&_nightwear', 'en:Lingerie & Nightwear/de:Wäsche/fr:Lingerie', 'en:Bras, Dressing Gowns, Knickers, Nightwear, Suspenders, Shapewear, Vest & Camisols/de:BHs, Oberteile, Unterteile, Nachtwäsche, Strumpfhalter, Shapewear, Bademändel/fr:Soutiens-gorge, Culottes et bas, Chaussetes et collants, Lingerie sculptante, Pyjamas et nuisettes, Bodys, Sport'),
(8, 'women_clothing_skirts', 'en:Skirts/de:Röcke/fr:Jupes', 'en:A-Line Skirts, Pencil Skirts, Denim Skirts, Pleated Skirts, Leather Skirts, Mini Skirts, Maxi Skirts/de:Jeansröcke, Maxiröcke, Faltenröcke, A-Linienröcke, Miniröcke, Bleistiftröcke, Lederröcke/fr:Jupes courtes, Jupes longues, Jupes enjean, Jupes plissées, Jupes crayon,Jupes Trapèze, Jupes portefeuille, Jupes en cuir'),
(9, 'all_clothing_tops_&_t-shirts', 'en:Tops & T-Shirts/de:Shirts & Tops/fr:T-Shirts & tops', 'en:Long Sleeve Toops, Polo Shirts, Vest Tops, T-Shirts/de:T-Shirts, Tops, Poloshirts, Langarmshirts/fr:Basiques, Tops, Manches longues, Imprimés, Bodys, Polos, Sport'),
(10, 'all_clothing_trousers_&_shorts', 'en:Trousers & Shorts/de:Hosen/fr:Pantalons, Leggings & shorts', 'en:Chinos, Joggers & Sweats, Leggings, Playswits & Jumpsuits, Short, Trousers/de:Chinos, Stoffhosen, Shorts, Leggings, Jogginghosen/fr:Pantalons classiques, Chinos, Pantalons en cuir, Leggings, Joggings, Shorts et bermudas, Short en jean'),
(11, 'all_clothing_swimwear', 'en:Swimwear/de:Bademode/fr:Maillots de bain', 'en:Swimsuits, Bikinis, Bathrobes, Beach Accessories/de:Bikinis, Badeanzüge, Bademäntel, Standaccessoires/fr:2 pièces, 1 pièce,Peignoirs, Accessoires de plage'),
(12, 'women_shoes_ankle_boots', 'en:Ankle Boots/de:Stiefeletten/fr:Bottines', 'en:Classic, Cowboy & Biker, Lace up, Platform, Wedge/de:Klassische Stiefeletten, Schnürstiefeletten, Cowboy-/Bikerstiefeletten, Keilstiefeletten, Plateaustiefeletten, Ankle Boots/fr:Bottines, Bottines à talons, Compensées à plateau, Bottines à lacets, Bottines rock et santiags'),
(13, 'women_shoes_ballet_pumps', 'en:Ballet Pumps/de:Ballerines/fr:Ballerines', 'en:Ankle cuff, Ankle Strap, Classic, Foldable, Peep-Toe, Sling-back/de:Klassische Ballerinas, Faltbare Ballerinas, Riemchenballerinas, Peeptoe Ballerinas, Schaftballerinas, Sling-Ballerinas/fr:Ballerines, Babies, Ballerines à bride, Ballerines à bout ouvert'),
(14, 'all_shoes_boots', 'en:Boots/de:Stiefel/fr:Bottes', 'en:Classic, Cowboy & Biker, Heeled Boots, Lace up, Platform Boots, Snow Boots, Thigh high Boots, Wedge, Wellies/de:Klassische Stiefel, Cowboy & Biker Boots, Overknees, Schnürstiefel, Keilstiefel, Plateaustiefel, Gummistiefel, Snowboots/fr:Bottes, Cuissardes, Bottes à talons, Compensées à plateau, Bottes à Lacets, Santiags, Bottes de pluie, Bottes de neige'),
(15, 'all_shoes_flats_&_lace-ups', 'en:Flats & Lace-ups/de:Halb- & Schnürschuhe/fr:Espadrilles & Mocassins', 'en:Boatshoes, Brogues & Lace-Ups, Espadrilles, Loafers, Moccassins, Sporty Lace-Ups/de:Elegante Schnürer, Sportlische Schnürer, Bootschuhe, Slipper, Mokassins, Espadrills/fr:Espadrilles, Mocassins, Slip-ons, Chaussures bateau, Richelieu, Derbies'),
(16, 'all_shoes_flip_flops_&_beach_shoes', 'en:Sandals, Flip Flops & Beach Shoes/de:Sandalen & Badeschuhe/fr:Sandales et nu-', 'en:Beach Shoes & Jelly Shoes, Flip Flops, Mules, Clogs, Sandals, Ankle Cuff, Thong, Heeled Sandals, Platform Sandals, Strappy, Wedge/de:Riemschensandalen, Zehentrenner, Keilsandeletten, Plateausandeletten, Schaftsandalen, Bade-Zehentrenner, Badesandalen/fr:Sandales, Sandales à talons, Compensées à plateforme, Tongs, Sandales à bain'),
(17, 'all_shoes_slippers', 'en:Slippers/de:Hausschuhe/fr:Pantoufles', 'en:Slippers for the entirer family/de:Hausschuhe für die ganze Familie/fr:Pantoufles pour toute la famille'),
(18, 'girl_kids_clothing_dresses', 'en:Dresses/de:Kleider/fr:Robes', 'en:Girl\'s Dresses/de:Kleider für Mädchen/fr:Robe pour nos princesses'),
(19, 'all_kids_clothing_jackets', 'en:Jackets/de:Kinderjacken/fr:Manteaux et Vestes', 'en:Gilet & Waistcoats, Rain Coats, Lightweight Jackets, Winter Jackets, Coats, Outdoor Jackets/de:Übergangsjacken, Regenjacken, Fleece Jacken, Jeans- & Lederjacken, Blazer, Outdoorjacken, Westen, Winterjacken, Daunenjacken, Parkas, Mäntel/fr:Veste de mi-saison, en jean, cuir, Trench-coats, Imperméables, Parkas, Blazers, Manteaux classiques et d\'hiver, Doudounes, Vestes sans manches et de sport'),
(20, 'all_kids_clothing_jumpers_&_knitwear', 'en:Jumpers & Knitwear/de:Pullover & Strick/fr:Pulls et gilets', 'en:Cardigans, Jumpers, Sweat & Tops/de:Pullover, Sweatjacken, Strickjacken/fr:Pulls, Sweats, Sweats Zippés, Gilets'),
(21, 'all_accessories_bags', 'en:Bags/de:Taschen/fr:Sacs', 'en:Clutch Bags, Designer Bags, Handbags, Tote Bags, Shoulder Bags, Rucksacks, Sport- & Travel Bags, Laptop Bags, Washbags/de:Handtaschen, Clutches & Abentaschen, Shopper, Umhängetaschen, Business- & Laptoptaschen, Sporttaschen, Rücksäcke, Kleintaschen, Reisetaschen/fr:Sac à main, Sac à bandoulieres, Cabas, Pochettes et Sacs de sourée, Sac bananes, Sac laptop, Sac à dos, Sac de sport'),
(22, 'all_accessories_belts', 'en:Belts/de:Gürtel/fr:Ceintures', 'en:Belts for all occasions/de:Gürtel klassisch, casual, Taillengürtel, Flechtgürtel/fr: Ceintures pour toutes les occcasions et styles'),
(23, 'all_accessories_gloves', 'en:Gloves/de:Handschuhe/fr:Gants', 'en:Gloves for all seasons and all occasions/de:Handschuhe für alle Jahreszeiten und alle Anlässe/fr:Des gants pour toutes les saisons et toutes les occasions'),
(24, 'all_accessories_hats_& caps', 'en:Hats & Caps/de:Mützen, Hüte & Caps/fr:Casquettes, Chapeaux,  Bonnets et cache', 'en:Hats, Caps & Earmuffs for all occasions/de:Mützen, Caps & Ohrenwärmer für alle Anlässe und Jahrzeiten/fr:Bonnets,  Chapeaux,  et cache-oreilles pour toutes les aoccasions et toutes les saisons'),
(25, 'all_accessories_watches', 'en:Watches/de:Uhren/fr:Montres', 'en:Wachtes for mens, womens & kids/de:Uhren für alle Generationen/fr:Des montres pour mesdames ,messieurs mais aussi les plus jeunes'),
(26, 'all_accessories_jewellery', 'en:Jewellery/de:Schmuck/fr:Bijoux', 'en:Jewellery for Ladies and  Gentlemen/de:Schmuck für Damen und Herren mit Stil/fr:Complete ton style avec des bijoux personalisés'),
(27, 'all_accessories_others', 'en:Others/de:Sonstige/fr:Autres', 'en:More accessories/de:Weitere Zubehör/fr:Plus d\'accessoires'),
(28, 'all_kids_clothing_others', 'en:Others/de:Sonstige/fr:Autres', 'en:More clothes/de:Weitere Bekleidungen/fr:Plus de vêtements'),
(29, 'all_shoes_others', 'en:Others/de:Sonstige/fr:Autres', 'en:More Shoes/de:Weitere Schuhen/fr:Plus de chaussures'),
(30, 'women_clothing_others', 'en:Others/de:Sonstige/fr:Autres', 'en:More clothes/de:Weitere Bekleidungen/fr:Plus de vêtements'),
(31, 'all_clothing_others', 'en:Others/de:Sonstige/fr:Autres', 'en:More clothes/de:Weitere Bekleidungen/fr:Plus de vêtements'),
(32, 'men_clothing_underwear', 'en:Underwear/de:Unterwäsche/fr:Sous-vêtements', 'en:Underpants, Undershirts, Nightwear, Bathrobes/de:Unterhosen, Unterhemden, Nachtwäsche, Shapewear, Bademäntel/fr:Caleçons et slips, Chaussettes, Maillots de corps, Peignoirs'),
(33, 'men_clothing_suits_&_ties', 'en:Suits & Ties/de:Herrenanzüge & Krawatten/fr:Costumes et cravates', 'en:Suit Jackets, Suit Trousers, Suits, Waistcoats, Business Shirts, Ties & Accessories/de:Kombinationen, Anzugsakkos, Hemden, Anzughosen, Anzugwesten, Krawatten & Accessoires/fr:Blazers, Pantalons de costume, Chemises classiques, Costumes, Gilets de costume, Cravates et plus d\'accessoires'),
(34, 'all_shoes_outdoor_shoes', 'en:Outdoor Shoes/de:Outdoor-Schuhe/fr:Chaussures de marche', 'en:Hiking Boots, Mountain Boots, Trail Shoes, Walking Boots/de:Wanderschuhe, Bergschuhe, Wanderschuhe, Wanderschuhe/fr:Bottes de randonnée, Bottes de montagne, Chaussures de trail, Bottes de marche'),
(35, 'all_shoes_sport_shoes', 'en:Sports Shoes/de:Sportschuhe/fr:Chaussures de sport', 'en:Shoes for all seasons, all activities and all ages/de:Schuhe für alle Jahreszeiten, alle Aktivitäten und jedes Alter/fr:Des chaussures pour toutes les saisons, toutes les activités et tous les âges');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `product_variant`
--

DROP TABLE IF EXISTS `product_variant`;
CREATE TABLE IF NOT EXISTS `product_variant` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_variant_id_UNIQUE` (`id`),
  KEY `fk_product_variant_product1_idx` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `product_variant`
--

INSERT INTO `product_variant` (`id`, `name`, `color`, `product_id`) VALUES
(1, 'Damenpumps - V0', 'maroon', 1),
(2, 'Damenpumps - V1', 'pink', 1),
(3, 'Damenpumps - V2', 'red', 1),
(4, 'Ballerinas - V0', 'red', 2),
(5, 'Riemensandalette - V0', 'black', 3),
(6, 'Riemensandalette - V1', 'pink', 3),
(7, 'Riemensandalette - V2', 'red', 3),
(8, 'Girl\'s slippers - V0', 'blue', 4),
(9, 'Girl\'s slippers - V1', 'grey', 4),
(10, 'Boy\'s sneakers (CL)- V0', 'black', 5),
(11, 'Boy\'s sneakers (CL)- V1', 'orange', 5),
(12, 'Boy\'s sneakers (CL)- V2', 'green', 5),
(13, 'Boy\'s sneakers (CL)- V3', 'red', 5),
(14, 'Boy\'s sneakers (CL)- V4', 'black', 5),
(15, 'Boy\'s sneakers (CL)- V5', 'black', 5),
(16, 'Multicolor boy\'s sneakers (CL) - V0', 'orange', 6),
(17, 'Multicolor boy\'s sneakers (CL) - V1', 'white', 6),
(18, 'Multicolor boy\'s sneakers (CL) - V2', 'grey', 6),
(19, 'Boy\'s sport sneakers (CL) - V0', 'red', 7),
(20, 'Boy\'s sport sneakers (CL) - V1', 'white', 7),
(21, 'Boy\'s sport sneakers (CL) - V2', 'black', 7),
(22, 'football shoe (CL) - V0', 'green', 8),
(23, 'football shoe (CL) - V1', 'blue', 8),
(24, 'football shoe (CL) - V2', 'red', 8),
(25, 'football shoe (CL) - V3', 'orange', 8),
(26, 'girl\'s belt sandal - V0', 'blue', 9),
(27, 'girl\'s belt sandal - V1', 'pink', 9),
(28, 'girl\'s LULU belt sandal - V0', 'pink', 10),
(29, 'girl\'s LULU belt sandal - V1', 'violet', 10),
(30, 'girl\'s LULU belt sandal - V2', 'blue', 10),
(31, 'Women\'s sport sneackers - V0', 'yellow', 11),
(32, 'Women\'s sport sneackers - V1', 'red', 11),
(33, 'Women\'s slippers (CL) - V0', 'yellow', 12),
(34, 'Women\'s slippers (CL) - V1', 'grey', 12),
(35, 'Women\'s slippers (CL) - V2', 'maroon', 12),
(36, 'Women\'s Mickey Slippers (CL) - V0', 'blue', 13),
(37, 'Women\'s Mickey Slippers (CL) - V1', 'red', 13),
(38, 'Men\'s sandal (CL) - V0', 'black', 14),
(39, 'Men\'s sandal (CL) - V1', 'grey', 14),
(40, 'LONG DRESS NEW - Maxikleid - (CL) - V0', 'black', 15),
(41, 'Women\'s Overalls Jeans - Front (CL) - V0', 'black', 16),
(42, 'Women\'s Demin Jean - V0', 'black', 17),
(43, 'Women\'s Demin Jean - V1', 'blue', 17),
(44, 'Women\'s Demin Jean - V2', 'grey', 17),
(45, 'Women\'s Demin Jean - V3', 'blue', 17),
(46, 'Men\'s T-Shirt - V0', 'white', 18),
(47, 'Men\'s T-Shirt - V1', 'white', 18),
(48, 'Men\'s T-Shirt - V2', 'white', 18),
(49, 'Men\'s T-Shirt - V3', 'black', 18),
(50, 'Men\'s Shirt - V0', 'pink', 19),
(51, 'Men\'s Shirt - V0', 'white', 20),
(52, 'Men\'s Watch - BOSS  - V0', 'blue', 21),
(53, 'Men\'s Watch - BOSS  - V1', 'maroon', 21),
(54, 'Men\'s Watch - BOSS  - V2', 'black', 21),
(55, 'Women\'s Watch - V0', 'yellow', 22),
(56, 'Women\'s Watch - V1', 'blue', 22),
(57, 'Home desk (New style) - V0', 'maroon', 23),
(58, 'Home desk (Cameroon style) - V1', 'maroon', 23),
(59, 'BB Cream (BALI Body) - V0', 'maroon', 24),
(60, 'BB Cream (BALI Body) - V1', 'maroon', 24);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'USER'),
(2, 'ADMIN'),
(3, 'PM');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `supplier`
--

DROP TABLE IF EXISTS `supplier`;
CREATE TABLE IF NOT EXISTS `supplier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `contract_start_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(45) DEFAULT NULL,
  `phone_number` varchar(45) DEFAULT NULL,
  `tel_number` varchar(45) DEFAULT NULL,
  `address_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `supplier_id_UNIQUE` (`id`),
  KEY `fk_supplier_address1_idx` (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `supplier`
--

INSERT INTO `supplier` (`id`, `number`, `name`, `contract_start_date`, `email`, `phone_number`, `tel_number`, `address_id`) VALUES
(1, 'bitis_00001', 'Biti\'s', '2019-12-27 15:53:15', 'export@bitis.com.vn ', '+84 966158666', '+84 251 3814624', 3),
(2, 'ha_meem_group_00002', 'Ha-Meem Group', '2019-12-27 15:53:15', 'delwar@hameemgroup.com', '+880-2-8170592', '+880-2-8170593', 4);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `supplier_delivery`
--

DROP TABLE IF EXISTS `supplier_delivery`;
CREATE TABLE IF NOT EXISTS `supplier_delivery` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` varchar(45) NOT NULL,
  `date` datetime DEFAULT NULL,
  `noa` bigint(20) DEFAULT NULL COMMENT 'noa: number of articles',
  `price` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `supplier_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `supplier_delivery_id_UNIQUE` (`id`),
  KEY `fk_supplier_delivery_supplier1_idx` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `supplier_invoice`
--

DROP TABLE IF EXISTS `supplier_invoice`;
CREATE TABLE IF NOT EXISTS `supplier_invoice` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `number` varchar(45) NOT NULL,
  `price` float NOT NULL,
  `paid_price` float NOT NULL DEFAULT '0',
  `date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('pending','processed','done','canceled') DEFAULT NULL,
  `supplier_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `supplier_invoice_id_UNIQUE` (`id`),
  KEY `fk_supplier_invoice_supplier1_idx` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(80) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `gender` enum('M','F') NOT NULL,
  `birthday` date NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `is_activ` tinyint(4) NOT NULL DEFAULT '1',
  `creation_timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `email`, `first_name`, `middle_name`, `last_name`, `gender`, `birthday`, `password`, `is_activ`, `creation_timestamp`) VALUES
(23, 'fokokouti@insystems.de', 'Tony', 'Nonomo', 'Montana', 'M', '1990-01-06', '$2a$08$buxpIEOkOzE.IihigVMgfODNiRH6rOafLJXDGhlFYIvtfbfNKiS/K', 1, '2020-01-30 12:03:54'),
(24, 'boris.foko@chrislaurenz.de', 'boris', 'kouti', 'foko', 'M', '1990-12-01', '$2a$08$nZsk8w576vmIxjMH5yJbmudKSriXhWrESBo6mE9d0qY2ZAp1AF3X6', 1, '2020-02-22 23:44:30'),
(29, 'boris.kouti@gmail.com', 'Cecile', 'Michella', 'Tesson', 'F', '1993-10-12', '$2a$08$DdzxnEdjfaA6UISk3yrmcuHwueLvqJnRMCeASHa0Vn3E23kBqNQE6', 1, '2020-03-18 20:34:04'),
(30, 'bemyarobinson@ymail.com', 'Robinson', 'Bemya ', 'Ngouo', 'M', '1991-04-07', '$2a$08$yJHwJynWDWAdk4/Q2IXNJuEJlderXCL2CKw9Qr2fT895MQcUJSnna', 1, '2020-03-22 20:55:34');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_has_role`
--

DROP TABLE IF EXISTS `user_has_role`;
CREATE TABLE IF NOT EXISTS `user_has_role` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_user_has_role_role1_idx` (`role_id`),
  KEY `fk_user_has_role_user1_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Daten für Tabelle `user_has_role`
--

INSERT INTO `user_has_role` (`user_id`, `role_id`) VALUES
(23, 1),
(29, 1),
(30, 1),
(24, 2);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `verification`
--

DROP TABLE IF EXISTS `verification`;
CREATE TABLE IF NOT EXISTS `verification` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `token` varchar(45) NOT NULL,
  `description` enum('A','R','O') NOT NULL COMMENT 'A = Activate Account\nR = Reset Password\nO = Other',
  `creation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_verification_user1_idx` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `article`
--
ALTER TABLE `article`
  ADD CONSTRAINT `fk_article_product1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_article_supplier_delivery1` FOREIGN KEY (`supplier_delivery_id`) REFERENCES `supplier_delivery` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_article_supplier_invoice1` FOREIGN KEY (`supplier_invoice_id`) REFERENCES `supplier_invoice` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_customer_order1` FOREIGN KEY (`customer_order_id`) REFERENCES `customer_order` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_product_size1` FOREIGN KEY (`product_size_id`) REFERENCES `product_size` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_product_variant1` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variant` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `blog`
--
ALTER TABLE `blog`
  ADD CONSTRAINT `fk_blog_user1` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `fk_customer_address1` FOREIGN KEY (`invoice_address_id`) REFERENCES `address` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_customer_address2` FOREIGN KEY (`delivery_address_id`) REFERENCES `address` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_customer_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `customer_order`
--
ALTER TABLE `customer_order`
  ADD CONSTRAINT `fk_customer_order_customer1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_customer_order_customer_order_invoice1` FOREIGN KEY (`customer_order_invoice_id`) REFERENCES `customer_order_invoice` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `customer_order_delivery`
--
ALTER TABLE `customer_order_delivery`
  ADD CONSTRAINT `fk_customer_order_delivery_customer_order1` FOREIGN KEY (`customer_order_id`) REFERENCES `customer_order` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `customer_payment`
--
ALTER TABLE `customer_payment`
  ADD CONSTRAINT `fk_customer_payment_customer_order_invoice1` FOREIGN KEY (`customer_order_invoice_id`) REFERENCES `customer_order_invoice` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_customer_payment_customer_payment_method1` FOREIGN KEY (`customer_payment_method_id`) REFERENCES `customer_payment_method` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `customer_payment_method`
--
ALTER TABLE `customer_payment_method`
  ADD CONSTRAINT `fk_customer_payment_method_customer1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `fk_post_blog1` FOREIGN KEY (`blog_id`) REFERENCES `blog` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_post_user1` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `post_has_comment`
--
ALTER TABLE `post_has_comment`
  ADD CONSTRAINT `fk_post_has_post_post1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_post_has_post_post2` FOREIGN KEY (`comment_id`) REFERENCES `post` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `fk_product_product_category1` FOREIGN KEY (`product_category_id`) REFERENCES `product_category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_product_product_collection1` FOREIGN KEY (`product_collection_id`) REFERENCES `product_collection` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_product_product_group1` FOREIGN KEY (`product_group_id`) REFERENCES `product_group` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_product_product_type1` FOREIGN KEY (`product_type_id`) REFERENCES `product_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_product_supplier1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `product_has_customer_order`
--
ALTER TABLE `product_has_customer_order`
  ADD CONSTRAINT `fk_product_has_customer_order_customer_order1` FOREIGN KEY (`customer_order_id`) REFERENCES `customer_order` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_product_has_customer_order_product1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `product_has_customer_order_product_size1_idx` FOREIGN KEY (`product_size_id`) REFERENCES `product_size` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `product_has_customer_order_product_variant1_idx` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variant` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;;
--
-- Constraints der Tabelle `product_has_discount`
--
ALTER TABLE `product_has_discount`
  ADD CONSTRAINT `fk_product_has_discount_discount1` FOREIGN KEY (`discount_id`) REFERENCES `discount` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_product_has_discount_product1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `product_has_product_size`
--
ALTER TABLE `product_has_product_size`
  ADD CONSTRAINT `fk_product_has_product_size_product1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_product_has_product_size_product_size1` FOREIGN KEY (`product_size_id`) REFERENCES `product_size` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `product_picture`
--
ALTER TABLE `product_picture`
  ADD CONSTRAINT `fk_product_picture_product_variant1` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variant` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `product_variant`
--
ALTER TABLE `product_variant`
  ADD CONSTRAINT `fk_product_variant_product1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `supplier`
--
ALTER TABLE `supplier`
  ADD CONSTRAINT `fk_supplier_address1` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `supplier_delivery`
--
ALTER TABLE `supplier_delivery`
  ADD CONSTRAINT `fk_supplier_delivery_supplier1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `supplier_invoice`
--
ALTER TABLE `supplier_invoice`
  ADD CONSTRAINT `fk_supplier_invoice_supplier1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `user_has_role`
--
ALTER TABLE `user_has_role`
  ADD CONSTRAINT `fk_user_has_role_role1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_user_has_role_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `verification`
--
ALTER TABLE `verification`
  ADD CONSTRAINT `fk_verification_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

DELIMITER $$
--
-- Ereignisse
--
DROP EVENT IF EXISTS `expire_token`$$
CREATE DEFINER=`k123354_bkfgoal`@`%` 
	EVENT `expire_token` 
	ON SCHEDULE EVERY 1 DAY STARTS CURRENT_TIMESTAMP 
	ON COMPLETION PRESERVE ENABLE 
	DO DELETE FROM `verification_tokens` 
		WHERE `creation_date` < DATE_SUB(NOW(), INTERVAL 1 DAY)$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
