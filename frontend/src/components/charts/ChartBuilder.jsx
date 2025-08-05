import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setChartType, setXAxis, setYAxis } from '../../features/chart/chartSlice';
import { useGetFileByIdQuery } from '../../features/upload/uploadApi';
import ChartRenderer from './ChartRenderer';

const ChartBuilder = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get file data
  const { data: file, isLoading, error } = useGetFileByIdQuery(fileId);
  
  // Get chart state
  const { chartType, xAxis, yAxis } = useSelector((state) => state.chart);
  
  // Available chart types
  const chartTypes = [
    { id: 'bar', name: 'Bar' },
    { id: 'line', name: 'Line' },
    { id: 'pie', name: 'Pie' },
    { id: 'doughnut', name: 'Doughnut' },
    { id: 'scatter', name: 'Scatter' },
    { id: 'radar', name: 'Radar' },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!file) return <div>File not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Create Chart</h2>
        <button 
          onClick={() => navigate(`/files/${fileId}`)}
          className="btn-secondary"
        >
          Back to File
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="text-lg font-medium mb-4">Chart Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Chart Type</label>
                <select
                  value={chartType}
                  onChange={(e) => dispatch(setChartType(e.target.value))}
                  className="w-full input"
                >
                  {chartTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">X-Axis</label>
                <select
                  value={xAxis || ''}
                  onChange={(e) => dispatch(setXAxis(e.target.value))}
                  className="w-full input"
                >
                  <option value="">Select X-Axis</option>
                  {file.columns.map((col) => (
                    <option key={`x-${col.name}`} value={col.name}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Y-Axis</label>
                <select
                  value={yAxis || ''}
                  onChange={(e) => dispatch(setYAxis(e.target.value))}
                  className="w-full input"
                >
                  <option value="">Select Y-Axis</option>
                  {file.columns
                    .filter(col => col.type === 'number')
                    .map((col) => (
                      <option key={`y-${col.name}`} value={col.name}>
                        {col.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Preview */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow h-full">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div className="h-[500px] flex items-center justify-center">
              {xAxis && yAxis ? (
                <ChartRenderer fileId={fileId} />
              ) : (
                <div className="text-gray-500">
                  Select X and Y axes to generate chart
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartBuilder;
