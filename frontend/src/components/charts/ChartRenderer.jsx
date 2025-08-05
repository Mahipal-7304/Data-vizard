import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { useGenerateChartMutation } from '../../features/chart/chartApi';
import ChartExport from './ChartExport';
import AIInsights from '../ai/AIInsights';
import { FiRefreshCw } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

const ChartRenderer = ({ fileId }) => {
  const chartRef = useRef(null);
  const [generateChart] = useGenerateChartMutation();
  const { chartType, xAxis, yAxis, zAxis, filters } = useSelector(
    (state) => state.chart
  );
  
  // Generate initial chart
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await generateChart({
          fileId,
          chartType,
          xAxis,
          yAxis,
          zAxis,
          filters,
        }).unwrap();
        
        renderChart(result.data, result.options);
      } catch (error) {
        console.error('Error generating chart:', error);
      }
    };
    
    if (xAxis && yAxis) {
      fetchData();
    }
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [fileId, chartType, xAxis, yAxis, zAxis, filters]);
  
  const renderChart = (data, options) => {
    const ctx = document.getElementById('chart-canvas');
    
    if (!ctx) return;
    
    // Destroy previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    // Create new chart instance
    chartRef.current = new ChartJS(ctx, {
      type: chartType,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: xAxis,
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: yAxis,
            },
            beginAtZero: true,
          },
        },
        ...options,
      },
    });
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleRegenerate}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Refresh Chart"
          >
            <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <ChartExport 
            chartId="chart-canvas" 
            chartTitle={`${xAxis} vs ${yAxis} Chart`}
            chartData={chartData?.datasets?.[0]?.data || []}
          />
        </div>
      </div>
      <div className="flex-1 relative mb-6">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Generating chart...</div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500">
            Error: {error}
          </div>
        ) : (
          <canvas id="chart-canvas" className="w-full h-full" />
        )}
      </div>
      
      {/* AI Insights Section */}
      {chartData && xAxis && yAxis && (
        <AIInsights 
          chartData={chartData} 
          xAxis={xAxis} 
          yAxis={yAxis} 
          chartType={chartType} 
        />
      )}
    </div>
  );
};

export default ChartRenderer;
