import React, { useEffect, useMemo, useState } from "react";

const rawQuestions = [
  ["wf-1", "Window Functions", "Why would you use a window function instead of GROUP BY?", ["To delete repeated rows", "To keep each row while still doing calculations across related rows", "To make INSERT statements faster", "To remove the need for SELECT"], 1, "Window functions keep row-level detail while adding calculations such as averages, ranks, or running totals."],
  ["wf-2", "Window Functions", "What does PARTITION BY do in a window function?", ["Deletes a table partition", "Splits rows into logical groups for the calculation", "Sorts the final result only", "Creates a new database"], 1, "PARTITION BY creates mini-groups, such as one group per department or module."],
  ["wf-3", "Window Functions", "Which SQL calculates average salary per department while keeping every employee row?", ["AVG(salary) GROUP department", "AVG(salary) OVER(PARTITION BY department)", "GROUP BY salary", "ORDER BY AVG(salary)"], 1, "OVER(PARTITION BY department) calculates inside each department without collapsing rows."],

  ["idx-1", "Database Indexes", "What is the main purpose of a database index?", ["To make searching and retrieval faster", "To remove old rows automatically", "To stop users logging in", "To replace primary keys"], 0, "An index works like a book index: it helps the database find rows faster."],
  ["idx-2", "Database Indexes", "Why can too many indexes slow down a database?", ["They make SELECT impossible", "They must be updated during INSERT, UPDATE, and DELETE operations", "They remove table columns", "They stop joins from working"], 1, "Indexes improve reads but add write overhead because every index must be maintained."],
  ["idx-3", "Database Indexes", "Which exam phrase best describes indexes?", ["Indexes improve read performance but reduce write performance", "Indexes always make every query faster", "Indexes are only used for backups", "Indexes delete duplicate rows"], 0, "This is a strong exam sentence: faster reads, slower writes."],

  ["opt-1", "SQL Optimization", "Why is SELECT * often inefficient?", ["It retrieves unnecessary columns", "It always causes a syntax error", "It prevents COMMIT from working", "It creates too many users"], 0, "SELECT * may increase disk I/O, memory usage, and network transfer by returning columns you do not need."],
  ["opt-2", "SQL Optimization", "Why can EXTRACT(YEAR FROM order_date) reduce performance?", ["It changes the date permanently", "It may force the database to apply a function to every row and avoid index use", "It automatically deletes indexes", "It only works with NoSQL databases"], 1, "Functions on indexed columns may stop efficient index access, leading to full scans."],
  ["opt-3", "SQL Optimization", "Which condition is usually better for index usage?", ["EXTRACT(YEAR FROM order_date) = 2025", "order_date >= '2025-01-01' AND order_date < '2026-01-01'", "SELECT * FROM orders", "GROUP BY order_date EXTRACT 2025"], 1, "A date range allows the database to use an index on order_date more efficiently."],

  ["txn-1", "Transaction Management", "What is a database transaction?", ["A group of operations treated as one unit of work", "A type of index", "A login password", "A NoSQL document"], 0, "A transaction groups operations so they succeed together or fail together."],
  ["txn-2", "Transaction Management", "What does COMMIT do?", ["Undoes changes", "Permanently saves transaction changes", "Creates a table", "Deletes a user"], 1, "COMMIT makes transaction changes permanent."],
  ["txn-3", "Transaction Management", "What does ROLLBACK do?", ["Undoes changes since the last COMMIT", "Permanently saves changes", "Adds an index", "Creates a distributed database"], 0, "ROLLBACK reverses changes when something goes wrong."],

  ["acid-1", "ACID Properties", "What does Atomicity mean?", ["Everything happens or nothing happens", "Data is stored on many computers", "Users must log in", "Queries always run faster"], 0, "Atomicity means no half-finished transactions."],
  ["acid-2", "ACID Properties", "Which ACID property means transactions do not interfere with each other?", ["Atomicity", "Consistency", "Isolation", "Durability"], 2, "Isolation protects transactions from interfering with one another."],
  ["acid-3", "ACID Properties", "Which ACID property means committed data survives a crash?", ["Atomicity", "Consistency", "Isolation", "Durability"], 3, "Durability means once committed, data remains saved."],

  ["sec-1", "Database Security", "What is authentication?", ["Checking what a user can access", "Verifying who the user is", "Creating a backup", "Sorting rows"], 1, "Authentication asks: who are you?"],
  ["sec-2", "Database Security", "What is authorisation?", ["Verifying identity", "Checking permissions and access rights", "Running EXPLAIN ANALYZE", "Creating a table"], 1, "Authorisation asks: what are you allowed to do?"],
  ["sec-3", "Database Security", "Which SQL command gives a user permission?", ["GRANT", "ROLLBACK", "EXTRACT", "PARTITION"], 0, "GRANT gives privileges, such as SELECT on a table."],

  ["acm-1", "Access Control Models", "What does DAC usually mean?", ["The owner/user controls permissions", "Only the government controls permissions", "Data is automatically copied", "Every user has admin access"], 0, "DAC is flexible because owners can decide access."],
  ["acm-2", "Access Control Models", "What does MAC usually mean?", ["Flexible user-controlled sharing", "Strict central/system-controlled permissions", "A type of window function", "A command to average data"], 1, "MAC is strict and commonly associated with military/government style security."],

  ["bd-1", "Big Data Fundamentals", "What are the 3Vs of Big Data?", ["Volume, Velocity, Variety", "Value, Vision, Volume", "Velocity, Verification, Variety", "Virtual, Volume, View"], 0, "The 3Vs are Volume, Velocity, and Variety."],
  ["bd-2", "Big Data Fundamentals", "Which V means data arrives very quickly?", ["Volume", "Velocity", "Variety", "Validity"], 1, "Velocity is about speed, such as live sensor data or social media feeds."],
  ["bd-3", "Big Data Fundamentals", "Which V means different data types such as text, video, images, and JSON?", ["Volume", "Velocity", "Variety", "Visibility"], 2, "Variety means different formats of data."],

  ["dd-1", "Distributed Databases", "What is a distributed database?", ["A database stored across multiple locations or servers", "A database with no security", "A database that only stores images", "A table with too many indexes"], 0, "Distributed databases spread data across multiple nodes but work as one system."],
  ["dd-2", "Distributed Databases", "What does fault tolerance mean?", ["The system keeps working if one node fails", "The database deletes errors automatically", "Users cannot make mistakes", "All tables must have indexes"], 0, "Fault tolerance means failure in one part does not stop the whole system."],
  ["dd-3", "Distributed Databases", "What does transparency mean in distributed databases?", ["Users see one database even though data is spread across locations", "All data is public", "Passwords are visible", "Indexes are removed"], 0, "Transparency hides the complexity of where data is physically stored."],

  ["join-1", "JOIN Rewrite", "Which SQL keyword properly connects two tables together?", ["MERGE", "JOIN", "GROUP", "UNION"], 1, "JOIN is used to connect related tables together using matching columns."],
  ["join-2", "JOIN Rewrite", "What is the purpose of the ON keyword in a JOIN?", ["To sort the table", "To define the relationship between tables", "To delete duplicate rows", "To create an index"], 1, "ON specifies how the two tables are related."],
  ["join-3", "JOIN Rewrite", "Which JOIN rewrite is correct?", ["FROM Employee JOIN Department ON Employee.DepartmentID = Department.DepartmentID", "FROM Employee GROUP Department", "FROM Employee ORDER Department", "FROM Employee PARTITION Department"], 0, "Modern JOIN syntax improves readability and clarity."],

  ["cte-1", "CTE Rewrite", "What does CTE stand for?", ["Common Table Expression", "Connected Table Engine", "Column Transfer Expression", "Common Transfer Entity"], 0, "CTE stands for Common Table Expression."],
  ["cte-2", "CTE Rewrite", "Why are CTEs useful?", ["They permanently store data", "They make long queries easier to read and reuse", "They delete duplicate rows", "They replace indexes"], 1, "CTEs improve readability and simplify complex queries."],
  ["cte-3", "CTE Rewrite", "Which keyword starts a CTE?", ["GROUP BY", "PARTITION", "WITH", "ORDER BY"], 2, "CTEs begin with the WITH keyword."],

  ["grant-1", "Database Security Commands", "What does CREATE USER do?", ["Creates a new table", "Creates a database backup", "Creates a database user", "Creates an index"], 2, "CREATE USER adds a new database user account."],
  ["grant-2", "Database Security Commands", "What does GRANT do?", ["Deletes a user", "Gives permissions to a user", "Removes permissions", "Creates a transaction"], 1, "GRANT gives privileges such as SELECT or INSERT."],
  ["grant-3", "Database Security Commands", "What does REVOKE do?", ["Adds a new permission", "Creates a table", "Removes permissions from a user", "Commits a transaction"], 2, "REVOKE removes privileges from a user."],

  ["wf-4", "Window Functions", "Which window function gives every row a number?", ["RANK()", "ROW_NUMBER()", "AVG()", "COUNT()"], 1, "ROW_NUMBER() assigns a unique number to each row."],
  ["wf-5", "Window Functions", "What does ORDER BY do inside OVER()?", ["Sorts rows for the window calculation", "Deletes rows", "Creates indexes", "Commits data"], 0, "ORDER BY controls the order used by the window function."],
  ["wf-6", "Window Functions", "Which function gives rankings with gaps?", ["DENSE_RANK()", "ROW_NUMBER()", "RANK()", "GROUP BY"], 2, "RANK() skips numbers after ties."],

  ["idx-4", "Database Indexes", "Which operation benefits most from indexes?", ["SELECT searches", "DROP TABLE", "COMMIT", "ROLLBACK"], 0, "Indexes are mainly designed to speed up searches."],
  ["idx-5", "Database Indexes", "What is a downside of indexes?", ["Slower INSERT and UPDATE operations", "Queries stop working", "Tables disappear", "Users lose permissions"], 0, "Indexes must be maintained when data changes."],
  ["idx-6", "Database Indexes", "Which column is best for an index?", ["A column frequently searched", "A random unused column", "A column with no data", "A temporary column"], 0, "Indexes are most useful on columns used in WHERE or JOIN conditions."],

  ["opt-4", "SQL Optimization", "Why should unnecessary columns be avoided in queries?", ["To reduce data transfer and improve speed", "To delete tables faster", "To disable indexes", "To avoid transactions"], 0, "Returning fewer columns reduces workload."],
  ["opt-5", "SQL Optimization", "Which clause filters rows before grouping?", ["WHERE", "HAVING", "ORDER BY", "PARTITION BY"], 0, "WHERE filters rows before GROUP BY occurs."],
  ["opt-6", "SQL Optimization", "Which command helps analyse a query execution plan?", ["EXPLAIN", "REVOKE", "COMMIT", "INSERT"], 0, "EXPLAIN shows how the database plans to run a query."],

  ["txn-4", "Transaction Management", "Why are transactions important?", ["They maintain data reliability", "They remove indexes", "They replace joins", "They stop backups"], 0, "Transactions keep data accurate during failures."],
  ["txn-5", "Transaction Management", "Which keyword starts a transaction in many databases?", ["BEGIN", "SELECT", "ORDER", "AVG"], 0, "BEGIN starts a transaction block."],
  ["txn-6", "Transaction Management", "What happens if a transaction fails before COMMIT?", ["ROLLBACK may undo the changes", "All indexes are deleted", "Users are removed", "The database shuts down"], 0, "Failed transactions are usually rolled back."],

  ["acid-4", "ACID Properties", "Which ACID property ensures valid rules and constraints?", ["Consistency", "Isolation", "Durability", "Atomicity"], 0, "Consistency ensures the database remains valid."],
  ["acid-5", "ACID Properties", "Atomicity prevents what problem?", ["Half-finished transactions", "Slow queries", "Duplicate indexes", "Distributed databases"], 0, "Atomicity means all or nothing."],
  ["acid-6", "ACID Properties", "Isolation mainly protects against what?", ["Transactions interfering with each other", "Users forgetting passwords", "Missing indexes", "Network cables failing"], 0, "Isolation keeps simultaneous transactions separate."],

  ["sec-4", "Database Security", "Which is an example of authentication?", ["Logging in with username and password", "Giving SELECT permission", "Creating a JOIN", "Adding an index"], 0, "Authentication verifies identity."],
  ["sec-5", "Database Security", "Which is an example of authorisation?", ["Allowing a user to SELECT data", "Checking a password", "Creating a database", "Restarting a server"], 0, "Authorisation controls access rights."],
  ["sec-6", "Database Security", "Why is least privilege important?", ["Users only get permissions they need", "Everyone becomes admin", "Indexes are removed", "Transactions are disabled"], 0, "Least privilege reduces security risks."],

  ["bd-4", "Big Data Fundamentals", "Which V refers to huge amounts of data?", ["Volume", "Velocity", "Variety", "Verification"], 0, "Volume means large quantities of data."],
  ["bd-5", "Big Data Fundamentals", "Which technology is commonly linked to Big Data?", ["Hadoop", "Microsoft Paint", "Bluetooth", "Excel formulas"], 0, "Hadoop is widely used in Big Data systems."],
  ["bd-6", "Big Data Fundamentals", "Why can traditional databases struggle with Big Data?", ["The scale and speed are too large", "SQL stops existing", "Indexes disappear", "Tables cannot be created"], 0, "Big Data often exceeds traditional system limits."],

  ["dd-4", "Distributed Databases", "Why are distributed databases useful?", ["They improve scalability and availability", "They remove security", "They stop backups", "They prevent joins"], 0, "Distributed systems can handle more users and data."],
  ["dd-5", "Distributed Databases", "What is replication?", ["Copying data across multiple nodes", "Deleting old data", "Ranking rows", "Creating indexes"], 0, "Replication improves reliability and availability."],
  ["dd-6", "Distributed Databases", "What is a node in a distributed database?", ["A server or machine in the system", "A SQL keyword", "A password", "A window function"], 0, "Nodes are the machines participating in the distributed system."],

  ["join-4", "JOIN Rewrite", "Which JOIN returns matching rows from both tables only?", ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], 0, "INNER JOIN only returns matching rows."],
  ["join-5", "JOIN Rewrite", "Which JOIN keeps all rows from the left table?", ["LEFT JOIN", "INNER JOIN", "RIGHT JOIN", "CROSS JOIN"], 0, "LEFT JOIN keeps all left-table rows."],
  ["join-6", "JOIN Rewrite", "What usually connects tables together?", ["Primary and foreign keys", "Passwords", "Indexes only", "Transactions"], 0, "Tables are linked using matching keys."],

  ["cte-4", "CTE Rewrite", "CTEs mainly help with what?", ["Readability", "Deleting users", "Removing indexes", "Authentication"], 0, "CTEs make complex queries easier to understand."],
  ["cte-5", "CTE Rewrite", "Can a CTE be referenced multiple times in a query?", ["Yes", "No", "Only with indexes", "Only in NoSQL"], 0, "CTEs can simplify reused calculations."],
  ["cte-6", "CTE Rewrite", "Which keyword follows a CTE name?", ["AS", "JOIN", "INDEX", "ROLLBACK"], 0, "CTEs use the syntax WITH name AS (...)."],

  ["grant-4", "Database Security Commands", "Which command removes a permission?", ["REVOKE", "GRANT", "CREATE", "SELECT"], 0, "REVOKE removes privileges."],
  ["grant-5", "Database Security Commands", "Which command creates a new account?", ["CREATE USER", "GRANT", "DROP INDEX", "ROLLBACK"], 0, "CREATE USER adds a new user."],
  ["grant-6", "Database Security Commands", "Which permission allows reading data?", ["SELECT", "DELETE", "DROP", "ALTER"], 0, "SELECT allows users to read rows from a table."],

  ["exam-1", "Exam Paper Topics", "Which query is most efficient for finding orders from 2025?", ["WHERE EXTRACT(YEAR FROM order_date)=2025", "WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'", "WHERE YEAR(order_date)=2025", "WHERE order_date LIKE '2025%'"], 1, "Date ranges usually allow indexes to work efficiently."],
  ["exam-2", "Exam Paper Topics", "Which SQL clause is processed after GROUP BY?", ["WHERE", "SELECT", "HAVING", "FROM"], 2, "HAVING filters grouped data after aggregation."],
  ["exam-3", "Exam Paper Topics", "Which JOIN returns all rows even if there is no match?", ["LEFT JOIN", "INNER JOIN", "RANK JOIN", "PARTITION JOIN"], 0, "LEFT JOIN keeps unmatched rows from the left table."],
  ["exam-4", "Exam Paper Topics", "Why is SELECT * discouraged in production systems?", ["It increases unnecessary data retrieval", "It deletes indexes", "It stops joins", "It commits transactions automatically"], 0, "Returning unused columns wastes resources."],
  ["exam-5", "Exam Paper Topics", "What is the main purpose of normalization?", ["Reduce redundancy and improve consistency", "Increase duplicate data", "Remove all indexes", "Create distributed systems"], 0, "Normalization reduces repeated data and anomalies."],
  ["exam-6", "Exam Paper Topics", "Which normal form removes partial dependency?", ["1NF", "2NF", "3NF", "BCNF"], 1, "2NF removes partial dependency from composite keys."],
  ["exam-7", "Exam Paper Topics", "Which normal form removes transitive dependency?", ["1NF", "2NF", "3NF", "4NF"], 2, "3NF removes non-key dependencies on non-key attributes."],
  ["exam-8", "Exam Paper Topics", "What is denormalization mainly used for?", ["Improving read performance", "Improving password security", "Removing joins completely", "Replacing transactions"], 0, "Denormalization trades redundancy for speed."],
  ["exam-9", "Exam Paper Topics", "Which command permanently saves a transaction?", ["COMMIT", "ROLLBACK", "GRANT", "DROP"], 0, "COMMIT saves transaction changes."],
  ["exam-10", "Exam Paper Topics", "Which ACID property prevents dirty reads?", ["Atomicity", "Consistency", "Isolation", "Durability"], 2, "Isolation separates transactions."],

  ["hard-1", "Hard SQL Questions", "What happens if a query applies a function directly to an indexed column?", ["Indexes may not be used efficiently", "The index becomes encrypted", "The database crashes", "GROUP BY becomes faster"], 0, "Functions on indexed columns can prevent index usage."],
  ["hard-2", "Hard SQL Questions", "Which query keeps all employee rows while calculating department averages?", ["AVG(salary) OVER(PARTITION BY department)", "GROUP BY department", "HAVING AVG(salary)", "ORDER BY department"], 0, "Window functions preserve individual rows."],
  ["hard-3", "Hard SQL Questions", "What is a dirty read?", ["Reading uncommitted data from another transaction", "Reading duplicate rows", "Reading encrypted data", "Reading data without indexes"], 0, "Dirty reads occur when uncommitted changes are visible."],
  ["hard-4", "Hard SQL Questions", "Which isolation level allows dirty reads?", ["READ UNCOMMITTED", "SERIALIZABLE", "REPEATABLE READ", "READ ONLY"], 0, "READ UNCOMMITTED has the weakest isolation."],
  ["hard-5", "Hard SQL Questions", "Which operation is usually most affected by too many indexes?", ["INSERT", "SELECT", "COMMIT", "COUNT"], 0, "INSERT operations must update every index."],
  ["hard-6", "Hard SQL Questions", "What is cardinality in indexing?", ["The uniqueness of values in a column", "The number of tables", "The number of users", "The transaction size"], 0, "High-cardinality columns are often good indexing candidates."],
  ["hard-7", "Hard SQL Questions", "Which JOIN can create a Cartesian product?", ["CROSS JOIN", "LEFT JOIN", "INNER JOIN", "WINDOW JOIN"], 0, "CROSS JOIN combines every row with every row."],
  ["hard-8", "Hard SQL Questions", "Why are recursive CTEs useful?", ["Traversing hierarchical data", "Removing indexes", "Encrypting passwords", "Stopping transactions"], 0, "Recursive CTEs are useful for trees and hierarchies."],
  ["hard-9", "Hard SQL Questions", "What is replication lag?", ["Delay between data copies syncing", "Index corruption", "Failed transactions", "Password timeout"], 0, "Replication lag means replicas are behind the primary node."],
  ["hard-10", "Hard SQL Questions", "Which distributed database feature hides where the data is stored?", ["Transparency", "Replication", "Durability", "Normalization"], 0, "Transparency hides physical storage complexity."],

  ["trick-1", "Tricky Questions", "Which statement about indexes is TRUE?", ["Indexes always improve performance", "Indexes improve reads but may slow writes", "Indexes remove duplicate rows", "Indexes replace primary keys"], 1, "Indexes speed up reads but add overhead to writes."],
  ["trick-2", "Tricky Questions", "Which clause can use aggregate functions directly?", ["HAVING", "WHERE", "JOIN", "FROM"], 0, "HAVING is used with grouped aggregate conditions."],
  ["trick-3", "Tricky Questions", "Which SQL statement would MOST likely avoid index use?", ["WHERE salary > 50000", "WHERE UPPER(name)='JOHN'", "WHERE id=10", "WHERE date>'2025-01-01'"], 1, "Functions on columns often reduce index efficiency."],
  ["trick-4", "Tricky Questions", "What is the biggest difference between GROUP BY and window functions?", ["Window functions keep individual rows", "GROUP BY is faster in every case", "GROUP BY creates indexes", "Window functions delete duplicates"], 0, "GROUP BY collapses rows while window functions keep them."],
  ["trick-5", "Tricky Questions", "Which JOIN type returns only unmatched rows?", ["No standard JOIN does this alone", "INNER JOIN", "LEFT JOIN", "FULL JOIN"], 0, "You usually combine a LEFT JOIN with WHERE NULL."],
  ["trick-6", "Tricky Questions", "Why can distributed databases improve availability?", ["If one node fails others can continue", "They remove ACID", "They disable indexes", "They avoid transactions"], 0, "Multiple nodes improve resilience."],
  ["trick-7", "Tricky Questions", "Which command would remove a user's ability to INSERT data?", ["REVOKE INSERT", "DROP INSERT", "DELETE INSERT", "DENY SELECT"], 0, "REVOKE removes privileges."],
  ["trick-8", "Tricky Questions", "Which SQL concept is BEST for readability in large queries?", ["CTEs", "Indexes", "ROLLBACK", "MAC"], 0, "CTEs make large queries easier to understand."],
  ["trick-9", "Tricky Questions", "Which Big Data V refers to many different data formats?", ["Variety", "Velocity", "Volume", "Validity"], 0, "Variety means multiple data types and formats."],
  ["trick-10", "Tricky Questions", "Which isolation level gives the strongest consistency?", ["SERIALIZABLE", "READ UNCOMMITTED", "READ FAST", "PARTITIONED"], 0, "SERIALIZABLE provides the strictest isolation."]
];

