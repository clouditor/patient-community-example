CREATE TABLE group_memberz
(
    username TEXT PRIMARY KEY,
    firstname TEXT,
    lastname TEXT,
    password TEXT,
    role TEXT
);
COPY group_memberz FROM '/data/data.csv' DELIMITER ',' CSV HEADER;