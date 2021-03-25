
-- Articles
create table Articles (
    id                      integer not null unique,
    url                     text not null,
    date_of_publication     timestamp,
    headline                text not null,
    main_text               text,
    summary                 text,

    primary key (id)
);

-- Reports
create table Reports (
    id                      text not null unique,
    article_id              integer not null,

    foreign key (article_id) references Articles(id),
    primary key (id)
);

-- Locations 
create table Locations (
    id                      serial,
    report_id               text not null,
    country                 text,
    location                text not null,
    geonames_id             text, -- Not unique as 2 places with slightly different 'location' strings may refer to same geonames object

    foreign key (report_id) references reports(id),
    primary key (id)
);

-- Known diseases
create table Diseases  (
    name                     text not null unique,

    primary key (name) -- Assumes all diseases have unique names
);

-- Known syndromes
create table Syndromes (
    name                    text not null,

    primary key (name) -- Assumes all syndromes have unique names
);


-- Table of report <-> disease relations
create table Report_diseases (
    disease_id              text not null,
    report_id               text not null,

    foreign key (disease_id) references Diseases(name),
    foreign key (report_id) references Reports(id),
    primary key (disease_id, report_id)
);

-- Table of report <-> syndrome relations
create table Report_syndromes (
    syndrome_id             text not null,
    report_id               text not null,

    foreign key (syndrome_id) references Syndromes(name),
    foreign key (report_id) references Reports(id),
    primary key (syndrome_id, report_id)
);

-- Table of report <-> time relations
create table Report_times (
    report_id               text not null,
    time                    timestamp not null, -- Report times cannot be date ranges

    foreign key (report_id) references Reports(id),
    primary key (report_id, time) -- Assumes each report can only contain each date once
);
