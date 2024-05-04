create table users (
  id bigint primary key auto_increment,
  username varchar(1000),
  password varchar(1000),
  email varchar(1000),
  img_url varchar(1000),
  full_name varchar(1000),
  created_time timestamp default current_timestamp
);

create table posts (
  id bigint primary key auto_increment,
  user_id bigint,
  content longtext,
  created_time timestamp default current_timestamp
);

create table comments (
  id bigint primary key auto_increment,
  user_id bigint,
  post_id bigint,
  content longtext,
  created_time timestamp default current_timestamp
);

create table imgs_post (
  id bigint primary key auto_increment,
  img_url varchar(1000),
  post_id bigint
);

create table group_chat (
  id bigint primary key auto_increment,
  user_id_admin bigint,
  name varchar(100),
  img_url varchar(1000),
  is_2_person bit(1),
  created_time timestamp default current_timestamp
);

create table members_of_group (
  group_id bigint,
  user_id bigint,
  primary key (group_id, user_id)
);

create table notifications (
  id bigint primary key auto_increment,
  user_id_receive bigint,
  notification_type int,
  content longtext,
  open bit(1),
  link_id bigint,
  img_url varchar(1000),
  created_time timestamp default current_timestamp
);

create table group_msg (
  id bigint primary key auto_increment,
  user_from bigint,
  group_receive bigint,
  msg longtext,
  created_time timestamp default current_timestamp
);