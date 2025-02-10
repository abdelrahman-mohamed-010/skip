import React from "react";

interface TableProps {
  title?: string;
  description?: string;
  tables?: Array<{
    columns: Array<{
      header: string;
      cells?: string[];
    }>;
  }>;
  currentTable?: {
    columns: Array<{
      header: string;
      cells?: string[];
    }>;
  };
}

const Table: React.FC<TableProps> = ({
  title,
  description,
  tables,
  currentTable,
}) => {
  const tableToRender = currentTable || (tables && tables[0]);
  if (!tableToRender) return null;

  const maxRows = Math.max(
    ...(tableToRender.columns?.map((col) => col.cells?.length || 0) || [0])
  );

  return (
    <section className="py-16 px-4 max-w-[1160px] mx-auto bg-white">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl max-md:text-xl text-center font-bold text-secondary mb-12">
            {title}
          </h2>
        )}
        <div
          className={`${description ? "lg:flex-row-reverse flex flex-col gap-8 items-start mb-12" : ""}`}
        >
          <div className={`${description ? "lg:w-1/2 w-full" : "w-full"}`}>
            {description && (
              <div className="prose text-gray-700 mb-8 lg:mb-0 [&_p]:mb-4 last:[&_p]:mb-0 [&_strong]:font-bold [&_em]:italic">
                {description}
              </div>
            )}
          </div>

          {tableToRender && (
            <div className={`w-full ${description ? "lg:w-1/2" : ""}`}>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {tableToRender.columns?.map((column, index) => (
                      <th
                        key={index}
                        className="border border-gray-300 p-4 max-md:p-2 text-left font-semibold max-md:text-sm"
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: maxRows }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b hover:bg-gray-50">
                      {tableToRender.columns?.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className="border border-gray-300 p-4 max-md:p-2 max-md:text-sm"
                        >
                          {column.cells?.[rowIndex] || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Table;
