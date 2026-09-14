import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const dbFilePath = path.join(process.cwd(), 'userData.db');

let db: Database | null = null;

// Initialize SQLite database
async function initDb() {
  try {
    const database = await open({
      filename: dbFilePath,
      driver: sqlite3.Database,
    });

    // Ensure user table schema exists
    await database.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        gender TEXT NOT NULL,
        location TEXT NOT NULL
      );
    `);
    db = database;
    console.log('Connected to SQLite database at:', dbFilePath);
  } catch (err: any) {
    console.error('Database connection error:', err?.message || err);
  }
}

async function startServer() {
  await initDb();

  app.use(express.json());

  // CORS / security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString(), database: db ? 'connected' : 'disconnected' });
  });

  // Helper for DB queries
  const getDb = () => {
    if (!db) throw new Error('Database not initialized');
    return db;
  };

  // 1. GET /register & /api/users - returns users
  const handleGetUsers = async (req: Request, res: Response) => {
    try {
      const database = getDb();
      const users = await database.all('SELECT * FROM user');
      res.status(200).send(users);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  };

  app.get('/register', handleGetUsers);
  app.get('/api/users', handleGetUsers);
  app.get('/api/register', handleGetUsers);

  // 2. POST /register & /api/register - register a user
  const handleRegister = async (req: Request, res: Response) => {
    try {
      const database = getDb();
      const { username, name, password, gender, location } = req.body;

      if (!username || !name || !password) {
        res.status(400);
        return res.send('Missing required fields: username, name, and password are required');
      }

      // Check if user already exists
      const checkUserQuery = 'SELECT * FROM user WHERE username = ?';
      const checkInDataBase = await database.get(checkUserQuery, [username]);

      if (checkInDataBase === undefined) {
        if (password.length < 5) {
          res.status(400);
          return res.send('Password is too short');
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const createNewUser = `
            INSERT INTO user (username, name, password, gender, location)
            VALUES (?, ?, ?, ?, ?)
          `;
          await database.run(createNewUser, [
            username,
            name,
            hashedPassword,
            gender || 'not specified',
            location || 'Remote',
          ]);
          res.status(200);
          return res.send('User created successfully');
        }
      } else {
        res.status(400);
        return res.send('User already exists');
      }
    } catch (error: any) {
      res.status(500);
      return res.send(error.message);
    }
  };

  app.post('/register', handleRegister);
  app.post('/api/register', handleRegister);

  // 3. POST /login & /api/login - user login
  const handleLogin = async (req: Request, res: Response) => {
    try {
      const database = getDb();
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400);
        return res.send('Username and password are required');
      }

      const getUserDetails = 'SELECT * FROM user WHERE username = ? COLLATE NOCASE';
      const checkInDb = await database.get(getUserDetails, [username]);

      if (checkInDb === undefined) {
        res.status(400);
        return res.send('Invalid user');
      } else {
        // Support both hashed passwords and legacy plain text passwords in imported db
        let isPasswordMatched = false;
        if (checkInDb.password && (checkInDb.password.startsWith('$2a$') || checkInDb.password.startsWith('$2b$'))) {
          isPasswordMatched = await bcrypt.compare(password, checkInDb.password);
        } else {
          isPasswordMatched = checkInDb.password === password;
        }

        if (isPasswordMatched) {
          res.status(200);
          // Return user info along with success message so frontend can update profile
          return res.json({
            message: 'Login success!',
            user: {
              username: checkInDb.username,
              name: checkInDb.name,
              gender: checkInDb.gender,
              location: checkInDb.location,
            },
          });
        } else {
          res.status(400);
          return res.send('Invalid password');
        }
      }
    } catch (error: any) {
      res.status(500);
      return res.send(error.message);
    }
  };

  app.post('/login', handleLogin);
  app.post('/login/', handleLogin);
  app.post('/api/login', handleLogin);

  // 4. PUT /change-password & /api/change-password
  const handleChangePassword = async (req: Request, res: Response) => {
    try {
      const database = getDb();
      const { username, oldPassword, newPassword } = req.body;

      if (!username || !oldPassword || !newPassword) {
        res.status(400);
        return res.send('Username, oldPassword, and newPassword are required');
      }

      const getUserDetail = 'SELECT * FROM user WHERE username = ? COLLATE NOCASE';
      const dbResponse = await database.get(getUserDetail, [username]);

      if (dbResponse === undefined) {
        res.status(400);
        return res.send('Invalid user');
      }

      let isPasswordCheck = false;
      if (dbResponse.password && (dbResponse.password.startsWith('$2a$') || dbResponse.password.startsWith('$2b$'))) {
        isPasswordCheck = await bcrypt.compare(oldPassword, dbResponse.password);
      } else {
        isPasswordCheck = dbResponse.password === oldPassword;
      }

      if (!isPasswordCheck) {
        res.status(400);
        return res.send('Invalid current password');
      } else {
        if (newPassword.length < 5) {
          res.status(400);
          return res.send('Password is too short');
        } else {
          const newPasswordHash = await bcrypt.hash(newPassword, 10);
          const updatePasswordQuery = 'UPDATE user SET password = ? WHERE username = ?';
          await database.run(updatePasswordQuery, [newPasswordHash, username]);
          res.status(200);
          return res.send('Password updated');
        }
      }
    } catch (error: any) {
      res.status(500);
      return res.send(error.message);
    }
  };

  app.put('/change-password', handleChangePassword);
  app.put('/change-password/', handleChangePassword);
  app.put('/api/change-password', handleChangePassword);

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
