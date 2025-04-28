import React, { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import API from '../services/AxiosInstance';
import { format, parseISO } from 'date-fns';
import '../styles/TransactionsCharts.css';

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend, LineElement, PointElement);

const TransactionsCharts = ({ transactions, authToken, purposes, members }) => {
  const [purposesMap, setPurposesMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurposes = async () => {
      try {
        let purposesArr;

        if (!purposes || !purposes.length) {
          const response = await API.get('/purposes', {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          purposesArr = response.data;
        }else {
          purposesArr = purposes;
        }


        const map = {};
        purposesArr.forEach(p => {
          map[p.id] = p.category;
        });
        setPurposesMap(map);

      } catch (error) {
        console.error('Error fetching purposes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurposes();
  }, [authToken, purposes]);

  if (loading) {
    return <div>Loading charts...</div>;
  }

  if (!transactions.length) {
    return <div>No transactions yet.</div>;
  }

  const purposeSums = {};
  transactions.forEach(tx => {
    const purposeName = purposesMap[tx.purposeId] || 'Unknown';
    purposeSums[purposeName] = (purposeSums[purposeName] || 0) + tx.sum;
  });

  const pieData = {
    labels: Object.keys(purposeSums),
    datasets: [
      {
        label: 'Expenses by Purpose',
        data: Object.values(purposeSums),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FFC107', '#E91E63'],
      },
    ],
  };

  const dateSums = {};
  transactions.forEach(tx => {
    const month = format(parseISO(tx.date), 'yyyy-MM');
    dateSums[month] = (dateSums[month] || 0) + tx.sum;
  });

  const sortedDates = Object.keys(dateSums).sort((a, b) => new Date(a) - new Date(b));

  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Expenses by Date',
        data: sortedDates.map(date => dateSums[date]),
        fill: false,
        borderColor: '#36A2EB',
        backgroundColor: '#36A2EB',
        tension: 0.3,
        pointBackgroundColor: '#36A2EB',
      },
    ],
  };

  let membersData;
  if (members && members.length) {
    const memberSums = {};
    
    transactions.forEach(tx => {
      const member = members.find(m => m.id === tx.memberId);
      const memberName = member ? member.name : 'Unknown';
      memberSums[memberName] = (memberSums[memberName] || 0) + tx.sum;
    });

    membersData = {
      labels: Object.keys(memberSums),
      datasets: [
        {
          label: 'Expenses by Member',
          data: Object.values(memberSums),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FFC107', '#E91E63', '#9C27B0', '#00BCD4'],
        },
      ],
    };
  }


  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Sum',
        },
      },
    },
  };

  return (
    <div className="transactions-charts">
      <div className="pie-chart">
        <h3>Expenses by Purpose</h3>
        <Pie data={pieData} />
      </div>

      <div className="line-chart">
        <h3>Expenses by Date</h3>
        <Line data={lineData} options={lineOptions} />
      </div>

      {members && members.length > 0 && (
        <div className="pie-chart">
          <h3>Expenses by Member</h3>
          <Pie data={membersData} />
        </div>
      )}

    </div>
  );
};

export default TransactionsCharts;
