'use client';
import { useState } from 'react';
import YearCalendar from '@/components/quotation/YearCalendar';

import './quotation.scss';


export default function Quotation() {
  const [formData, setFormData] = useState({
    birthYear: null as number | null,
    calendarType: 'hijri' as 'hijri' | 'gregorian'
  });

  const handleYearSelect = (year: number, isGeorgian: boolean) => {
    setFormData({
      birthYear: year,
      calendarType: isGeorgian ? 'gregorian' : 'hijri'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="quotation">
      {/* Pricing Cards Row */}
      {/* <div className="pricing-cards">
        <div className="pricing-card">
          <div className="card-header">
            <span className="card-badge card-badge--trusted">Most trusted</span>
            <input type="checkbox" className="card-checkbox" />
          </div>
          <div className="card-content">
            <div className="plan-icon plan-icon--teal">✓</div>
            <h3 className="plan-name">Executive VVIP</h3>
            <div className="plan-price">24,000</div>
            <div className="plan-total">Total</div>
          </div>
        </div>

        <div className="pricing-card">
          <div className="card-header">
            <span className="card-badge card-badge--trusted">Most trusted</span>
            <input type="checkbox" className="card-checkbox" />
          </div>
          <div className="card-content">
            <div className="plan-icon plan-icon--orange">✓</div>
            <h3 className="plan-name">Gold</h3>
            <div className="plan-price">15,000</div>
            <div className="plan-total">Total</div>
          </div>
        </div>

        <div className="pricing-card">
          <div className="card-header">
            <span className="card-badge card-badge--recommended">Recommended</span>
            <input type="checkbox" className="card-checkbox" />
          </div>
          <div className="card-content">
            <div className="plan-icon plan-icon--teal">✓</div>
            <h3 className="plan-name">Executive VIP</h3>
            <div className="plan-price">13,000</div>
            <div className="plan-total">Total</div>
          </div>
        </div>

        <div className="pricing-card">
          <div className="card-header">
            <span className="card-badge card-badge--trusted">Most trusted</span>
            <input type="checkbox" className="card-checkbox" />
          </div>
          <div className="card-content">
            <div className="plan-icon plan-icon--gray">✓</div>
            <h3 className="plan-name">Silver</h3>
            <div className="plan-price">12,500</div>
            <div className="plan-total">Total</div>
          </div>
        </div>
      </div> */}

      {/* New Footer Section */}
      {/* <div className="footer-container">
        <div className="pricing-summary">
          <div className="summary-header">
            <span className="summary-title">Total Premium Amount</span>
            <div className="summary-info">
              <span className="info-icon">ℹ️</span>
              <span className="vat-text">Inclusive of VAT</span>
            </div>
          </div>
          
          <div className="total-amount">SAR 0</div>
          
          <div className="disclaimer">
            <span className="info-icon">ℹ️</span>
            <span className="disclaimer-text">Price subject to change based on provided information</span>
          </div>

          
        </div>
        
        <button className="buy-now-btn">
          Buy Now
          <span className="arrow-icon">→</span>
        </button>
      </div> */}

<form onSubmit={handleSubmit} className="user-form">
            <div className="form-group">
              <label>Birth Year</label>
              <YearCalendar 
                onYearSelect={handleYearSelect}
                placeholder="Select your birth year"
              />
            </div>
            
            <button type="submit" disabled={!formData.birthYear}>
              Submit
            </button>
            
            {formData.birthYear && (
              <p>
                Selected: {formData.birthYear} ({formData.calendarType})
              </p>
            )}
          </form>
    </div>
  );
}