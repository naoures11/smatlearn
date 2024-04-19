import React, { useState, useEffect } from 'react';
import "./PactolusList.css";
import Pactolus from './Pactolus';

function PactolusList() {
  const [pactolusList, setPactolusList] = useState([]);

  useEffect(() => {
    fetchPactolusData();
  }, []);

  const fetchPactolusData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/pactolus');
      if (response.ok) {
        const data = await response.json();
        setPactolusList(data);
        // console.log("meow")
        console.log(data)
      } else {
        throw new Error('Error fetching pactolus data');
      }
    } catch (error) {
      console.error('Error fetching pactolus data:', error);
    }
  };

  return (
    <div className='pactolusList'>

      {pactolusList.map(pactolus => (
        <Pactolus key={pactolus.id} pactolus={pactolus} />
      ))}

    </div>
  );
}

export default PactolusList;
