/*
CREATE TABLE `users` ( 
	id INT(11) NOT NULL AUTO_INCREMENT,
	userid varchar(50) NOT NULL,
	email varchar(80) NOT NULL,
	passwd varchar(64) NOT NULL,
	salt varchar(17) NOT NULL,
	created datetime NOT NULL,
	updated datetime NOT NULL,
	PRIMARY KEY (id),
	UNIQUE KEY (userid),
	UNIQUE KEY (email)
);

CREATE TABLE `tasks` ( 
	id INT(11) NOT NULL AUTO_INCREMENT,
	uid INT(11) NOT NULL,
	body varchar(100) NOT NULL,
	created datetime NOT NULL,
	state ENUM('active', 'complete', 'hidden') NOT NULL DEFAULT 'active',
	locked boolean NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (uid) REFERENCES users(id)
);

*/