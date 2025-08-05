const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

class PDFProcessor {
  constructor() {
    this.supportedTypes = ['.pdf'];
  }

  // Main method to process PDF and extract data
  async processPDF(filePath) {
    try {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      
      const result = {
        success: true,
        metadata: {
          pages: data.numpages,
          info: data.info,
          version: data.version,
          text: data.text
        },
        extractedData: {
          text: data.text,
          tables: await this.extractTables(data.text),
          numbers: this.extractNumbers(data.text),
          dates: this.extractDates(data.text),
          structuredData: this.extractStructuredData(data.text)
        }
      };

      return result;
    } catch (error) {
      console.error('PDF processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Extract tables from PDF text
  async extractTables(text) {
    try {
      const tables = [];
      const lines = text.split('\n');
      let currentTable = [];
      let isInTable = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detect table-like patterns (multiple columns separated by spaces/tabs)
        if (this.isTableRow(line)) {
          if (!isInTable) {
            isInTable = true;
            currentTable = [];
          }
          
          const columns = this.parseTableRow(line);
          if (columns.length > 1) {
            currentTable.push(columns);
          }
        } else {
          if (isInTable && currentTable.length > 2) {
            // End of table found, save it
            tables.push({
              id: `table_${tables.length + 1}`,
              rows: currentTable,
              headers: currentTable[0] || [],
              data: currentTable.slice(1) || []
            });
          }
          isInTable = false;
          currentTable = [];
        }
      }

      // Handle last table if exists
      if (isInTable && currentTable.length > 2) {
        tables.push({
          id: `table_${tables.length + 1}`,
          rows: currentTable,
          headers: currentTable[0] || [],
          data: currentTable.slice(1) || []
        });
      }

      return tables;
    } catch (error) {
      console.error('Table extraction error:', error);
      return [];
    }
  }

  // Check if a line looks like a table row
  isTableRow(line) {
    if (!line || line.length < 10) return false;
    
    // Look for patterns that suggest tabular data
    const hasMultipleSpaces = /\s{2,}/.test(line);
    const hasTabs = /\t/.test(line);
    const hasNumbers = /\d/.test(line);
    const hasMultipleWords = line.split(/\s+/).length >= 3;
    
    return (hasMultipleSpaces || hasTabs) && hasNumbers && hasMultipleWords;
  }

  // Parse a table row into columns
  parseTableRow(line) {
    // Split by multiple spaces or tabs
    let columns = line.split(/\s{2,}|\t+/).filter(col => col.trim().length > 0);
    
    // If no clear separation, try to split by single spaces but be more careful
    if (columns.length <= 1) {
      columns = line.split(/\s+/).filter(col => col.trim().length > 0);
    }
    
    return columns.map(col => col.trim());
  }

  // Extract numerical data from text
  extractNumbers(text) {
    const numbers = [];
    const numberPattern = /\b\d+(?:\.\d+)?\b/g;
    let match;
    
    while ((match = numberPattern.exec(text)) !== null) {
      const num = parseFloat(match[0]);
      if (!isNaN(num)) {
        numbers.push({
          value: num,
          position: match.index,
          context: this.getContext(text, match.index, 50)
        });
      }
    }
    
    return numbers;
  }

  // Extract dates from text
  extractDates(text) {
    const dates = [];
    const datePatterns = [
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, // MM/DD/YYYY
      /\b\d{1,2}-\d{1,2}-\d{4}\b/g,   // MM-DD-YYYY
      /\b\d{4}-\d{1,2}-\d{1,2}\b/g,   // YYYY-MM-DD
      /\b\w+ \d{1,2}, \d{4}\b/g       // Month DD, YYYY
    ];
    
    datePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        dates.push({
          value: match[0],
          position: match.index,
          context: this.getContext(text, match.index, 30)
        });
      }
    });
    
