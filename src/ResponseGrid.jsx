import { Data } from './db/json_data';
import './index.css';
import React, { useState, useMemo } from 'react';
import Pagination from './Pagination';
import Select from 'react-select';
function ResponseGrid() {
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // State for filtering and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'asc',
    });
    const [columnVisibility, setColumnVisibility] = useState({});
    // New state for filter visibility
    const [showFilters, setShowFilters] = useState(false);
    const names = [
        'gender',
        'region',
        'age',
        'city',
        'q1_rating',
        'q1_reason',
        'q2_rating',
        'q2_reason',
        'q2_reason-Comment',
        'q3_rating',
        'q3_reason',
        'q4_1_rating',
        'q5_1_rating',
        'rating_outside_توفر المنتجات البترولية',
        'rating_outside_المسافات بين المحطات',
        'rating_outside_النظافة العامة لمرافق المحطة',
        'rating_outside_نظافة وصيانة المسجد',
        'rating_outside_نظافة دورات المياه',
        'rating_outside_مظهر العاملين',
        'rating_outside_تنوع العلامات التجارية (مطاعم ومقاهي)',
        'rating_outside_مستوى التموينات',
        'rating_outside_خدمات السيارات (مغسلة - تغيير زيوت...)',
        'rating_inside_توفر المنتجات البترولية',
        'rating_inside_المسافات بين المحطات',
        'rating_inside_النظافة العامة لمرافق المحطة',
        'rating_inside_توفر المصليات',
        'rating_inside_توفر دورات المياه',
        'rating_inside_مظهر العاملين',
        'rating_inside_التموينات',
        'rating_inside_خدمة تعبئة الماء والهواء المجانية',
        'question1',
        'HappendAt',
        'InstanceId',
    ];
    // Initialize column visibility
    if (Object.keys(columnVisibility).length === 0) {
        const initialVisibility = {};
        names.forEach((name) => {
            initialVisibility[name] = true;
        });
        setColumnVisibility(initialVisibility);
    }
    // Process and filter data
    const processedData = useMemo(() => {
        let result = [...Data];
        // Apply search
        if (searchTerm) {
            result = result.filter((item) => {
                return names.some((name) => {
                    const value = item[name];
                    if (value === undefined || value === null) return false;
                    if (Array.isArray(value)) {
                        return value.some((v) =>
                            v
                                .toString()
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                        );
                    }
                    return value
                        .toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                });
            });
        }
        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                result = result.filter((item) => {
                    const itemValue = item[key];
                    if (itemValue === undefined || itemValue === null)
                        return false;
                    if (Array.isArray(itemValue)) {
                        return itemValue.some(
                            (v) =>
                                v.toString().toLowerCase() ===
                                value.toLowerCase()
                        );
                    }
                    return (
                        itemValue.toString().toLowerCase() ===
                        value.toLowerCase()
                    );
                });
            }
        });
        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue === undefined || aValue === null)
                    return sortConfig.direction === 'asc' ? 1 : -1;
                if (bValue === undefined || bValue === null)
                    return sortConfig.direction === 'asc' ? -1 : 1;
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc'
                        ? aValue - bValue
                        : bValue - aValue;
                }
                const aString = Array.isArray(aValue)
                    ? aValue.join(', ')
                    : aValue.toString();
                const bString = Array.isArray(bValue)
                    ? bValue.join(', ')
                    : bValue.toString();
                return sortConfig.direction === 'asc'
                    ? aString.localeCompare(bString)
                    : bString.localeCompare(aString);
            });
        }
        return result;
    }, [Data, searchTerm, filters, sortConfig]);
    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1); // Reset to first page when sorting
    };
    // Handle filter change
    const handleFilterChange = (key, value) => {
        setFilters((prev) => {
            const newFilters = { ...prev };
            if (value) {
                newFilters[key] = value;
            } else {
                delete newFilters[key];
            }
            return newFilters;
        });
        setCurrentPage(1); // Reset to first page when filtering
    };
    // Toggle column visibility
    const toggleColumnVisibility = (key) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    // Get unique filter values for a column
    const getUniqueValues = (key) => {
        const values = new Set();
        Data.forEach((item) => {
            const value = item[key];
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach((v) => values.add(v.toString()));
                } else {
                    values.add(value.toString());
                }
            }
        });
        return Array.from(values).sort();
    };
    // Calculate pagination indexes
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = processedData.slice(indexOfFirstItem, indexOfLastItem);
    // Generate table header with sorting and conditional filtering
    const header = [
        <th key="id">
            <span>Id</span>
        </th>,
    ];
    names.forEach((name) => {
        if (!columnVisibility[name]) return;
        const isSorted = sortConfig.key === name;
        const sortIcon = isSorted
            ? sortConfig.direction === 'asc'
                ? '↑'
                : '↓'
            : '↕';
        const uniqueValues = getUniqueValues(name);
        const selectOptions = uniqueValues.map((value) => ({
            value,
            label: value,
        }));
        header.push(
            <th key={name}>
                <div className="column-header">
                    <span
                        onClick={() => requestSort(name)}
                        className="sortable-header"
                        title={`Sort by ${name}`}
                    >
                        <span>
                            {name}{' '}
                            <button
                                onClick={() => toggleColumnVisibility(name)}
                                className="visibility-toggle"
                                title={
                                    columnVisibility[name]
                                        ? 'Hide column'
                                        : 'Show column'
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    color="darkgreen"
                                    fill="none"
                                >
                                    <path
                                        d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path
                                        d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                            </button>
                            {isSorted && (
                                <span className="sort-icon">{sortIcon}</span>
                            )}
                        </span>
                    </span>
                    {showFilters && (
                        <div className="filter-controls">
                            <Select
                                className="filter-select"
                                classNamePrefix="select"
                                isClearable
                                isSearchable
                                options={selectOptions}
                                value={
                                    filters[name]
                                        ? {
                                              value: filters[name],
                                              label: filters[name],
                                          }
                                        : null
                                }
                                onChange={(selectedOption) =>
                                    handleFilterChange(
                                        name,
                                        selectedOption?.value || ''
                                    )
                                }
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Filter..."
                                menuPortalTarget={document.body}
                                styles={{
                                    menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                    }),
                                    control: (provided) => ({
                                        ...provided,
                                        minHeight: '30px',
                                        height: '30px',
                                    }),
                                    dropdownIndicator: (provided) => ({
                                        ...provided,
                                        padding: '4px',
                                    }),
                                    clearIndicator: (provided) => ({
                                        ...provided,
                                        padding: '4px',
                                    }),
                                    valueContainer: (provided) => ({
                                        ...provided,
                                        padding: '0 6px',
                                    }),
                                    input: (provided) => ({
                                        ...provided,
                                        margin: '0',
                                    }),
                                }}
                            />
                        </div>
                    )}
                </div>
            </th>
        );
    });
    // Generate table rows
    const rows = currentData.map((item, rowIndex) => {
        const cells = [
            <td key="id">
                <span>{indexOfFirstItem + rowIndex + 1}</span>
            </td>,
        ];
        names.forEach((name) => {
            if (!columnVisibility[name]) return;
            if (!item[name]) {
                cells.push(
                    <td key={name}>
                        <span className="empty-cell">-</span>
                    </td>
                );
            } else if (
                name.includes('rating') &&
                typeof item[name] === 'number'
            ) {
                const rating = item[name];
                cells.push(
                    <td key={name}>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={
                                        star <= rating
                                            ? 'star-filled'
                                            : 'star-empty'
                                    }
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </td>
                );
            } else if (Array.isArray(item[name])) {
                cells.push(
                    <td key={name}>
                        <div className="array-cell">
                            <ol>
                                {item[name].map((value, index) => (
                                    <li key={index}>
                                        <span>{value}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </td>
                );
            } else if (
                name === 'HappendAt' &&
                typeof item[name] === 'string' &&
                item[name].includes('/Date(')
            ) {
                const timestamp = parseInt(
                    item[name].replace('/Date(', '').replace(')/', '')
                );
                const date = new Date(timestamp);
                const formattedDate = date.toLocaleString();
                cells.push(
                    <td key={name}>
                        <span className="date-cell">{formattedDate}</span>
                    </td>
                );
            } else {
                cells.push(
                    <td key={name}>
                        <span>{item[name]}</span>
                    </td>
                );
            }
        });
        return <tr key={rowIndex}>{cells}</tr>;
    });
    return (
        <div className="response-grid-container">
            <div className="controls">
                {/* New Toggle Filters Button */}
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
            </div>
            <table className="table contained alternating-rows">
                <thead>
                    <tr>{header}</tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
            <Pagination
                totalItems={processedData.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
            <details className="column-visibility-controls accordion sm">
                <summary>Toggle Columns:</summary>
                <div className="accordion-content">
                    {names.map((name) => (
                        <label key={name}>
                            <input
                                type="checkbox"
                                checked={columnVisibility[name]}
                                onChange={() => toggleColumnVisibility(name)}
                            />
                            {name}
                        </label>
                    ))}
                </div>
            </details>
        </div>
    );
}
export default ResponseGrid;
