'use client';
import { useState, useEffect, useRef } from 'react';
import './YearCalendar.scss';

interface YearCalendarProps {
  onYearSelect?: (year: number, isGeorgian: boolean) => void;
  initialYear?: number;
  initialCalendarType?: 'hijri' | 'gregorian';
  placeholder?: string;
  yearsBack?: number; // Number of years to show (default: 50)
}

export default function YearCalendar({ 
  onYearSelect, 
  initialYear, 
  initialCalendarType = 'hijri',
  placeholder = 'Year Of Birth',
  yearsBack = 50
}: YearCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGeorgian, setIsGeorgian] = useState(initialCalendarType === 'gregorian');
  
  // Get current years for both calendar systems
  const getCurrentGregorianYear = () => new Date().getFullYear();
  const getCurrentHijriYear = () => {
    // More accurate Hijri year calculation
    // Hijri calendar started in 622 CE and is about 11 days shorter per year
    const gregorianYear = getCurrentGregorianYear();
    const hijriYear = Math.floor((gregorianYear - 622) * 1.030684);
    return hijriYear + 1; // Adjust for current Hijri year
  };
  
  // Set initial year based on calendar type if not provided
  const getDefaultYear = () => {
    if (initialYear) return initialYear;
    return initialCalendarType === 'gregorian' ? getCurrentGregorianYear() : getCurrentHijriYear();
  };
  
  const [selectedYear, setSelectedYear] = useState<number | null>(getDefaultYear());
  const [displayText, setDisplayText] = useState(placeholder);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Generate dynamic years - current year and previous N years
  const generateYears = (currentYear: number, yearsToShow: number = yearsBack) => {
    const years: number[] = [];
    for (let i = 0; i <= yearsToShow; i++) {
      years.push(currentYear - i);
    }
    return years.sort((a, b) => b - a); // Sort in descending order (newest first)
  };

  // Year data - dynamically generated
  const gregorianYears = generateYears(getCurrentGregorianYear(), yearsBack);
  const hijriYears = generateYears(getCurrentHijriYear(), yearsBack);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        panelRef.current && 
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update display text when year changes
  useEffect(() => {
    if (selectedYear) {
      setDisplayText(`${placeholder} - ${selectedYear}`);
    } else {
      setDisplayText(placeholder);
    }
  }, [selectedYear, placeholder]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleCalendarType = () => {
    const newIsGeorgian = !isGeorgian;
    setIsGeorgian(newIsGeorgian);
    
    // Reset selected year when switching calendar types to current year
    const defaultYear = newIsGeorgian ? getCurrentGregorianYear() : getCurrentHijriYear();
    setSelectedYear(defaultYear);
    
    // Clear manual input and errors
    setInputValue('');
    setInputError('');
  };

  const selectYear = (year: number) => {
    setSelectedYear(year);
    setIsOpen(false);
    
    // Callback to parent component
    if (onYearSelect) {
      onYearSelect(year, isGeorgian);
    }
  };

  const getCurrentYears = () => {
    return isGeorgian ? gregorianYears : hijriYears;
  };

  // Year validation
  const validateYear = (year: number): { isValid: boolean; error: string } => {
    const currentYear = isGeorgian ? getCurrentGregorianYear() : getCurrentHijriYear();
    const minYear = currentYear - 80; // 80 years back
    
    if (year > currentYear) {
      return { isValid: false, error: 'Future years are not allowed' };
    }
    
    if (year < minYear) {
      return { isValid: false, error: `Year cannot be less than ${minYear}` };
    }
    
    return { isValid: true, error: '' };
  };

  // Handle manual input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setInputError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey) ||
        (e.keyCode === 67 && e.ctrlKey) ||
        (e.keyCode === 86 && e.ctrlKey) ||
        (e.keyCode === 88 && e.ctrlKey)) {
      return;
    }
    
    // Ensure only numbers are entered
    if (e.keyCode < 48 || e.keyCode > 57) {
      e.preventDefault();
      return;
    }

    // Check if adding this digit would make the year invalid
    const newValue = inputValue + e.key;
    if (newValue.length <= 4) {
      const year = parseInt(newValue);
      if (!isNaN(year) && newValue.length === 4) {
        const validation = validateYear(year);
        if (!validation.isValid) {
          setInputError(validation.error);
          e.preventDefault();
        }
      }
    } else {
      e.preventDefault(); // Prevent more than 4 digits
    }
  };

  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const year = parseInt(inputValue);
      if (!isNaN(year) && inputValue.length === 4) {
        const validation = validateYear(year);
        if (validation.isValid) {
          setSelectedYear(year);
          setInputValue('');
          setInputError('');
          setIsOpen(false);
          
          if (onYearSelect) {
            onYearSelect(year, isGeorgian);
          }
        } else {
          setInputError(validation.error);
        }
      } else {
        setInputError('Please enter a valid 4-digit year');
      }
    }
  };

  const CalendarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
      <rect x="7" y="14" width="2" height="2" fill="currentColor"/>
      <rect x="11" y="14" width="2" height="2" fill="currentColor"/>
      <rect x="15" y="14" width="2" height="2" fill="currentColor"/>
    </svg>
  );

  return (
    <div className="year-calendar-container">
      {/* Year Dropdown Button */}
      <div 
        className="year-dropdown" 
        ref={dropdownRef}
        onClick={toggleDropdown}
      >
        <span className="dropdown-text">{displayText}</span>
        <div className="calendar-icon">
          <CalendarIcon />
        </div>
      </div>

      {/* Dropdown Panel */}
      <div 
        className={`dropdown-panel ${isOpen ? 'open' : ''}`}
        ref={panelRef}
      >
        {/* Header with Toggle */}
        <div className="panel-header">
          <span className="panel-title">Calendar</span>
          <div className="calendar-toggle">
            <span className={`toggle-label h-label ${!isGeorgian ? 'active' : ''}`}>
              H
            </span>
            <div 
              className={`toggle-switch ${isGeorgian ? 'active' : ''}`}
              onClick={toggleCalendarType}
            >
              <div className="toggle-slider"></div>
            </div>
            <span className={`toggle-label g-label ${isGeorgian ? 'active' : ''}`}>
              G
            </span>
          </div>
        </div>

        {/* Manual Year Input */}
        <div className="manual-input-section">
          <div className="input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                handleKeyDown(e);
                handleInputEnter(e);
              }}
              placeholder={`Type year manually (${isGeorgian ? 'Gregorian' : 'Hijri'})`}
              className={`manual-input ${inputError ? 'error' : ''}`}
              maxLength={4}
            />
            <span className="input-hint">Press Enter to select</span>
          </div>
          {inputError && (
            <div className="error-message">{inputError}</div>
          )}
        </div>

        {/* Year Lists */}
        {!isGeorgian ? (
          // Dual column view for Hijri mode
          <div className="year-lists-container">
            {/* Gregorian Years (Left Column) */}
            {/* <div className="year-column gregorian-column">
              {gregorianYears.map((year) => (
                <div 
                  key={`gregorian-${year}`}
                  className={`year-item ${selectedYear === year ? 'selected' : ''}`}
                  onClick={() => selectYear(year)}
                >
                  {year}
                </div>
              ))}
            </div> */}

            {/* Hijri Years (Right Column) */}
            <div className="year-column hijri-column">
              {hijriYears.map((year) => (
                <div 
                  key={`hijri-${year}`}
                  className={`year-item ${selectedYear === year ? 'selected' : ''}`}
                  onClick={() => selectYear(year)}
                >
                  {year}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Single column view for Georgian mode
          <div className="single-column-container">
            <div className="year-column single-year-column">
              {getCurrentYears().map((year) => (
                <div 
                  key={`single-${year}`}
                  className={`year-item ${selectedYear === year ? 'selected' : ''}`}
                  onClick={() => selectYear(year)}
                >
                  {year}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}