import React from 'react';

const Controls = ({
    searchTerm,
    setSearchTerm,
    setCurrentPage,
    showFilters,
    setShowFilters,
    filters,
    handleFilterChange,
    indexOfFirstItem,
    indexOfLastItem,
    processedData,
    Data
}) => (
    <div className="controls">
        <SearchBox
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
        />
        <ActiveFilters
            filters={filters}
            handleFilterChange={handleFilterChange}
        />
        <StatsAndDownload
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            processedData={processedData}
            Data={Data}
        />
    </div>
);

const SearchBox = ({ searchTerm, setSearchTerm, setCurrentPage, showFilters, setShowFilters }) => (
    <div className="search-box">
        <input
            type="text"
            placeholder="Search across all columns..."
            value={searchTerm}
            onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
            }}
        />
        <button
            onClick={() => setSearchTerm('')}
            disabled={!searchTerm}
            className="clear-btn"
        >
            Clear
        </button>
        <button
            onClick={() => setShowFilters(!showFilters)}
            className="toggle-filters-btn"
        >
            {showFilters ? 'Hide Filter' : 'Show Filter'}
        </button>
    </div>
);

const ActiveFilters = ({ filters, handleFilterChange }) => (
    <div className="active-filters">
        {Object.entries(filters).map(([key, value]) => (
            <span key={key} className="filter-tag">
                {key}: {value}
                <button onClick={() => handleFilterChange(key, '')}>
                    ×
                </button>
            </span>
        ))}
    </div>
);

const StatsAndDownload = ({ indexOfFirstItem, indexOfLastItem, processedData, Data }) => (
    <div className='stats-and-download'>
        <span className="stats">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, processedData.length)} of{' '}
            {processedData.length} records
            {processedData.length !== Data.length && (
                <span className="filtered-count">
                    {' '}
                    (filtered from {Data.length})
                </span>
            )}
        </span>
        <span>
            <a href="./final_files/survey_data.csv" download className='download'>Download CSV</a>
            <a href="./final_files/survey_data.xlsx" download className='download'>Download Excel</a>
        </span>
    </div>
);

export default Controls;