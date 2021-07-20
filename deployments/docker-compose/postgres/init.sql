CREATE TABLE users
(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    password TEXT,
    role INT,
    created_at TEXT,
    updated_at TEXT,
    deleted_at TEXT
);
COPY users FROM '/data/data_users.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE groups
(
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT
);
COPY groups FROM '/data/data_groups.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE group_members
(
    group_id INT PRIMARY KEY,
    user_id INT
);
COPY group_members FROM '/data/data_group_members.csv' DELIMITER ',' CSV HEADER;