CREATE TABLE `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `content` longtext,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `group_chat` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id_admin` bigint DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `img_url` varchar(1000) DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci CREATE TABLE `group_msg` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_from` bigint DEFAULT NULL,
  `group_to` bigint DEFAULT NULL,
  `msg` longtext,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `imgs_post` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `img_url` varchar(1000) DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `members_of_group` (
  `group_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`group_id`, `user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci CREATE TABLE `msg` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user0` bigint DEFAULT NULL,
  `user1` bigint DEFAULT NULL,
  `msg` longtext,
  `is_user0_send` bit(1) DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id_to` bigint DEFAULT NULL,
  `notification_type` int DEFAULT NULL,
  `content` longtext,
  `open` bit(1) DEFAULT NULL,
  `link_id` bigint DEFAULT NULL,
  `img_url` varchar(1000) DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ref_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `posts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  `content` longtext,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(1000) DEFAULT NULL,
  `password` varchar(1000) DEFAULT NULL,
  `email` varchar(1000) DEFAULT NULL,
  `img_url` varchar(1000) DEFAULT NULL,
  `full_name` varchar(1000) DEFAULT NULL,
  `created_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
  project.users (
    id,
    username,
    password,
    email,
    img_url,
    full_name,
    created_time
  )
VALUES
  (
    1,
    'hieubuict96',
    '$2a$10$Ixu4QquBcm2NOAIdaOvjouvWE4Bwi3TNdsphyA9dUdt630cQi1mfq',
    'hieubuict96@gmail.com',
    '1-1711296353398.jpg',
    'Bùi Đình Hiếu',
    '2024-03-24 22:58:14'
  ),
  (
    2,
    'hungbui94',
    '$2a$10$Ixu4QquBcm2NOAIdaOvjouvWE4Bwi3TNdsphyA9dUdt630cQi1mfq',
    'hungbui94@gmail.com',
    '2-1711296560446.jpg',
    'Bùi Đình Hùng',
    '2024-03-24 23:09:20'
  ),
  (
    3,
    'tienson89',
    '$2a$10$Ixu4QquBcm2NOAIdaOvjouvWE4Bwi3TNdsphyA9dUdt630cQi1mfq',
    'tienson89@gmail.com',
    '3-1711296689400.jpg',
    'Bùi Tiến Sơn',
    '2024-03-24 23:11:29'
  ),
  (
    4,
    'phuongbui00',
    '$2a$10$Ixu4QquBcm2NOAIdaOvjouvWE4Bwi3TNdsphyA9dUdt630cQi1mfq',
    'phuongbui@gmail.com',
    '4-1711296689400.jpg',
    'Bùi Lê Phương',
    '2024-03-24 23:11:29'
  );

INSERT INTO
  project.posts (id, user_id, content, created_time)
VALUES
  (1, 1, 'Đã ở Mộc Châu', '2024-05-17 07:58:02');

INSERT INTO
  project.notifications (
    id,
    user_id_to,
    notification_type,
    content,
    `open`,
    link_id,
    img_url,
    created_time,
    ref_id
  )
VALUES
  (
    1,
    1,
    0,
    'Bùi Đình Hùng đã bình luận về bài viết của bạn.',
    0,
    1,
    '2-1711296560446.jpg',
    '2024-05-17 07:59:49',
    1
  );

INSERT INTO
  project.msg (
    id,
    user0,
    user1,
    msg,
    is_user0_send,
    created_time
  )
VALUES
  (1, 1, 2, 'a Hùng ơi', 1, '2024-05-17 08:24:57'),
  (2, 1, 2, 'a Hùng', 1, '2024-05-17 08:25:08');

INSERT INTO
  project.members_of_group (group_id, user_id)
VALUES
  (1, 1),
  (1, 2),
  (1, 4),
  (2, 1),
  (2, 2),
  (2, 3),
  (2, 4);

INSERT INTO
  project.imgs_post (id, img_url, post_id)
VALUES
  (
    1,
    '438880571_1171469764019625_5715784017649521140_n-1715907482338.jpg',
    1
  );

INSERT INTO
  project.group_chat (id, user_id_admin, name, img_url, created_time)
VALUES
  (
    1,
    1,
    'Nhóm chat 3 anh em',
    NULL,
    '2024-05-17 08:23:47'
  ),
  (
    2,
    1,
    'Nhóm chat 4 anh em',
    NULL,
    '2024-05-17 08:24:22'
  );

INSERT INTO
  project.comments (id, user_id, post_id, content, created_time)
VALUES
  (
    1,
    2,
    1,
    'Đi hôm nào đấy em',
    '2024-05-17 00:59:49'
  );