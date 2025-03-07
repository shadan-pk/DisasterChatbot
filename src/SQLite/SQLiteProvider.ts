import * as SQLite from 'expo-sqlite';

const db: any = SQLite.openDatabaseSync("DisasterResponse.db");

export const createTables = (): void => {
  db.transaction((tx: { executeSql: (arg0: string) => void; }) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstName TEXT,
          lastName TEXT,
          phoneNumber TEXT,
          location TEXT,
          nearestPoliceStation TEXT,
          email TEXT
      );`
    );
  });
};

export const insertUser = (
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    location: string;
    nearestPoliceStation: string;
    email: string;
  },
  callback: (result: SQLite.SQLResultSet) => void
): void => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO users (firstName, lastName, phoneNumber, location, nearestPoliceStation, email)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        user.firstName,
        user.lastName,
        user.phoneNumber,
        user.location,
        user.nearestPoliceStation,
        user.email,
      ],
      (_: any, result: any) => {
        callback(result);
      },
      (_: any, error: any) => {
        console.error("Error inserting user", error);
        return false;
      }
    );
  });
};

export const getUser = (
  email: string,
  callback: (user: any) => void
): void => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM users WHERE email = ?;`,
      [email],
      (_: any, { rows }: { rows: { _array: any[] } }) => {
        // rows._array holds the result rows, we return the first matching record
        callback(rows._array[0]);
      },
      (_: any, error: any) => {
        console.error("Error fetching user", error);
        return false;
      }
    );
  });
};