rawQuestions.push(
  ["exam-11", "Exam Paper Topics", "Which SQL clause is executed first?", ["FROM", "WHERE", "SELECT", "ORDER BY"], 0, "FROM is processed before WHERE and SELECT."],
  ["exam-12", "Exam Paper Topics", "Which operation is usually slower on a heavily indexed table?", ["INSERT", "SELECT", "COUNT", "READ"], 0, "More indexes increase write overhead."],
  ["exam-13", "Exam Paper Topics", "What is the purpose of a foreign key?", ["Link tables together", "Create indexes", "Delete duplicates", "Speed up backups"], 0, "Foreign keys maintain relationships between tables."],
  ["exam-14", "Exam Paper Topics", "Which JOIN returns all matching and non-matching rows from both tables?", ["FULL OUTER JOIN", "INNER JOIN", "LEFT JOIN", "WINDOW JOIN"], 0, "FULL OUTER JOIN returns all rows from both tables."],
  ["exam-15", "Exam Paper Topics", "Which SQL statement removes a table and its data permanently?", ["DROP TABLE", "DELETE", "ROLLBACK", "TRUNCATE VIEW"], 0, "DROP TABLE removes both structure and data."],

  ["hard-11", "Hard SQL Questions", "Why can SELECT * hurt index-only scans?", ["Extra columns may force table access", "It removes indexes", "It disables joins", "It duplicates rows"], 0, "Fetching unnecessary columns can stop efficient index-only reads."],
  ["hard-12", "Hard SQL Questions", "Which isolation problem occurs when the same query returns different results in one transaction?", ["Non-repeatable read", "Dirty write", "Lost index", "Dead node"], 0, "Non-repeatable reads occur when data changes between reads."],
  ["hard-13", "Hard SQL Questions", "What is a deadlock?", ["Transactions waiting forever on each other", "A failed JOIN", "An unused index", "A broken backup"], 0, "Deadlocks happen when transactions block each other."],
  ["hard-14", "Hard SQL Questions", "Which command is most useful for checking query performance?", ["EXPLAIN ANALYZE", "GRANT", "ROLLBACK", "TRUNCATE"], 0, "EXPLAIN ANALYZE shows the execution plan and timings."],
  ["hard-15", "Hard SQL Questions", "What is sharding?", ["Splitting data across multiple servers", "Backing up indexes", "Removing duplicates", "Encrypting rows"], 0, "Sharding distributes data across nodes."],

  ["trick-11", "Tricky Questions", "Which statement about HAVING is TRUE?", ["HAVING filters grouped results", "HAVING runs before WHERE", "HAVING replaces GROUP BY", "HAVING creates indexes"], 0, "HAVING filters after aggregation."],
  ["trick-12", "Tricky Questions", "Which query is MOST likely to use an index efficiently?", ["WHERE customer_id = 15", "WHERE LOWER(name)='john'", "WHERE YEAR(date)=2025", "WHERE salary*2 > 1000"], 0, "Simple equality checks on indexed columns are efficient."],
  ["trick-13", "Tricky Questions", "What does COUNT(*) count?", ["All rows", "Only non-null rows", "Only indexed rows", "Only grouped rows"], 0, "COUNT(*) counts every row."],
  ["trick-14", "Tricky Questions", "Which statement about window functions is TRUE?", ["They can calculate running totals", "They delete rows", "They replace indexes", "They prevent GROUP BY"], 0, "Window functions are great for rankings and running totals."],
  ["trick-15", "Tricky Questions", "What is the main advantage of replication?", ["Higher availability", "Lower normalization", "Fewer indexes", "No transactions needed"], 0, "Replication improves resilience and availability."],

  ["norm-1", "Normalization", "What problem does normalization mainly reduce?", ["Data redundancy", "Indexes", "Transactions", "User accounts"], 0, "Normalization reduces duplicate data."],
  ["norm-2", "Normalization", "Which normal form requires atomic values?", ["1NF", "2NF", "3NF", "BCNF"], 0, "1NF requires no repeating groups or multi-valued fields."],
  ["norm-3", "Normalization", "What is a transitive dependency?", ["A non-key depending on another non-key", "A table without keys", "A distributed JOIN", "A recursive index"], 0, "3NF removes transitive dependencies."],
  ["norm-4", "Normalization", "Why might denormalization be used?", ["Improve read speed", "Increase security", "Reduce storage", "Remove keys"], 0, "Denormalization can reduce expensive joins."],
  ["norm-5", "Normalization", "Which normal form is stricter than 3NF?", ["BCNF", "1NF", "2NF", "0NF"], 0, "BCNF is a stronger version of 3NF."],

  ["security-1", "Security Advanced", "What is SQL injection?", ["Malicious SQL inserted into inputs", "A backup failure", "An indexing technique", "A distributed query"], 0, "SQL injection exploits unsafe input handling."],
  ["security-2", "Security Advanced", "Which technique helps prevent SQL injection?", ["Prepared statements", "SELECT *", "Cross joins", "ROLLBACK only"], 0, "Prepared statements separate SQL from user input."],
  ["security-3", "Security Advanced", "What does encryption protect?", ["Data confidentiality", "Indexes", "JOIN performance", "Replication lag"], 0, "Encryption protects sensitive data from unauthorized access."],
  ["security-4", "Security Advanced", "What is multi-factor authentication?", ["Using more than one verification method", "Using multiple indexes", "Using two databases", "Using many tables"], 0, "MFA improves login security."],
  ["security-5", "Security Advanced", "Why should admin accounts be limited?", ["To reduce attack risk", "To improve joins", "To normalize tables", "To reduce backups"], 0, "Least privilege reduces damage from compromised accounts."]
);

