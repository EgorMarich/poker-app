import React from 'react';
import { TableSection as TableSectionType } from '../../config/types';

interface TableSectionProps {
  section: TableSectionType;
  language: string;
}

export const TableSection: React.FC<TableSectionProps> = ({ section, language }) => {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLocalized = (obj: any) => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;
    const value = obj[language] || obj.ru || obj.en;
    return Array.isArray(value) ? value : [value];
  };

  const headers = getLocalized(section.headers);
  const rows = section.rows.map(row => getLocalized(row));

  return (
    <div className="table-section" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#2c3e50' }}>
        {getLocalized(section.title)}
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <thead>
            <tr style={{ background: '#34495e', color: '#fff' }}>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #3e5a6f',
                    textAlign: 'left',
                    fontWeight: 600,
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                style={{
                  background: rowIdx % 2 === 0 ? '#fff' : '#f9f9f9',
                }}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
