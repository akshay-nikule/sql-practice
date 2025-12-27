import initSqlJs from 'sql.js';

// Import all database schemas
import hospitalSQL from '../data/databases/hospital.sql?raw';
import universitySQL from '../data/databases/university.sql?raw';
import companySQL from '../data/databases/company.sql?raw';

const databases = {
  hospital: { sql: hospitalSQL, db: null },
  university: { sql: universitySQL, db: null },
  company: { sql: companySQL, db: null }
};

let SQL = null;
let currentDbName = 'hospital';
let initPromise = null;

/**
 * Initialize sql.js with error handling
 */
async function initSqlEngine() {
  if (SQL) {
    return SQL;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      // Use CDN for sql.js WASM files - works on any hosting
      SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
      });
      return SQL;
    } catch (error) {
      initPromise = null;
      throw new Error(`Failed to initialize SQL.js: ${error.message}`);
    }
  })();

  return initPromise;
}

/**
 * Initialize or get a specific database
 * @param {string} dbName - Name of the database (hospital, university, company)
 * @returns {Promise<object>}
 */
export async function initDatabase(dbName = 'hospital') {
  if (!databases[dbName]) {
    throw new Error(`Unknown database: ${dbName}`);
  }

  await initSqlEngine();

  // Create new database instance if not exists
  if (!databases[dbName].db) {
    try {
      databases[dbName].db = new SQL.Database();
      databases[dbName].db.run(databases[dbName].sql);
    } catch (error) {
      databases[dbName].db = null;
      throw new Error(`Failed to initialize ${dbName} database: ${error.message}`);
    }
  }

  currentDbName = dbName;
  return databases[dbName].db;
}

/**
 * Switch to a different database
 * @param {string} dbName - Name of the database
 */
export async function switchDatabase(dbName) {
  await initDatabase(dbName);
  currentDbName = dbName;
}

/**
 * Get current database name
 */
export function getCurrentDatabase() {
  return currentDbName;
}

/**
 * Get list of available databases
 */
export function getAvailableDatabases() {
  return Object.keys(databases).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1)
  }));
}

/**
 * Validate SQL query before execution
 * @param {string} sql - The SQL query to validate
 * @returns {boolean}
 */
function validateQuery(sql) {
  if (!sql || typeof sql !== 'string') {
    return false;
  }

  const trimmed = sql.trim().toUpperCase();

  // Prevent dangerous operations
  const dangerousKeywords = ['DROP', 'DELETE', 'ALTER', 'TRUNCATE', 'PRAGMA'];
  for (const keyword of dangerousKeywords) {
    if (trimmed.startsWith(keyword)) {
      return false;
    }
  }

  return true;
}

/**
 * Execute a SQL query on the current database
 * @param {string} sql - The SQL query to execute
 * @returns {{ columns: string[], values: any[][], error: string | null }}
 */
export function executeQuery(sql) {
  const db = databases[currentDbName]?.db;

  if (!db) {
    return { columns: [], values: [], error: 'Database not initialized' };
  }

  if (!validateQuery(sql)) {
    return {
      columns: [],
      values: [],
      error: 'Invalid or unsafe SQL query. Only SELECT queries are allowed.'
    };
  }

  try {
    const results = db.exec(sql);

    if (results.length === 0) {
      return { columns: [], values: [], error: null };
    }

    return {
      columns: results[0].columns,
      values: results[0].values,
      error: null
    };
  } catch (error) {
    return {
      columns: [],
      values: [],
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Execute a query on a specific database
 * @param {string} sql - The SQL query
 * @param {string} dbName - Database name
 */
export async function executeQueryOnDb(sql, dbName) {
  if (!validateQuery(sql)) {
    return {
      columns: [],
      values: [],
      error: 'Invalid or unsafe SQL query. Only SELECT queries are allowed.'
    };
  }

  await initDatabase(dbName);
  const db = databases[dbName].db;

  try {
    const results = db.exec(sql);

    if (results.length === 0) {
      return { columns: [], values: [], error: null };
    }

    return {
      columns: results[0].columns,
      values: results[0].values,
      error: null
    };
  } catch (error) {
    return {
      columns: [],
      values: [],
      error: error.message || 'Unknown error occurred'
    };
  }
}

/**
 * Get the expected result for a question's expected query
 * @param {string} expectedQuery - The expected SQL query
 * @returns {{ columns: string[], values: any[][] }}
 */
export function getExpectedResult(expectedQuery) {
  return executeQuery(expectedQuery);
}

/**
 * Compare two query results (order-independent)
 * @param {object} userResult - User's query result
 * @param {object} expectedResult - Expected query result
 * @returns {boolean}
 */
export function compareResults(userResult, expectedResult) {
  if (userResult.error) return false;
  if (expectedResult.error) return false;
  if (userResult.columns.length !== expectedResult.columns.length) return false;
  if (userResult.values.length !== expectedResult.values.length) return false;

  // Sort both results for comparison
  const sortValues = (values) => {
    return [...values].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  };

  try {
    const sortedUser = sortValues(userResult.values);
    const sortedExpected = sortValues(expectedResult.values);

    return JSON.stringify(sortedUser) === JSON.stringify(sortedExpected);
  } catch (error) {
    console.error('Error comparing results:', error);
    return false;
  }
}

/**
 * Check if database is ready
 * @returns {boolean}
 */
export function isDatabaseReady() {
  return databases[currentDbName]?.db !== null && SQL !== null;
}

/**
 * Get table names from current database
 */
export function getTableNames() {
  const db = databases[currentDbName]?.db;
  if (!db) return [];

  try {
    const result = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    if (result.length === 0) return [];
    return result[0].values.map(row => row[0]).filter(name => name && typeof name === 'string');
  } catch (error) {
    console.error('Error getting table names:', error);
    return [];
  }
}

/**
 * Get table schema
 * @param {string} tableName 
 */
export function getTableSchema(tableName) {
  const db = databases[currentDbName]?.db;
  if (!db || !tableName) return [];

  try {
    const result = db.exec(`PRAGMA table_info(${tableName})`);
    if (result.length === 0) return [];
    return result[0].values.map(row => ({
      name: row[1],
      type: row[2],
      nullable: row[3] === 0,
      pk: row[5] === 1
    }));
  } catch (error) {
    console.error(`Error getting schema for table ${tableName}:`, error);
    return [];
  }
}
