SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

;
;
;
;

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` enum('deposit','spend','payment') NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `transactions` (`id`, `user_id`, `amount`, `type`, `description`, `created_at`) VALUES
(8, 2, 120.00, 'deposit', 'Added funds', '2026-03-10 20:37:50'),
(9, 2, 40.00, 'spend', 'Grocery shopping', '2026-03-10 20:38:04'),
(10, 2, 60.00, 'deposit', 'Salary top-up', '2026-03-10 20:38:21'),
(11, 2, 25.00, 'spend', 'Utility bill', '2026-03-10 20:38:37'),
(12, 2, 15.00, 'spend', 'Online subscription', '2026-03-10 20:38:48'),
(13, 3, 25000.00, 'deposit', 'Bank transfer', '2026-03-10 20:41:13'),
(14, 3, 7500.00, 'spend', 'Luxury car purchase', '2026-03-10 20:41:31'),
(15, 3, 3200.00, 'spend', 'Vacation booking', '2026-03-10 20:41:43'),
(16, 3, 50000.00, 'deposit', 'Investment return', '2026-03-10 20:41:55'),
(17, 3, 12000.00, 'spend', 'Home renovation', '2026-03-10 20:42:07'),
(18, 3, 1500.00, 'spend', 'Designer clothes', '2026-03-10 20:42:19');

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `balance` decimal(10,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `balance`, `created_at`) VALUES
(1, 'azerty', 'azerty@gmail.com', '$2b$10$RlJq0gwatlV8E8Q0gTYzo.Mu9OyDxpx5VplPo5IH.FiTSCCmxrW5a', 33.00, '2026-03-10 19:53:52'),
(2, 'maxym', 'maxym@gmail.com', '$2b$10$vqf3/P5CsrRtHu0wrb1/POu..gr8q4P7pFmEJz7mhaxh8FBj0AFmC', 100.00, '2026-03-10 21:37:33'),
(3, 'alexander', 'alexander@gmail.com', '$2b$10$SiEo6a/ifP.vLgsac2/fa.ru7t593qF1AXQAreFkPQMcX/8wMD.Zu', 50800.00, '2026-03-10 21:40:52');

ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

;
;
;
