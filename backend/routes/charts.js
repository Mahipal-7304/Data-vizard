const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const File = require('../models/File');

// @route   POST api/charts/generate
// @desc    Generate chart data
// @access  Private
router.post('/generate', auth, async (req, res) => {
  const { fileId, chartType, xAxis, yAxis, zAxis, filters = {} } = req.body;

  try {
    // Get the file
    const file = await File.findOne({
      _id: fileId,
      user: req.user.id
    });

    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }

    // Apply filters if any
    let filteredData = [...file.data];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter(item => {
          const itemValue = item.get(key);
          if (itemValue === undefined) return false;
          return itemValue.toString().toLowerCase().includes(value.toString().toLowerCase());
        });
      }
    });

    // Prepare chart data based on chart type
    let chartData;
    const xValues = [];
    const yValues = [];
    const zValues = [];
    const labels = [];
    const datasets = [];

    switch (chartType) {
      case 'bar':
      case 'line':
      case 'pie':
      case 'doughnut':
      case 'radar':
      case 'polarArea':
        // For these chart types, we need x and y axes
        filteredData.forEach(item => {
          const xValue = item.get(xAxis);
          const yValue = parseFloat(item.get(yAxis));
          
          if (xValue !== undefined && !isNaN(yValue)) {
            xValues.push(xValue);
            yValues.push(yValue);
          }
        });

        chartData = {
          labels: xValues,
          datasets: [{
            label: yAxis,
            data: yValues,
            backgroundColor: generateColors(xValues.length, 0.7),
            borderColor: generateColors(xValues.length, 1),
            borderWidth: 1
          }]
        };
        break;

      case 'scatter':
      case 'bubble':
        // For scatter/bubble charts, we need x and y values
        filteredData.forEach(item => {
          const xValue = parseFloat(item.get(xAxis));
          const yValue = parseFloat(item.get(yAxis));
          
          if (!isNaN(xValue) && !isNaN(yValue)) {
            xValues.push(xValue);
            yValues.push(yValue);
            
            // For bubble charts, use z-axis for radius
            if (chartType === 'bubble' && zAxis) {
              zValues.push(parseFloat(item.get(zAxis)) || 1);
            }
          }
        });

        if (chartType === 'bubble' && zAxis) {
          chartData = xValues.map((x, i) => ({
            x: x,
            y: yValues[i],
            r: Math.abs(zValues[i]) || 5 // Ensure radius is positive
          }));
        } else {
          chartData = xValues.map((x, i) => ({
            x,
            y: yValues[i]
          }));
        }
        break;

      case 'radar':
        // For radar charts, we need multiple datasets
        const uniqueCategories = [...new Set(filteredData.map(item => item.get(xAxis)))];
        const groupedData = {};
        
        filteredData.forEach(item => {
          const category = item.get(xAxis);
          const series = item.get(yAxis);
          const value = parseFloat(item.get(zAxis));
          
          if (!isNaN(value)) {
            if (!groupedData[series]) {
              groupedData[series] = Array(uniqueCategories.length).fill(0);
            }
            const index = uniqueCategories.indexOf(category);
            if (index !== -1) {
              groupedData[series][index] = value;
            }
          }
        });
        
        chartData = {
          labels: uniqueCategories,
          datasets: Object.entries(groupedData).map(([label, data], i) => ({
            label,
            data,
            backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
            borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
            pointBackgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`
          }))
        };
        break;

      default:
        return res.status(400).json({ msg: 'Unsupported chart type' });
    }

    res.json({
      chartType,
      data: chartData,
      options: getChartOptions(chartType, xAxis, yAxis, zAxis)
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Helper function to generate colors for charts
function generateColors(count, opacity = 1) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 137.508) % 360; // Golden angle approximation
    colors.push(`hsla(${hue}, 70%, 60%, ${opacity})`);
  }
  return colors;
}

// Helper function to get chart options
function getChartOptions(chartType, xAxis, yAxis, zAxis) {
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${yAxis} by ${xAxis}`,
        font: {
          size: 16
        }
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {}
  };

  if (['bar', 'line'].includes(chartType)) {
    commonOptions.scales = {
      x: {
        title: {
          display: true,
          text: xAxis
        }
      },
      y: {
        title: {
          display: true,
          text: yAxis
        },
        beginAtZero: true
      }
    };
  }

  if (chartType === 'scatter') {
    commonOptions.scales = {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: xAxis
        }
      },
      y: {
        title: {
          display: true,
          text: yAxis
        }
      }
    };
  }

  if (chartType === 'bubble') {
    commonOptions.scales = {
      x: {
        title: {
          display: true,
          text: xAxis
        }
      },
      y: {
        title: {
          display: true,
          text: yAxis
        }
      }
    };
  }

  return commonOptions;
}

module.exports = router;