    return dates;
  }

  // Extract structured data patterns
  extractStructuredData(text) {
    const structured = {
      keyValuePairs: this.extractKeyValuePairs(text),
      lists: this.extractLists(text),
      sections: this.extractSections(text)
    };
    
    return structured;
  }

  // Extract key-value pairs (Label: Value)
  extractKeyValuePairs(text) {
    const pairs = [];
    const kvPattern = /^([A-Za-z\s]+):\s*(.+)$/gm;
    let match;
    
    while ((match = kvPattern.exec(text)) !== null) {
      pairs.push({
        key: match[1].trim(),
        value: match[2].trim()
      });
    }
    
    return pairs;
  }

  // Extract list items
  extractLists(text) {
    const lists = [];
    const lines = text.split('\n');
    let currentList = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^[\-\*\•]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
        currentList.push(trimmed);
      } else if (currentList.length > 0) {
        lists.push([...currentList]);
        currentList = [];
      }
    }
    
    if (currentList.length > 0) {
      lists.push(currentList);
    }
    
    return lists;
  }

  // Extract sections based on headers
  extractSections(text) {
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Detect headers (all caps, or title case with minimal punctuation)
      if (this.isHeader(trimmed)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: trimmed,
          content: []
        };
      } else if (currentSection && trimmed.length > 0) {
        currentSection.content.push(trimmed);
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  }

  // Check if a line is likely a header
  isHeader(line) {
    if (!line || line.length < 3 || line.length > 100) return false;
    
    const isAllCaps = line === line.toUpperCase() && /[A-Z]/.test(line);
    const isTitleCase = /^[A-Z][a-z]/.test(line) && line.split(' ').every(word => 
      word.length === 0 || /^[A-Z]/.test(word)
    );
    const hasMinimalPunctuation = (line.match(/[.!?]/g) || []).length <= 1;
    
    return (isAllCaps || isTitleCase) && hasMinimalPunctuation;
  }

  // Get context around a position in text
  getContext(text, position, radius = 30) {
    const start = Math.max(0, position - radius);
    const end = Math.min(text.length, position + radius);
    return text.substring(start, end).trim();
  }

  // Convert extracted data to visualization-ready format
  convertToVisualizationData(extractedData) {
    const vizData = {
      datasets: [],
      charts: []
    };

    // Process tables for visualization
    if (extractedData.tables && extractedData.tables.length > 0) {
      extractedData.tables.forEach((table, index) => {
        if (table.data && table.data.length > 0) {
          const dataset = {
            id: `pdf_table_${index}`,
            name: `Table ${index + 1}`,
            type: 'table',
            headers: table.headers,
            data: table.data,
            source: 'pdf'
          };
          
          vizData.datasets.push(dataset);
          
          // Try to create chart suggestions
          const chartSuggestions = this.suggestCharts(table);
          vizData.charts.push(...chartSuggestions);
        }
      });
    }

    // Process numerical data
    if (extractedData.numbers && extractedData.numbers.length > 0) {
      const numericalDataset = {
        id: 'pdf_numbers',
        name: 'Extracted Numbers',
        type: 'numbers',
        data: extractedData.numbers.map(num => ({
          value: num.value,
          context: num.context
        })),
        source: 'pdf'
      };
      
      vizData.datasets.push(numericalDataset);
    }

    return vizData;
  }

  // Suggest appropriate chart types based on table structure
  suggestCharts(table) {
    const suggestions = [];
    
    if (!table.data || table.data.length === 0) return suggestions;
    
    const headers = table.headers || [];
    const data = table.data;
    
    // Look for numeric columns
    const numericColumns = [];
    const textColumns = [];
    
    headers.forEach((header, index) => {
      const columnValues = data.map(row => row[index]).filter(val => val);
      const numericValues = columnValues.filter(val => !isNaN(parseFloat(val)));
      
      if (numericValues.length > columnValues.length * 0.7) {
        numericColumns.push({ index, header, values: numericValues.map(v => parseFloat(v)) });
      } else {
        textColumns.push({ index, header, values: columnValues });
      }
    });
    
    // Suggest charts based on data structure
    if (textColumns.length >= 1 && numericColumns.length >= 1) {
      suggestions.push({
        type: 'bar',
        title: `Bar Chart: ${textColumns[0].header} vs ${numericColumns[0].header}`,
        xAxis: textColumns[0].header,
        yAxis: numericColumns[0].header
      });
      
      suggestions.push({
        type: 'line',
        title: `Line Chart: ${textColumns[0].header} vs ${numericColumns[0].header}`,
        xAxis: textColumns[0].header,
        yAxis: numericColumns[0].header
      });
    }
    
    if (numericColumns.length >= 2) {
      suggestions.push({
        type: 'scatter',
        title: `Scatter Plot: ${numericColumns[0].header} vs ${numericColumns[1].header}`,
        xAxis: numericColumns[0].header,
        yAxis: numericColumns[1].header
      });
    }
    
    return suggestions;
  }
}

module.exports = new PDFProcessor();
