import React, { useState, useEffect } from 'react';
import "./AdminDashboard.css";
import jwt_decode from 'jwt-decode';
import { Bar } from 'react-chartjs-2';



import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';



function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPurchasesPerPactolus, setTotalPurchasesPerPactolus] = useState([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRevenuePerPactolus, setTotalRevenuePerPactolus] = useState([]);

  const [mostPurchasedItem, setMostPurchasedItem] = useState("");
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    const rate = (totalPurchases / totalUsers) * 100;
    setConversionRate(rate.toFixed(2));

  }, [totalPurchases,totalUsers]);


  useEffect(() => {
    fetch('http://localhost:3001/api/userscount')
      .then(response => response.json())
      .then(data => {
        setTotalUsers(data.count);
      })
      .catch(error => {
        console.error('Error fetching total number of users:', error);
      });

    fetch('http://localhost:3001/api/purchasescountperpactolus')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setTotalPurchasesPerPactolus(data);

        const mostPurchased = data.reduce((prev, current) => (prev.count > current.count) ? prev : current);
        setMostPurchasedItem(mostPurchased.name);
        console.log("most purchased"+mostPurchased)
      })
      .catch(error => {
        console.error('Error fetching total purchases per Pactolus:', error);
      });

      fetch('http://localhost:3001/api/purchasescount')
      .then(response => response.json())
      .then(data => {
        console.log(data.count)
        setTotalPurchases(data.count);
      })
      .catch(error => {
        console.error('Error fetching total purchases per Pactolus:', error);
      });


        fetch('http://localhost:3001/api/totalrevenue')
          .then(response => response.json())
          .then(data => {
            setTotalRevenue(data.totalRevenue);
            console.log("total revenue")

          })
          .catch(error => {
            console.error('Error fetching total revenue:', error);
          });

        fetch('http://localhost:3001/api/totalrevenueperpactolus')
        .then(response => response.json())
        .then(data => {
          setTotalRevenuePerPactolus(data);
          console.log("total revenue per pactolus")
          console.log(data)

        })
        .catch(error => {
          console.error('Error fetching total revenue per pactolus:', error);
        });



  }, []);

  const token = localStorage.getItem('token');
  const authenticated = token !== null;
  let userName = '';

  if (authenticated) {
    const decodedToken = jwt_decode(token);
    userName = decodedToken.name;
  }

  return (
    <div className='wrapAll'>
      <div className='wrapper-1'>
        {/* <div className='welcome-container'>
          <span className='welcome-back-text'>Welcome back, {userName}!</span>
        </div> */}

        <div className="statistics-container ">


        <div className='statistic-header'>Statistics </div>


<div className='firstrowstat'>





<div className="statistics-box">
       <div className='statistic-icon'><     AttachMoneyIcon /></div>
       <div className='statistic-right'>
        <div className='statistic-text'>
        <div className="count">{totalRevenue} $</div>
          <div className='count'>Total Revenue</div>
          </div>
        </div>
        </div>





        <div className="statistics-box total-user-box">
       <div className='statistic-icon'>< AccountCircleIcon  /></div>
       <div className='statistic-right'>
        <div className='statistic-text'>
        <div className="count">{totalUsers}</div>
          <div className='count'>Total Users</div>
          </div>
        </div>

        </div>




        <div className="statistics-box">
       <div className='statistic-icon'>< ShoppingCartIcon /></div>
       <div className='statistic-right'>
        <div className='statistic-text'>
        <div className="count">{totalPurchases}</div>
          <div className='count'>Total Purchases</div>
          </div>
        </div>
        </div>


</div>





<div className='lastrowstat'>
        <div className="statistics-box-bigger">
       <div className='statistic-icon-bigger'><     AttachMoneyIcon /></div>
       <div className='statistic-name-bigger'>Total revenue  per Course</div>


       <div className='statistic-table-wrap'>
  <table className='statistic-table'>

    <tbody>
      {totalRevenuePerPactolus.map((pactolus) => (
        <tr key={pactolus.name}>
          <td>{pactolus.name}</td>
          <td>{pactolus.total_revenue} $</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </div>





        <div className="statistics-box">
       <div className='statistic-icon'>< TrendingUpIcon/></div>
       <div className='statistic-right'>
        <div className='statistic-text'>
        <div className="count">{conversionRate}%</div>
          <div className='count'>Conversion Rate</div>
          </div>
        </div>
        </div>
        <div className="statistics-box-bigger">
       <div className='statistic-icon-bigger'>< ShoppingCartIcon /></div>
       <div className='statistic-name-bigger'>Total Purchases per Course</div>

  <div className='statistic-table-wrap'>
  <table className='statistic-table'>
    <tbody>
      {totalPurchasesPerPactolus.map((pactolus) => (
        <tr key={pactolus.name}>
          <td>{pactolus.name}</td>
          <td>{pactolus.count}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>

          </div>

{/*
        <div className="statistics-box">


            <div key={pactolus.name} className="pactolus-purchases">
              <h6>{pactolus.name}</h6>
              <div className="count">{pactolus.count}</div>
            </div>
          ))}
        </div> */}

















        </div>


      </div>



    </div>
  );
}

export default AdminDashboard;
