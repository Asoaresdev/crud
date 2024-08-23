

-- DROP TABLE users;


CREATE TABLE users (
    id TEXT UNIQUE PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    age TEXT NOT NULL,
    first_semester_grade TEXT NOT NULL,
    second_semester_grade TEXT NOT NULL,
    teacher_name TEXT NOT NULL, 
    room_number TEXT NOT NULL
);





SELECT * FROM users;