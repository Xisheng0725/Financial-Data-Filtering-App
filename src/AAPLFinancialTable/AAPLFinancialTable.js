import React, { useEffect, useState } from 'react';
import MultiRangeSlider from "multi-range-slider-react";

const AAPLFinancialTable = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const [dateRange, setDateRange] = useState({ min: 2020, max: 2025 });
    const [revenueRange, setRevenueRange] = useState({ min: 1000000, max: 90000000000000 });
    const [netIncomeRange, setNetIncomeRange] = useState({ min: 1000000, max: 900000000000 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://financialmodelingprep.com/api/v3/income-statement/AAPL?apikey=HOBqSMuSkKtZTw303eWwkNAkX1MobSOc'
                );
                const result = await response.json();

                setData(result);

                setRevenueRange({ min: 1000000, max: 90000000000000 });
                setNetIncomeRange({ min: 1000000, max: 900000000000 });
            } catch (err) {
                setError('Failed to fetch data.');
            }
        };

        fetchData();
    }, []);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setData(sortedData);
    };

    const filteredData = data.filter((item) => {
        const year = parseInt(item.date.split("-")[0], 10);
        const revenue = parseInt(item.revenue, 10);
        const netIncome = parseInt(item.netIncome, 10);
    
        return (
          year >= dateRange.min &&
          year <= dateRange.max &&
          revenue >= revenueRange.min &&
          revenue <= revenueRange.max &&
          netIncome >= netIncomeRange.min &&
          netIncome <= netIncomeRange.max
        );
      });

    if (error) return <p className="text-center mt-5 text-lg text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">AAPL Financial Data</h1>
    
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <MultiRangeSlider
                min={2020}
                max={2025}
                step={1}
                minValue={dateRange.min}
                maxValue={dateRange.max}
                ruler={false}
                barInnerColor="#3b82f6"
                onInput={(e) => setDateRange({ min: e.minValue, max: e.maxValue })}
              />
              <p className="text-gray-600 text-sm mt-1">
                From: {dateRange.min} To: {dateRange.max}
              </p>
            </div>
    
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Range</label>
              <MultiRangeSlider
                min={1000000}
                max={900000000000}
                step={1000000}
                minValue={revenueRange.min}
                maxValue={revenueRange.max}
                ruler={false}
                barInnerColor="#3b82f6"
                onInput={(e) => setRevenueRange({ min: e.minValue, max: e.maxValue })}
              />
              <p className="text-gray-600 text-sm mt-1">
                From: ${revenueRange.min.toLocaleString()} To: ${revenueRange.max.toLocaleString()}
              </p>
            </div>
    
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Net Income Range</label>
              <MultiRangeSlider
                min={1000000}
                max={900000000000}
                step={1000000}
                minValue={netIncomeRange.min}
                maxValue={netIncomeRange.max}
                ruler={false}
                barInnerColor="#3b82f6"
                onInput={(e) => setNetIncomeRange({ min: e.minValue, max: e.maxValue })}
              />
              <p className="text-gray-600 text-sm mt-1">
                From: ${netIncomeRange.min.toLocaleString()} To: ${netIncomeRange.max.toLocaleString()}
              </p>
            </div>
          </div>
    
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <th
                    className="px-4 py-3 cursor-pointer border-b border-gray-300"
                    onClick={() => handleSort("date")}
                  >
                    Date {sortConfig.key === "date" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer border-b border-gray-300"
                    onClick={() => handleSort("revenue")}
                  >
                    Revenue {sortConfig.key === "revenue" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer border-b border-gray-300"
                    onClick={() => handleSort("netIncome")}
                  >
                    Net Income {sortConfig.key === "netIncome" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
                  </th>
                  <th className="px-4 py-3 border-b border-gray-300">Gross Profit</th>
                  <th className="px-4 py-3 border-b border-gray-300">EPS</th>
                  <th className="px-4 py-3 border-b border-gray-300">Operating Income</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className="text-gray-700 text-sm even:bg-gray-50 hover:bg-gray-100 transition duration-150">
                    <td className="px-4 py-3 border-b border-gray-200">{item.date}</td>
                    <td className="px-4 py-3 border-b border-gray-200">${item.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 border-b border-gray-200">${item.netIncome.toLocaleString()}</td>
                    <td className="px-4 py-3 border-b border-gray-200">${item.grossProfit.toLocaleString()}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{item.eps}</td>
                    <td className="px-4 py-3 border-b border-gray-200">${item.operatingIncome.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
};

export default AAPLFinancialTable;
