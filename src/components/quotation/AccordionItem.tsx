'use client';
import { useState } from 'react';
import './AccordionItem.scss';

interface DependentRecord {
  id: string;
  name: string;
  idNumber: string;
  country: string;
  gender: string;
  relationship: string;
  price: string;
}

interface AccordionItem {
  id: string;
  name: string;
  idNumber: string;
  country: string;
  gender: string;
  price: string;
  badge: string;
  dependents?: DependentRecord[];
}

const sampleData: AccordionItem[] = [
  {
    id: '1',
    name: 'FAISAL HASHIM A ALQATHAM',
    idNumber: '1015408337',
    country: 'المملكة العربية السعودية',
    gender: 'Male',
    price: '1,282.25',
    badge: 'Essential 3.1'
  },
  {
    id: '2',
    name: 'BADR ABDULLA F ALGHAMDI',
    idNumber: '1090343771',
    country: 'المملكة العربية السعودية',
    gender: 'Male',
    price: '1,282.25',
    badge: 'Essential 3.1',
    dependents: [
      {
        id: '2-1',
        name: 'BADR ABDULLA F ALGHAMDI',
        idNumber: '1090343771',
        country: 'المملكة العربية السعودية',
        gender: 'Male',
        relationship: 'Son',
        price: '1,282.25'
      },
      {
        id: '2-2',
        name: 'BADR ABDULLA F ALGHAMDI',
        idNumber: '1090343771',
        country: 'المملكة العربية السعودية',
        gender: 'Male',
        relationship: 'Daughter',
        price: '1,282.25'
      }
    ]
  }
];

export default function AccordionList() {
  const [openItem, setOpenItem] = useState<string>('2'); // Second item open by default

  const toggleItem = (itemId: string) => {
    setOpenItem(openItem === itemId ? '' : itemId);
  };

  return (
    <div className="accordion-list">
      

      {/* Accordion Items */}
      <div className="accordion-items">
        {sampleData.map((item) => (
          <div key={item.id} className="accordion-item">
            {/* Main Record */}
            <div 
              className={`record-row ${openItem === item.id ? 'opened' : ''}`}
              onClick={() => toggleItem(item.id)}
            >
              <div className="record-content">
                <div className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    className="record-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                
                <div className="record-info">
                  <div className="record-header">
                    <span className="record-name">{item.name}</span>
                    <span className="record-badge">{item.badge}</span>
                  </div>
                  <div className="record-details">
                    {item.idNumber} {item.country} {item.gender}
                  </div>
                </div>
              </div>

              <div className="record-actions">
                <div className="price-display">
                  <span className="currency">ر.س</span>
                  <span className="amount">{item.price}</span>
                </div>
                
                <div className="action-buttons">
                  <button className="action-btn edit-btn" onClick={(e) => e.stopPropagation()}>
                    ✏️
                  </button>
                  <button className="action-btn expand-btn">
                    <span className={`expand-arrow ${openItem === item.id ? 'rotated' : ''}`}>
                      ▼
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dependent Records */}
            {item.dependents && (
              <div className={`dependents-container ${openItem === item.id ? 'expanded' : ''}`}>
                {item.dependents.map((dependent) => (
                  <div key={dependent.id} className="dependent-row">
                    <div className="record-content">
                      <div className="checkbox-wrapper">
                        <input 
                          type="checkbox" 
                          className="record-checkbox"
                        />
                      </div>
                      
                      <div className="record-info">
                        <div className="record-header">
                          <span className="record-name">{dependent.name}</span>
                          <span className="record-badge">Essential 3.1</span>
                        </div>
                        <div className="record-details">
                          {dependent.idNumber} {dependent.country} {dependent.gender}
                        </div>
                      </div>
                    </div>

                    <div className="record-actions">
                      <div className="price-display">
                        <span className="currency">ر.س</span>
                        <span className="amount">{dependent.price}</span>
                      </div>
                      
                      <div className="action-buttons">
                        <button className="action-btn edit-btn">✏️</button>
                        <button className="action-btn delete-btn">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}