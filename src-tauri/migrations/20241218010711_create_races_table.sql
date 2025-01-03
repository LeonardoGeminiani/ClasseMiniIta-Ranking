CREATE TABLE races (
    raceId INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    N INTEGER NOT NULL,
    E INT8 NOT NULL,
    D INT8 NOT NULL
);


CREATE TABLE skippers (
    skipperId INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL    
);

CREATE TABLE soloSerie (
    raceId INTEGER NOT NULL,
    skipperId INTEGER NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (raceId, skipperId)
);

CREATE TABLE soloProto (
    raceId INTEGER NOT NULL,
    skipperId INTEGER NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (raceId, skipperId)
);

CREATE TABLE DoubleSerie (
    raceId INTEGER NOT NULL,
    skipperId INTEGER NOT NULL,
    CoSkipperId INTEGER NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (raceId, skipperId)
);

CREATE TABLE DoubleProto (
    raceId INTEGER NOT NULL,
    skipperId INTEGER NOT NULL,
    CoSkipperId INTEGER NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (raceId, skipperId)
);