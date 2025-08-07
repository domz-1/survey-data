import React from 'react';

const ColumnVisibilityControls = ({ names, columnVisibility, toggleColumnVisibility }) => (
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
);

export default ColumnVisibilityControls;