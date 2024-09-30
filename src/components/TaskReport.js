import React, { useState } from 'react';
import axios from 'axios';

const TaskReport = () => {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('json'); // Default to JSON format
  const [reportData, setReportData] = useState(null);
  const token = localStorage.getItem('token');

  const fetchReport = async () => {
    try {
      let queryParams = `?format=${format}`;
      if (status) queryParams += `&status=${status}`;
      if (priority) queryParams += `&priority=${priority}`;
      if (startDate) queryParams += `&startDate=${startDate}`;
      if (endDate) queryParams += `&endDate=${endDate}`;

      const response = await axios.get(`http://localhost:5000/api/tasks/report${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (format === 'csv') {
        // If CSV, download the file
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'task-report.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        // Handle JSON format and display the data
        setReportData(response.data);
      }
    } catch (error) {
      console.error('Error generating report:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Generate Task Summary Report</h2>
      
      {/* Status Filter */}
      <label>Status: </label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Priority Filter */}
      <label>Priority: </label>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">All</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {/* Date Range Filters */}
      <label>Start Date: </label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      
      <label>End Date: </label>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      {/* Format Selection */}
      <label>Report Format: </label>
      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
      </select>

      {/* Submit Button */}
      <button onClick={fetchReport}>Generate Report</button>

      {/* Display JSON Report */}
      {format === 'json' && reportData && (
        <div>
          <h3>Report Data</h3>
          <pre>{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TaskReport;
