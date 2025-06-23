-- Show all database sizes
SELECT table_schema AS db,
       ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.tables
GROUP BY table_schema;

-- Top 10 largest tables
SELECT table_name, 
       ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'bulls_trading'
ORDER BY size_mb DESC
LIMIT 10;

-- Max connections setting
SHOW VARIABLES LIKE 'max_connections';

-- Current active connections
SHOW STATUS LIKE 'Threads_connected';

-- Buffer pool size (used for caching)
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';

-- Top 5 most used slow queries
SELECT DIGEST_TEXT, COUNT_STAR, 
       ROUND(AVG_TIMER_WAIT/1000000000, 2) AS avg_ms
FROM performance_schema.events_statements_summary_by_digest
ORDER BY COUNT_STAR DESC
LIMIT 5;
