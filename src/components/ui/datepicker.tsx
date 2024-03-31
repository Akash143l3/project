"use client"
import React, { useState } from "react";

interface DatePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
}) => {
  const handleStartDateChange = (date: Date | null) => {
    onDateChange(date, endDate);
  };

  const handleEndDateChange = (date: Date | null) => {
    onDateChange(startDate, date);
  };

  return (
    <div>
      <label>Start Date:</label>
      <input
        type="date"
        value={startDate ? startDate.toISOString().split("T")[0] : ""}
        onChange={(e) => handleStartDateChange(new Date(e.target.value))}
      />

      <label>End Date:</label>
      <input
        type="date"
        value={endDate ? endDate.toISOString().split("T")[0] : ""}
        onChange={(e) => handleEndDateChange(new Date(e.target.value))}
      />
    </div>
  );
};

export default DatePicker;
