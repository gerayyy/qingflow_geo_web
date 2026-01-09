-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `qingflow_geo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 切换到创建的数据库
USE `qingflow_geo`;

-- 创建文章状态枚举类型
CREATE TABLE IF NOT EXISTS `PostStatus` (
  `value` ENUM('draft', 'published', 'archived') NOT NULL PRIMARY KEY
);

-- 插入枚举值
INSERT IGNORE INTO `PostStatus` (`value`) VALUES ('draft'), ('published'), ('archived');

-- 创建 Post 表
CREATE TABLE IF NOT EXISTS `Post` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(191) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'published',
  `publishedAt` DATETIME NOT NULL,
  `content` JSON NOT NULL,
  `geoData` JSON NULL,
  `seoMeta` JSON NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建索引
CREATE INDEX `post_slug_key` ON `Post` (`slug`);
CREATE INDEX `post_status_idx` ON `Post` (`status`);
CREATE INDEX `post_publishedAt_idx` ON `Post` (`publishedAt`);
