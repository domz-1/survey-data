import React from 'react';

const TableCell = ({ name, value, index }) => {
    if (!value) {
        return (
            <td key={name}>
                <span className="empty-cell">-</span>
            </td>
        );
    }

    if (name.includes('rating') && typeof value === 'number') {
        return <RatingCell rating={value} />;
    }

    if (Array.isArray(value)) {
        return <ArrayCell values={value} />;
    }

    if (name === 'HappendAt' && typeof value === 'string' && value.includes('/Date(')) {
        return <DateCell timestamp={value} />;
    }

    return (
        <td key={name}>
            <span>{value}</span>
        </td>
    );
};

const RatingCell = ({ rating }) => (
    <td>
        <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={star <= rating ? 'star-filled' : 'star-empty'}
                >
                    ★
                </span>
            ))}
        </div>
    </td>
);

const ArrayCell = ({ values }) => (
    <td>
        <div className="array-cell">
            <ol>
                {values.map((value, index) => (
                    <li key={index}>
                        <span>{value}</span>
                    </li>
                ))}
            </ol>
        </div>
    </td>
);

const DateCell = ({ timestamp }) => {
    const parsedTimestamp = parseInt(timestamp.replace('/Date(', '').replace(')/', ''));
    const date = new Date(parsedTimestamp);
    const formattedDate = date.toLocaleString();

    return (
        <td>
            <span className="date-cell">{formattedDate}</span>
        </td>
    );
};

export default TableCell;