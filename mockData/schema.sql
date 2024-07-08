CREATE TABLE
    users id PRIMARY KEY username
CREATE TABLE
    familyInfo id PRIMARY KEY familyname pet
CREATE TABLE
    familyMembers id PRIMARY KEY uid REFERENCES users familyid REFERENCES id
CREATE TABLE
    pet id PRIMARY KEY familyid REFERENCES familyInfo
    -- FINDING family members