const questionBank = rawQuestions.map(([id, category, question, options, answer, explanation]) => ({ id, category, question, options, answer, explanation }));
const categories = ["All Topics", "Review Weak Questions", ...Array.from(new Set(questionBank.map((q) => q.category)))];
const STORAGE_KEY = "advancedDatabaseQuizProgressV2";

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function shuffleQuestion(q) {
  const correct = q.options[q.answer];
  const options = shuffle(q.options);
  return { ...q, options, answer: options.indexOf(correct) };
}

function blankProgress() {
  return {
    sessions: [],
    questionStats: {},
    categoryStats: {},
    totalAnswered: 0,
    totalCorrect: 0,
    coins: 0,
    currentStreak: 0,
    bestStreak: 0,
    casinoCooldownUntil: 0,
    quizQuestionsUntilCasino: 0,
    casinoHistory: [],
    xp: 0,
    level: 1,
    dailyChallengeCompleted: false,
    achievements: [],
    examBestScore: 0
  };
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...blankProgress(), ...JSON.parse(saved) } : blankProgress();
  } catch {
    return blankProgress();
  }
}

function percent(correct, total) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

export default function AdvancedDatabasesQuiz() {
  const [screen, setScreen] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [progressData, setProgressData] = useState(blankProgress);
  const [casinoMessage, setCasinoMessage] = useState(null);
  const [tick, setTick] = useState(0);
  const [betAmount, setBetAmount] = useState(25);
  const [rouletteChoice, setRouletteChoice] = useState("Red");
  const [kenoPicks, setKenoPicks] = useState([]);
  const [blackjackHand, setBlackjackHand] = useState(null);
  const [customQuestionCount, setCustomQuestionCount] = useState(20);
  const [examMode, setExamMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState(null);

  useEffect(() => setProgressData(loadProgress()), []);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData)), [progressData]);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (screen !== "quiz" || !examMode || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setScreen("results");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen, examMode, timeLeft]);

  const passMark = Math.ceil(questions.length * 0.75);
  const score = answers.filter((a) => a.correct).length;
  const question = questions[current];
  const quizProgress = questions.length ? ((current + 1) / questions.length) * 100 : 0;

  const weakQuestionIds = useMemo(() => Object.entries(progressData.questionStats || {})
    .filter(([, stat]) => stat.wrong > stat.correct || stat.lastDifficulty === "Hard")
    .map(([id]) => id), [progressData]);

  function getQuestionPool(category) {
    if (category === "All Topics") return questionBank;
    if (category === "Review Weak Questions") {
      const weak = questionBank.filter((q) => weakQuestionIds.includes(q.id));
      return weak.length ? weak : questionBank;
    }
    return questionBank.filter((q) => q.category === category);
  }

  function calculateLevel(xp) {
    return Math.floor(xp / 250) + 1;
  }

  function startQuiz(category, amount = null, timed = false) {
    const pool = shuffle(getQuestionPool(category)).slice(0, amount || getQuestionPool(category).length);
    setQuestions(pool.map(shuffleQuestion));
    setSelectedCategory(category);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowExplanation(false);
    setDifficulty(null);
    setExamMode(timed);
    setTimeLeft(timed ? Math.max((amount || pool.length) * 20, 60) : 0);
    setScreen("quiz");
  }

  function unlockCasinoProgress() {
    setProgressData((prev) => ({
      ...prev,
      quizQuestionsUntilCasino: Math.max(0, (prev.quizQuestionsUntilCasino || 0) - 1)
    }));
  }

  function handleAnswer(index) {
    if (showExplanation) return;
    const correct = index === question.answer;
    const nextStreak = correct ? (progressData.currentStreak || 0) + 1 : 0;
    const earnedCoins = correct ? 10 + Math.min(nextStreak * 2, 30) : 0;

    setProgressData((prev) => {
      const nextXp = (prev.xp || 0) + (correct ? 25 : 5);
      return {
        ...prev,
        xp: nextXp,
        level: calculateLevel(nextXp),
        coins: (prev.coins || 0) + earnedCoins,
        currentStreak: nextStreak,
        bestStreak: Math.max(prev.bestStreak || 0, nextStreak)
      };
    });

    unlockCasinoProgress();

    setSelected(index);
    setShowExplanation(true);
    setAnswers((prev) => [...prev, {
      id: question.id,
      category: question.category,
      question: question.question,
      selected: question.options[index],
      correctAnswer: question.options[question.answer],
      correct,
      difficulty: null,
      earnedCoins
    }]);
  }

  function markDifficulty(level) {
    setDifficulty(level);
    setAnswers((prev) => {
      const copy = [...prev];
      copy[copy.length - 1] = { ...copy[copy.length - 1], difficulty: level };
      return copy;
    });
  }

  function saveSession(finalAnswers) {
    const sessionScore = finalAnswers.filter((a) => a.correct).length;
    const session = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      category: selectedCategory,
      score: sessionScore,
      total: finalAnswers.length,
      percent: percent(sessionScore, finalAnswers.length),
      answers: finalAnswers
    };

    setProgressData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.sessions = [session, ...(next.sessions || [])].slice(0, 30);
      next.totalAnswered = (next.totalAnswered || 0) + finalAnswers.length;
      next.totalCorrect = (next.totalCorrect || 0) + sessionScore;
      finalAnswers.forEach((a) => {
        if (!next.questionStats[a.id]) next.questionStats[a.id] = { attempts: 0, correct: 0, wrong: 0, lastDifficulty: null, category: a.category, question: a.question };
        next.questionStats[a.id].attempts += 1;
        next.questionStats[a.id][a.correct ? "correct" : "wrong"] += 1;
        next.questionStats[a.id].lastDifficulty = a.difficulty || "Not rated";
        if (!next.categoryStats[a.category]) next.categoryStats[a.category] = { attempts: 0, correct: 0, wrong: 0 };
        next.categoryStats[a.category].attempts += 1;
        next.categoryStats[a.category][a.correct ? "correct" : "wrong"] += 1;
      });
      return next;
    });
  }

  function nextQuestion() {
    const finalAnswers = [...answers];
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
      setDifficulty(null);
    } else {
      saveSession(finalAnswers);
      setScreen("results");
    }
  }

  function resetProgress() {
    const cleared = blankProgress();
    setProgressData(cleared);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleared));
  }

  function cooldownMs() {
    return Math.max(0, (progressData.casinoCooldownUntil || 0) - Date.now());
  }

  function cooldownText() {
    const total = Math.ceil(cooldownMs() / 1000);
    if ((progressData.quizQuestionsUntilCasino || 0) > 0) {
      return `${progressData.quizQuestionsUntilCasino} quiz questions needed`;
    }
    if (total <= 0) return "Ready";
    return `${Math.floor(total / 60)}m ${total % 60}s`;
  }

  function validBet() {
    const bet = Number(betAmount);
    if (!Number.isFinite(bet) || bet < 5) return 5;
    return Math.floor(bet);
  }

  function spendCoins(amount) {
    if ((progressData.coins || 0) < amount) {
      setCasinoMessage("Not enough study coins. Earn more by answering questions correctly.");
      return false;
    }
    return true;
  }

  function addCasinoHistory(entry) {
    setProgressData((prev) => ({
      ...prev,
      casinoHistory: [entry, ...(prev.casinoHistory || [])].slice(0, 10)
    }));
  }

  function settleCasino(game, outcome, cost, prize, detail) {
    const net = prize - cost;
    const entry = { id: Date.now(), game, outcome, cost, prize, net, date: new Date().toLocaleString() };
    setProgressData((prev) => ({
      ...prev,
      coins: Math.max(0, (prev.coins || 0) - cost + prize),
      casinoCooldownUntil: Date.now() + 15 * 1000,
      quizQuestionsUntilCasino: 5,
      casinoHistory: [entry, ...(prev.casinoHistory || [])].slice(0, 10)
    }));
    setCasinoMessage(`${game}: ${detail} ${net >= 0 ? "+" : ""}${net} coins.`);
  }

  function playRoulette() {
    const bet = validBet();
    if ((progressData.quizQuestionsUntilCasino || 0) > 0) {
      return setCasinoMessage(`Answer ${progressData.quizQuestionsUntilCasino} more quiz questions before using the casino again.`);
    }
    if (cooldownMs() > 0) return setCasinoMessage(`Cooldown active. Try again in ${cooldownText()}.`);
    if (!spendCoins(bet)) return;
    const numbers = Array.from({ length: 37 }, (_, i) => i);
    const spin = numbers[Math.floor(Math.random() * numbers.length)];
    const colour = spin === 0 ? "Green" : spin % 2 === 0 ? "Black" : "Red";
    const won = rouletteChoice === colour;
    const prize = won ? (colour === "Green" ? bet * 14 : bet * 2) : 0;
    settleCasino("Roulette", won ? "win" : "loss", bet, prize, `You chose ${rouletteChoice}. Wheel landed ${spin} ${colour}.`);
  }

  function drawCard() {
    const card = Math.floor(Math.random() * 13) + 1;
    return Math.min(card, 10);
  }

  function handTotal(cards) {
    return cards.reduce((sum, card) => sum + card, 0);
  }

  function startBlackjack() {
    const bet = validBet();
    if ((progressData.quizQuestionsUntilCasino || 0) > 0) {
      return setCasinoMessage(`Answer ${progressData.quizQuestionsUntilCasino} more quiz questions before using the casino again.`);
    }
    if (cooldownMs() > 0) return setCasinoMessage(`Cooldown active. Try again in ${cooldownText()}.`);
    if (!spendCoins(bet)) return;
    const player = [drawCard(), drawCard()];
    const dealer = [drawCard(), drawCard()];
    setBlackjackHand({ bet, player, dealer, finished: false });
    setCasinoMessage("Blackjack started. Choose Hit or Stand.");
  }

  function blackjackHit() {
    if (!blackjackHand || blackjackHand.finished) return;
    const player = [...blackjackHand.player, drawCard()];
    if (handTotal(player) > 21) {
      settleCasino("Blackjack", "loss", blackjackHand.bet, 0, `You busted with ${handTotal(player)}.`);
      setBlackjackHand({ ...blackjackHand, player, finished: true });
    } else {
      setBlackjackHand({ ...blackjackHand, player });
    }
  }

  function blackjackStand() {
    if (!blackjackHand || blackjackHand.finished) return;
    let dealer = [...blackjackHand.dealer];
    while (handTotal(dealer) < 17) dealer.push(drawCard());
    const playerTotal = handTotal(blackjackHand.player);
    const dealerTotal = handTotal(dealer);
    let outcome = "loss", prize = 0, detail = `You ${playerTotal}, dealer ${dealerTotal}.`;
    if (dealerTotal > 21 || playerTotal > dealerTotal) {
      outcome = "win";
      prize = blackjackHand.bet * 2;
    } else if (playerTotal === dealerTotal) {
      outcome = "push";
      prize = blackjackHand.bet;
    }
    settleCasino("Blackjack", outcome, blackjackHand.bet, prize, detail);
    setBlackjackHand({ ...blackjackHand, dealer, finished: true });
  }

  function toggleKenoPick(num) {
    setKenoPicks((prev) => {
      if (prev.includes(num)) return prev.filter((n) => n !== num);
      if (prev.length >= 5) return prev;
      return [...prev, num];
    });
  }

  function playKeno() {
    const bet = validBet();
    if ((progressData.quizQuestionsUntilCasino || 0) > 0) {
      return setCasinoMessage(`Answer ${progressData.quizQuestionsUntilCasino} more quiz questions before using the casino again.`);
    }
    if (cooldownMs() > 0) return setCasinoMessage(`Cooldown active. Try again in ${cooldownText()}.`);
    if (kenoPicks.length !== 5) return setCasinoMessage("Pick exactly 5 Keno numbers first.");
    if (!spendCoins(bet)) return;
    const draw = shuffle(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 5);
    const matches = kenoPicks.filter((n) => draw.includes(n)).length;
    const multiplier = matches >= 5 ? 12 : matches === 4 ? 5 : matches === 3 ? 2 : matches === 2 ? 1 : 0;
    const prize = bet * multiplier;
    settleCasino("Keno", matches >= 3 ? "win" : matches === 2 ? "push" : "loss", bet, prize, `Draw: ${draw.join(", ")}. You matched ${matches}/5.`);
  }

  function buyShopItem(item) {
    const items = {
      hint: { cost: 40, label: "Hint Token", effect: "Use this as a pretend hint token before answering a hard question." },
      streak: { cost: 75, label: "Streak Shield", effect: "Reward bought: imagine your next wrong answer protects your streak." },
      bonus: { cost: 100, label: "Motivation Badge", effect: "Badge bought. Keep going — this is for staying consistent." }
    };
    const chosen = items[item];
    if (!spendCoins(chosen.cost)) return;
    setProgressData((prev) => ({ ...prev, coins: Math.max(0, (prev.coins || 0) - chosen.cost) }));
    setCasinoMessage(`${chosen.label} bought for ${chosen.cost} coins. ${chosen.effect}`);
  }

  const sessionCategoryStats = useMemo(() => {
    const stats = {};
    answers.forEach((a) => {
      if (!stats[a.category]) stats[a.category] = { total: 0, correct: 0 };
      stats[a.category].total += 1;
      if (a.correct) stats[a.category].correct += 1;
    });
    return stats;
  }, [answers]);

  const weakAreas = Object.entries(sessionCategoryStats).map(([category, stat]) => ({ category, correct: stat.correct, total: stat.total, percent: percent(stat.correct, stat.total) })).sort((a, b) => a.percent - b.percent);
  const allTimeCategories = Object.entries(progressData.categoryStats || {}).map(([category, stat]) => ({ category, ...stat, percent: percent(stat.correct, stat.attempts) })).sort((a, b) => a.percent - b.percent);
  const hardQuestions = Object.entries(progressData.questionStats || {}).map(([id, stat]) => ({ id, ...stat, percent: percent(stat.correct, stat.attempts) })).filter((q) => q.wrong > 0 || q.lastDifficulty === "Hard").sort((a, b) => a.percent - b.percent).slice(0, 8);

  if (screen === "casino") {
    return (
      <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-8">
        <div className="mx-auto max-w-6xl rounded-3xl bg-slate-900 p-8 shadow-2xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-4xl font-bold">Study Coin Casino</h1>
              <p className="mt-2 text-slate-300">Fake study coins only. After each casino game you must answer 5 more quiz questions before playing again.</p>
            </div>
            <button onClick={() => setScreen("home")} className="rounded-2xl bg-white px-5 py-3 font-semibold text-black">Back home</button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl bg-yellow-400 p-5 text-black"><div className="text-sm">Coins</div><div className="text-4xl font-bold">🪙 {progressData.coins || 0}</div></div>
            <div className="rounded-2xl bg-orange-500 p-5 text-black"><div className="text-sm">Current streak</div><div className="text-4xl font-bold">🔥 {progressData.currentStreak || 0}</div></div>
            <div className="rounded-2xl bg-slate-800 p-5"><div className="text-sm text-slate-300">Cooldown</div><div className="text-4xl font-bold">{cooldownText()}</div></div>
            <div className="rounded-2xl bg-slate-800 p-5"><div className="text-sm text-slate-300">Bet</div><input type="number" min="5" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} className="mt-2 w-full rounded-xl bg-slate-950 p-3 text-white" /></div>
          </div>

          {casinoMessage && <div className="mt-6 rounded-2xl bg-blue-900 p-5 font-semibold">{casinoMessage}</div>}

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Roulette</h2>
              <p className="mt-2 text-sm text-slate-300">Pick a colour. Red/Black pays 2x. Green pays 14x.</p>
              <div className="mt-4 flex gap-2">
                {["Red", "Black", "Green"].map((c) => <button key={c} onClick={() => setRouletteChoice(c)} className={`flex-1 rounded-xl px-3 py-2 font-semibold ${rouletteChoice === c ? "bg-yellow-400 text-black" : "bg-slate-700"}`}>{c}</button>)}
              </div>
              <button onClick={playRoulette} disabled={cooldownMs() > 0 || (progressData.coins || 0) < validBet()} className="mt-5 w-full rounded-2xl bg-yellow-400 px-5 py-3 font-semibold text-black disabled:opacity-40">Spin</button>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Blackjack</h2>
              <p className="mt-2 text-sm text-slate-300">Try to get closer to 21 than the dealer. Win pays 2x.</p>
              {blackjackHand && <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-sm"><div>Your cards: {blackjackHand.player.join(", ")} = {handTotal(blackjackHand.player)}</div><div>Dealer: {blackjackHand.finished ? `${blackjackHand.dealer.join(", ")} = ${handTotal(blackjackHand.dealer)}` : `${blackjackHand.dealer[0]}, ?`}</div></div>}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <button onClick={startBlackjack} disabled={cooldownMs() > 0 || (progressData.coins || 0) < validBet()} className="rounded-2xl bg-yellow-400 px-3 py-3 font-semibold text-black disabled:opacity-40">Deal</button>
                <button onClick={blackjackHit} disabled={!blackjackHand || blackjackHand.finished} className="rounded-2xl bg-white px-3 py-3 font-semibold text-black disabled:opacity-40">Hit</button>
                <button onClick={blackjackStand} disabled={!blackjackHand || blackjackHand.finished} className="rounded-2xl bg-white px-3 py-3 font-semibold text-black disabled:opacity-40">Stand</button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Keno</h2>
              <p className="mt-2 text-sm text-slate-300">Pick exactly 5 numbers. More matches = bigger payout.</p>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => <button key={n} onClick={() => toggleKenoPick(n)} className={`rounded-lg py-2 font-bold ${kenoPicks.includes(n) ? "bg-yellow-400 text-black" : "bg-slate-700"}`}>{n}</button>)}
              </div>
              <button onClick={playKeno} disabled={cooldownMs() > 0 || (progressData.coins || 0) < validBet()} className="mt-5 w-full rounded-2xl bg-yellow-400 px-5 py-3 font-semibold text-black disabled:opacity-40">Play Keno</button>
            </div>
          </div>

          <div className="mt-8 rounded-3xl bg-slate-800 p-6">
            <h2 className="text-2xl font-bold">Coin Shop</h2>
            <p className="mt-2 text-sm text-slate-300">Spend coins on study rewards. These are motivational boosts, not real money rewards.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <button onClick={() => buyShopItem("hint")} className="rounded-2xl bg-slate-700 p-4 text-left hover:bg-slate-600"><strong>Hint Token</strong><div className="text-sm text-slate-300">40 coins</div></button>
              <button onClick={() => buyShopItem("streak")} className="rounded-2xl bg-slate-700 p-4 text-left hover:bg-slate-600"><strong>Streak Shield</strong><div className="text-sm text-slate-300">75 coins</div></button>
              <button onClick={() => buyShopItem("bonus")} className="rounded-2xl bg-slate-700 p-4 text-left hover:bg-slate-600"><strong>Motivation Badge</strong><div className="text-sm text-slate-300">100 coins</div></button>
            </div>
          </div>

          <h2 className="mt-8 text-2xl font-bold">Recent plays</h2>
          <div className="mt-4 space-y-3">{(progressData.casinoHistory || []).length === 0 ? <p className="text-slate-400">No casino plays yet.</p> : progressData.casinoHistory.map((p) => <div key={p.id} className="rounded-2xl bg-slate-800 p-4"><div className="flex justify-between"><strong>{p.game} — {p.outcome}</strong><span>{p.net >= 0 ? "+" : ""}{p.net} coins</span></div><div className="text-sm text-slate-400">{p.date}</div></div>)}</div>
        </div>
      </div>
    );
  }

  if (screen === "history") {
    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-8"><div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-4xl font-bold">Progress History</h1><p className="mt-2 text-slate-600">Saved locally in this browser.</p></div><button onClick={() => setScreen("home")} className="rounded-2xl bg-black px-5 py-3 font-semibold text-white">Back home</button></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-5"><Stat label="Coins" value={`🪙 ${progressData.coins || 0}`} /><Stat label="Current streak" value={`🔥 ${progressData.currentStreak || 0}`} /><Stat label="Best streak" value={`🏆 ${progressData.bestStreak || 0}`} /><Stat label="Answered" value={progressData.totalAnswered || 0} /><Stat label="Overall" value={`${percent(progressData.totalCorrect, progressData.totalAnswered)}%`} /></div>
        <h2 className="mt-8 text-2xl font-bold">Weakest categories</h2><div className="mt-4 grid gap-3">{allTimeCategories.length === 0 ? <p className="text-slate-600">No progress yet.</p> : allTimeCategories.map((a) => <Bar key={a.category} label={a.category} right={`${a.correct}/${a.attempts} (${a.percent}%)`} width={a.percent} />)}</div>
        <h2 className="mt-8 text-2xl font-bold">Questions to review</h2><div className="mt-4 space-y-3">{hardQuestions.length === 0 ? <p className="text-slate-600">No weak questions saved yet.</p> : hardQuestions.map((q) => <div key={q.id} className="rounded-2xl border bg-white p-4"><div className="text-sm font-semibold text-slate-500">{q.category} · {q.correct}/{q.attempts} correct · Last rated: {q.lastDifficulty}</div><div className="mt-1 font-bold">{q.question}</div></div>)}</div>
        <h2 className="mt-8 text-2xl font-bold">Recent tests</h2><div className="mt-4 space-y-3">{(progressData.sessions || []).length === 0 ? <p className="text-slate-600">No test history yet.</p> : progressData.sessions.map((s) => <div key={s.id} className="rounded-2xl bg-slate-100 p-4"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><strong>{s.category}</strong><div className="text-sm text-slate-500">{s.date}</div></div><div className="text-xl font-bold">{s.score}/{s.total} ({s.percent}%)</div></div></div>)}</div>
        <button onClick={resetProgress} className="mt-8 rounded-2xl bg-red-100 px-5 py-3 font-semibold text-red-700">Reset all progress</button>
      </div></div>
    );
  }

  if (screen === "home") {
    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-8"><div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><h1 className="text-4xl font-bold tracking-tight">Advanced Databases Theory Test</h1><p className="mt-3 text-slate-600">Random answers, streaks, coins, history, weak-topic review, and casino rewards.</p></div><div className="flex gap-2"><button onClick={() => setScreen("casino")} className="rounded-2xl bg-yellow-400 px-5 py-3 font-semibold text-black">Casino</button><button onClick={() => setScreen("history")} className="rounded-2xl bg-black px-5 py-3 font-semibold text-white">History</button></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-5"><Info label="Pass mark" value="75%" /><Info label="Answered" value={progressData.totalAnswered || 0} /><Info label="Overall" value={`${percent(progressData.totalCorrect, progressData.totalAnswered)}%`} /><Info label="Coins" value={`🪙 ${progressData.coins || 0}`} /><Info label="Streak" value={`🔥 ${progressData.currentStreak || 0}`} /><Info label="Level" value={`⭐ ${progressData.level || 1}`} /><Info label="XP" value={`${progressData.xp || 0} XP`} /></div></div>
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-yellow-200 to-orange-200 p-6 shadow-lg">
          <h2 className="text-2xl font-bold">Daily Challenge</h2>
          <p className="mt-2 text-slate-700">10 mixed random questions with bonus XP.</p>
          <button onClick={() => startQuiz("All Topics", 10, true)} className="mt-4 rounded-2xl bg-black px-6 py-3 font-semibold text-white">Start Daily Challenge</button>
        </div>

        <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold">Random Custom Test</h2>
          <p className="mt-2 text-slate-600">Choose how many random questions you want from all topics.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input type="number" min="5" max={questionBank.length} value={customQuestionCount} onChange={(e) => setCustomQuestionCount(e.target.value)} className="rounded-2xl border p-3 text-lg" />
            <div className="flex gap-2">
              <button onClick={() => startQuiz("All Topics", Math.min(Math.max(Number(customQuestionCount) || 10, 5), questionBank.length), false)} className="rounded-2xl bg-black px-6 py-3 font-semibold text-white">Practice Mode</button>
              <button onClick={() => startQuiz("All Topics", Math.min(Math.max(Number(customQuestionCount) || 10, 5), questionBank.length), true)} className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white">Exam Mode</button>
            </div>
            <span className="text-sm text-slate-500">Max: {questionBank.length} questions</span>
          </div>
        </div>

        <h2 className="mb-4 text-2xl font-semibold">Choose a section</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <button key={category} onClick={() => startQuiz(category)} className="rounded-3xl bg-white p-6 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl"><div className="text-lg font-bold">{category}</div><div className="mt-2 text-sm text-slate-500">{getQuestionPool(category).length} questions</div><div className="mt-4 rounded-full bg-black px-4 py-2 text-center text-sm font-semibold text-white">Start practice</div></button>)}</div>
      </div></div>
    );
  }

  if (screen === "quiz" && question) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-8"><div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-4 text-sm text-slate-600"><button onClick={() => setScreen("home")} className="rounded-full bg-slate-100 px-4 py-2 font-semibold">Exit</button><span>{selectedCategory}</span></div>
        <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-black" style={{ width: `${quizProgress}%` }} /></div>
        <div className="mb-6 flex flex-wrap justify-between gap-3 text-sm text-slate-600"><span>Question {current + 1} of {questions.length}</span><span>Score: {score}/{answers.length || 0}</span><span>🔥 {progressData.currentStreak || 0}</span><span>🪙 {progressData.coins || 0}</span>{examMode && <span>⏱️ {timeLeft}s</span>}</div>
        <div className="mb-3 inline-block rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold">{question.category}</div><h2 className="mb-6 text-2xl font-bold leading-snug">{question.question}</h2>
        <div className="grid gap-3">{question.options.map((option, index) => { const correct = index === question.answer; const chosen = selected === index; let classes = "rounded-2xl border p-4 text-left font-medium transition hover:bg-slate-50"; if (showExplanation && correct) classes += " border-green-500 bg-green-100"; if (showExplanation && chosen && !correct) classes += " border-red-500 bg-red-100"; return <button key={option} onClick={() => handleAnswer(index)} className={classes}>{option}</button>; })}</div>
        {showExplanation && <div className="mt-6 rounded-2xl bg-blue-50 p-5"><div className="font-bold">{selected === question.answer ? "Correct ✅" : "Not quite ❌"}</div><p className="mt-2 text-slate-700">{question.explanation}</p>{answers[answers.length - 1]?.earnedCoins > 0 && <div className="mt-3 rounded-xl bg-yellow-100 p-3 font-bold text-yellow-800">+{answers[answers.length - 1].earnedCoins} study coins earned 🪙</div>}<div className="mt-5"><div className="mb-2 font-semibold">How hard did this feel?</div><div className="flex flex-wrap gap-2">{["Easy", "Medium", "Hard"].map((level) => <button key={level} onClick={() => markDifficulty(level)} className={`rounded-full px-4 py-2 font-semibold ${difficulty === level ? "bg-black text-white" : "bg-white"}`}>{level}</button>)}</div></div><button onClick={nextQuestion} className="mt-5 rounded-2xl bg-black px-6 py-3 font-semibold text-white">{current + 1 < questions.length ? "Next question" : "Finish test"}</button></div>}
      </div></div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8"><div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl"><h1 className="text-center text-4xl font-bold">{examMode ? "Exam Complete" : "Test Complete"}</h1><div className="mt-6 text-center text-5xl font-extrabold">{score}/{questions.length}</div><div className="mt-2 text-center text-xl text-slate-600">{percent(score, questions.length)}% — Pass mark {passMark}/{questions.length}</div><div className={`mx-auto mt-6 max-w-md rounded-2xl p-5 text-center text-xl font-bold ${score >= passMark ? "bg-green-100" : "bg-red-100"}`}>{score >= passMark ? "Passed ✅" : "Needs more practice ❌"}</div><h2 className="mt-8 text-2xl font-bold">Category breakdown</h2><div className="mt-4 grid gap-3">{weakAreas.map((a) => <Bar key={a.category} label={a.category} right={`${a.correct}/${a.total} (${a.percent}%)`} width={a.percent} />)}</div><h2 className="mt-8 text-2xl font-bold">What to revise first</h2><div className="mt-4 rounded-2xl bg-yellow-50 p-5">{weakAreas.filter((a) => a.percent < 75).length === 0 ? <p>You are strong across the topics tested. Keep practising mixed questions.</p> : <ul className="list-disc space-y-2 pl-6">{weakAreas.filter((a) => a.percent < 75).map((a) => <li key={a.category}>Revise <strong>{a.category}</strong> — below 75%.</li>)}</ul>}</div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={() => startQuiz(selectedCategory)} className="flex-1 rounded-2xl bg-black px-6 py-3 font-semibold text-white">Retry same section</button><button onClick={() => startQuiz("Review Weak Questions")} className="flex-1 rounded-2xl bg-yellow-200 px-6 py-3 font-semibold">Review weak questions</button><button onClick={() => setScreen("casino")} className="flex-1 rounded-2xl bg-yellow-400 px-6 py-3 font-semibold">Spend coins</button><button onClick={() => setScreen("home")} className="flex-1 rounded-2xl bg-slate-200 px-6 py-3 font-semibold">Choose section</button></div></div></div>
  );
}

function Stat({ label, value }) {
  return <div className="rounded-2xl bg-slate-100 p-5"><div className="text-sm text-slate-500">{label}</div><div className="text-3xl font-bold">{value}</div></div>;
}

function Info({ label, value }) {
  return <div className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-700">{label}: <strong>{value}</strong></div>;
}

function Bar({ label, right, width }) {
  return <div className="rounded-2xl bg-slate-100 p-4"><div className="flex justify-between font-semibold"><span>{label}</span><span>{right}</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-300"><div className="h-full rounded-full bg-black" style={{ width: `${width}%` }} /></div></div>;
}
