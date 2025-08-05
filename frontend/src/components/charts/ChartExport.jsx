import React, { useState } from 'react';
import { FiDownload, FiImage, FiFileText, FiFile } from 'react-icons/fi';
import { Menu } from '@headlessui/react';
import { exportChartAsImage, exportChartAsPdf, exportChartDataAsCsv } from '../../utils/chartUtils';

const ChartExport = ({ chartId, chartTitle, chartData }) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (format) => {
    if (!chartId) return;
    
    setIsExporting(true);
    
    try {
      switch (format) {
        case 'png':
          await exportChartAsImage(chartId, `${chartTitle || 'chart'}`);
          break;
        case 'pdf':
          await exportChartAsPdf(chartId, `${chartTitle || 'chart'}`, chartTitle);
          break;
        case 'csv':
          if (chartData && chartData.length > 0) {
            exportChartDataAsCsv(chartData, `${chartTitle || 'chart-data'}`);
          } else {
            console.error('No chart data available for CSV export');
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error exporting chart as ${format}:`, error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportOptions = [
    { 
      label: 'PNG Image', 
      icon: <FiImage className="mr-2 h-4 w-4" />, 
      onClick: () => handleExport('png'),
      format: 'png'
    },
    { 
      label: 'PDF Document', 
      icon: <FiFileText className="mr-2 h-4 w-4" />, 
      onClick: () => handleExport('pdf'),
      format: 'pdf'
    },
    { 
      label: 'CSV Data', 
      icon: <FiFile className="mr-2 h-4 w-4" />, 
      onClick: () => handleExport('csv'),
      format: 'csv',
      disabled: !chartData || chartData.length === 0
    },
  ];
  
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button 
          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isExporting}
        >
          <FiDownload className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Menu.Button>
      </div>
      
      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="py-1">
          {exportOptions.map((option) => (
            <Menu.Item key={option.format}>
              {({ active }) => (
                <button
                  onClick={option.onClick}
                  disabled={option.disabled || isExporting}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 ${
                    option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default ChartExport;
