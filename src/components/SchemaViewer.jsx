import { useState, useEffect } from 'react';
import { getTableNames, getTableSchema } from '../services/database';
import './SchemaViewer.css';

function SchemaViewer({ currentDatabase }) {
    const [tables, setTables] = useState([]);
    const [schemas, setSchemas] = useState({});
    const [expandedTable, setExpandedTable] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        try {
            const tableNames = getTableNames();
            setTables(tableNames);

            // Load all schemas
            const allSchemas = {};
            tableNames.forEach(table => {
                allSchemas[table] = getTableSchema(table);
            });
            setSchemas(allSchemas);

            // Expand first table by default
            if (tableNames.length > 0 && !expandedTable) {
                setExpandedTable(tableNames[0]);
            }
        } catch (error) {
            console.error('Error loading schema:', error);
            setTables([]);
            setSchemas({});
        } finally {
            setIsLoading(false);
        }
    }, [currentDatabase]); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleTable = (tableName) => {
        setExpandedTable(expandedTable === tableName ? null : tableName);
    };

    if (isLoading) {
        return (
            <div className="schema-viewer">
                <h3 className="schema-title">
                    📊 Schema: {currentDatabase.charAt(0).toUpperCase() + currentDatabase.slice(1)}
                </h3>
                <div className="schema-loading">Loading schema...</div>
            </div>
        );
    }

    if (tables.length === 0) {
        return (
            <div className="schema-viewer">
                <h3 className="schema-title">
                    📊 Schema: {currentDatabase.charAt(0).toUpperCase() + currentDatabase.slice(1)}
                </h3>
                <div className="no-tables">No tables found</div>
            </div>
        );
    }

    return (
        <div className="schema-viewer">
            <h3 className="schema-title">
                📊 Schema: {currentDatabase.charAt(0).toUpperCase() + currentDatabase.slice(1)}
            </h3>

            <div className="tables-list">
                {tables.map(table => (
                    <div key={table} className="table-item">
                        <button
                            className={`table-header ${expandedTable === table ? 'expanded' : ''}`}
                            onClick={() => toggleTable(table)}
                            type="button"
                            aria-expanded={expandedTable === table}
                        >
                            <span className="table-icon">📋</span>
                            <span className="table-name">{table}</span>
                            <span className="expand-icon">{expandedTable === table ? '▼' : '▶'}</span>
                        </button>

                        {expandedTable === table && schemas[table] && schemas[table].length > 0 && (
                            <div className="table-columns">
                                {schemas[table].map(col => (
                                    <div key={col.name} className="column-item">
                                        <span className={`column-name ${col.pk ? 'primary-key' : ''}`}>
                                            {col.pk && '🔑 '}{col.name}
                                        </span>
                                        <span className="column-type">{col.type || 'TEXT'}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SchemaViewer;
