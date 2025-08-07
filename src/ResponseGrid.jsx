import { Data } from './db/json_data';
import './index.css';
import React, { useState, useMemo } from 'react';
import Pagination from './components/Pagination';
import TableCell from './components/TableCell';
import Controls from './components/Controls';
import ColumnVisibilityControls from './components/ColumnVisibilityControls';
import TableHeader from './components/TableHeader';
const NAMES = [
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
    const [showFilters, setShowFilters] = useState(false);
    // Initialize column visibility
    if (Object.keys(columnVisibility).length === 0) {
        const initialVisibility = {};
        NAMES.forEach((name) => {
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
                return NAMES.some((name) => {
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
        setCurrentPage(1);
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
        setCurrentPage(1);
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
    // Generate table header
    const header = [
        <th key="id">
            <span>Id</span>
        </th>,
    ];
    NAMES.forEach((name) => {
        if (!columnVisibility[name]) return;
        header.push(
            <TableHeader
                key={name}
                name={name}
                sortConfig={sortConfig}
                requestSort={requestSort}
                columnVisibility={columnVisibility}
                toggleColumnVisibility={toggleColumnVisibility}
                filters={filters}
                handleFilterChange={handleFilterChange}
                showFilters={showFilters}
                getUniqueValues={getUniqueValues}
            />
        );
    });
    // Generate table rows
    const rows = currentData.map((item, rowIndex) => {
        const cells = [
            <td key="id">
                <span>{indexOfFirstItem + rowIndex + 1}</span>
            </td>,
        ];
        NAMES.forEach((name) => {
            if (!columnVisibility[name]) return;
            cells.push(
                <TableCell
                    key={name}
                    name={name}
                    value={item[name]}
                    index={rowIndex}
                />
            );
        });
        return <tr key={rowIndex}>{cells}</tr>;
    });
    return (
        <div className="response-grid-container">
            <Controls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setCurrentPage={setCurrentPage}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                filters={filters}
                handleFilterChange={handleFilterChange}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
                processedData={processedData}
                Data={Data}
            />
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
            <ColumnVisibilityControls
                names={NAMES}
                columnVisibility={columnVisibility}
                toggleColumnVisibility={toggleColumnVisibility}
            />
        </div>
    );
}
export default ResponseGrid;
