-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 23, 2025 at 03:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `adeen`
--

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE `blocks` (
  `id` int(11) NOT NULL,
  `blockerId` int(11) NOT NULL,
  `blockedId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blocks`
--

INSERT INTO `blocks` (`id`, `blockerId`, `blockedId`, `createdAt`) VALUES
(8, 1, 11, '2025-09-23 11:15:22'),
(9, 1, 10, '2025-09-23 12:05:28');

-- --------------------------------------------------------

--
-- Table structure for table `follows`
--

CREATE TABLE `follows` (
  `id` int(11) NOT NULL,
  `followerId` int(11) NOT NULL,
  `followingId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `follows`
--

INSERT INTO `follows` (`id`, `followerId`, `followingId`, `createdAt`) VALUES
(5, 10, 1, '2025-09-22 10:36:07'),
(7, 10, 12, '2025-09-23 07:14:46'),
(8, 10, 11, '2025-09-23 07:14:52'),
(9, 10, 13, '2025-09-23 07:14:55'),
(10, 10, 14, '2025-09-23 07:15:03'),
(11, 1, 14, '2025-09-23 08:00:16'),
(12, 1, 10, '2025-09-23 08:00:23'),
(13, 1, 1, '2025-09-23 08:21:23'),
(15, 11, 12, '2025-09-23 11:33:02'),
(17, 1, 12, '2025-09-23 12:45:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `refresh_token` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `followersCount` int(11) DEFAULT 0,
  `followingCount` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `refresh_token`, `created_at`, `updated_at`, `followersCount`, `followingCount`) VALUES
(1, 'adeen123', 'adeen@gmail.com', '$2b$10$7nZt6WqC0zhXC0ZUZuIiJOiPyjhrSE3bCXqZA0gMTyV8rDYuh7X16', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZGVlbkBnbWFpbC5jb20iLCJpYXQiOjE3NTg1MjY5MTUsImV4cCI6MTc1OTEzMTcxNX0.PQ_RaFvUXdZvBsjQxBLHTj9CxdKllH_KF5HfN4EjHRM', '2025-09-22 07:02:28', '2025-09-23 12:45:18', 2, 4),
(10, 'umer', 'umer@gmail.com', '$2b$10$Zbs1PVMQxJGgtO./uyBiAeFneWPH/Ir8qLXFiIW9fbhrs8X8Q0E46', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoidW1lckBnbWFpbC5jb20iLCJpYXQiOjE3NTg1NDQ2MzQsImV4cCI6MTc1OTE0OTQzNH0.NVJFgnCbTCO65dICOnkVAWdSV58wwEb5wYzNHYU8LwU', '2025-09-22 10:23:33', '2025-09-23 08:00:23', 1, 4),
(11, 'azam', 'azam@gmail.com', '$2b$10$CmslKCT9lvnLIS9gJ.CLA.eH1cCsTrOGsBOkqQuOdIE9R.CDC6A8G', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoiYXphbUBnbWFpbC5jb20iLCJpYXQiOjE3NTg2MTE1OTcsImV4cCI6MTc1OTIxNjM5N30.onuDXmEotJ2p7aPVXThgyQSYyGsYzq0zwcIHWIDIzyY', '2025-09-23 07:12:58', '2025-09-23 11:33:02', 1, 1),
(12, 'affan', 'affan@gmail.com', '$2b$10$6yDNX1Y7kNX3iwiSHKsoLuyCTPj4ucG7V2rfbwmufp04i/x5q0Pfi', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImVtYWlsIjoiYWZmYW5AZ21haWwuY29tIiwiaWF0IjoxNzU4NjExNjE2LCJleHAiOjE3NTkyMTY0MTZ9.aw3MDpambasxqGCK8UEIeIAe_B6V1xh8PdXhW4v9u_E', '2025-09-23 07:13:26', '2025-09-23 12:45:18', 3, 0),
(13, 'ali', 'ali@gmail.com', '$2b$10$F3w1abJtgpV/y.mC/N9jE.phIX1OVbxupWNH8HJ2RKzw7ltJmcw/q', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoiYWxpQGdtYWlsLmNvbSIsImlhdCI6MTc1ODYxMTYzNiwiZXhwIjoxNzU5MjE2NDM2fQ.dmUkG55n2zA9RcjW-HNgBgRs2lCmRUN0ru5kbLmAwxk', '2025-09-23 07:13:49', '2025-09-23 07:14:55', 1, 0),
(14, 'salman', 'salman@gmail.com', '$2b$10$Q5RU7yVXzMNiK/1vhqqXfeuQVzbO3w6R6Nyogt5BgN9Nj16mUtU4q', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoic2FsbWFuQGdtYWlsLmNvbSIsImlhdCI6MTc1ODYxMTY2MCwiZXhwIjoxNzU5MjE2NDYwfQ.UE2fWSMcxSIrTDsZE9Sese4x8gg4t1IF7wY1H3D9Y5U', '2025-09-23 07:14:11', '2025-09-23 08:00:16', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `url` varchar(500) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `likesCount` int(11) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `title`, `description`, `url`, `createdBy`, `likesCount`, `createdAt`) VALUES
(1, 'jhello', 'diwhdknk cmqd oq', '1758541847216-892591705.mp4', 10, 2, '2025-09-22 11:50:47'),
(2, 'Travel Vlog', 'Exploring the mountains', 'travel_vlog.mp4', 12, 2, '2025-09-23 03:10:00'),
(3, 'Cooking Pasta', 'Delicious homemade pasta recipe', 'cooking_pasta.mp4', 10, 1, '2025-09-23 03:11:00'),
(4, 'Tech Review', 'Latest smartphone review', 'tech_review.mp4', 1, 2, '2025-09-23 03:12:00'),
(5, 'Gaming Session', 'Playing action game live', 'gaming_session.mp4', 10, 2, '2025-09-23 03:13:00'),
(6, 'Workout Routine', 'Full body exercise plan', 'workout_routine.mp4', 1, 1, '2025-09-02 03:14:00'),
(7, 'Music Cover', 'Singing a popular song', 'music_cover.mp4', 11, 2, '2025-09-23 03:15:00'),
(8, 'DIY Project', 'Building a wooden table', 'diy_project.mp4', 1, 2, '2025-09-23 03:16:00'),
(9, 'Pet Fun', 'Dog playing in the park', 'pet_fun.mp4', 10, 1, '2025-09-23 03:17:00'),
(10, 'Car Review', 'Reviewing electric car', 'car_review.mp4', 12, 2, '2025-09-23 03:18:00'),
(11, 'Coding Tutorial', 'JavaScript basics explained', 'coding_tutorial.mp4', 11, 1, '2025-09-23 03:19:00'),
(12, 'City Tour', 'Walking through downtown', 'city_tour.mp4', 11, 2, '2025-09-23 03:20:00'),
(13, 'Makeup Tutorial', 'Everyday makeup look', 'makeup_tutorial.mp4', 10, 2, '2025-09-23 03:21:00'),
(14, 'Food Review', 'Tasting street food', 'food_review.mp4', 1, 1, '2025-09-23 03:22:00'),
(15, 'Nature Walk', 'Birds and trees in the forest', 'nature_walk.mp4', 10, 2, '2025-09-23 03:23:00'),
(16, 'Photography Tips', 'How to take better portraits', 'photography_tips.mp4', 13, 2, '2025-09-23 03:24:00'),
(17, 'Podcast Episode', 'Discussion about tech trends', 'podcast_episode.mp4', 10, 1, '2025-09-23 03:25:00'),
(18, 'Dance Performance', 'Hip-hop freestyle dance', 'dance_performance.mp4', 1, 2, '2025-09-23 03:26:00'),
(19, 'Cooking Curry', 'Spicy chicken curry recipe', 'cooking_curry.mp4', 10, 2, '2025-09-23 03:27:00'),
(20, 'Book Review', 'Review of a popular novel', 'book_review.mp4', 13, 1, '2025-09-23 03:28:00'),
(21, 'Art Drawing', 'Sketching a landscape', 'art_drawing.mp4', 10, 4, '2025-09-23 03:29:00');

-- --------------------------------------------------------

--
-- Table structure for table `video_likes`
--

CREATE TABLE `video_likes` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `videoId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `video_likes`
--

INSERT INTO `video_likes` (`id`, `userId`, `videoId`, `createdAt`) VALUES
(2, 10, 1, '2025-09-22 13:16:55'),
(4, 1, 1, '2025-09-22 13:19:31'),
(7, 1, 2, '2025-09-23 03:10:10'),
(8, 10, 2, '2025-09-23 03:10:20'),
(9, 1, 3, '2025-09-23 03:11:10'),
(10, 1, 4, '2025-09-23 03:12:10'),
(11, 10, 4, '2025-09-23 03:12:20'),
(12, 1, 5, '2025-09-23 03:13:10'),
(13, 10, 5, '2025-09-23 03:13:20'),
(14, 1, 6, '2025-09-02 03:14:10'),
(15, 1, 7, '2025-09-23 03:15:10'),
(16, 10, 7, '2025-09-23 03:15:20'),
(17, 1, 8, '2025-09-23 03:16:10'),
(18, 10, 8, '2025-09-23 03:16:20'),
(19, 1, 9, '2025-09-23 03:17:10'),
(20, 1, 10, '2025-09-23 03:18:10'),
(21, 10, 10, '2025-09-23 03:18:20'),
(22, 1, 11, '2025-09-23 03:19:10'),
(23, 1, 12, '2025-09-23 03:20:10'),
(24, 10, 12, '2025-09-23 03:20:20'),
(25, 1, 13, '2025-09-23 03:21:10'),
(26, 10, 13, '2025-09-23 03:21:20'),
(27, 1, 14, '2025-09-23 03:22:10'),
(28, 1, 15, '2025-09-23 03:23:10'),
(29, 10, 15, '2025-09-23 03:23:20'),
(30, 1, 16, '2025-09-23 03:24:10'),
(31, 10, 16, '2025-09-23 03:24:20'),
(32, 1, 17, '2025-09-23 03:25:10'),
(33, 1, 18, '2025-09-23 03:26:10'),
(34, 10, 18, '2025-09-23 03:26:20'),
(35, 1, 19, '2025-09-23 03:27:10'),
(36, 10, 19, '2025-09-23 03:27:20'),
(37, 1, 20, '2025-09-23 03:28:10'),
(39, 10, 21, '2025-09-23 03:29:20'),
(41, 12, 21, '2025-09-23 08:24:14'),
(47, 11, 21, '2025-09-23 12:05:31'),
(48, 1, 21, '2025-09-23 12:06:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_block` (`blockerId`,`blockedId`),
  ADD KEY `blockedId` (`blockedId`);

--
-- Indexes for table `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_follow` (`followerId`,`followingId`),
  ADD KEY `followingId` (`followingId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_videos_user` (`createdBy`);

--
-- Indexes for table `video_likes`
--
ALTER TABLE `video_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`userId`,`videoId`),
  ADD KEY `videoId` (`videoId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blocks`
--
ALTER TABLE `blocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `follows`
--
ALTER TABLE `follows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `video_likes`
--
ALTER TABLE `video_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blocks`
--
ALTER TABLE `blocks`
  ADD CONSTRAINT `blocks_ibfk_1` FOREIGN KEY (`blockerId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blocks_ibfk_2` FOREIGN KEY (`blockedId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`followerId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`followingId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `fk_videos_user` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `video_likes`
--
ALTER TABLE `video_likes`
  ADD CONSTRAINT `video_likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `video_likes_ibfk_2` FOREIGN KEY (`videoId`) REFERENCES `videos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
