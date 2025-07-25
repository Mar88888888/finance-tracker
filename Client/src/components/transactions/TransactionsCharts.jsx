import { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import API from '../../services/AxiosInstance';
import { format, parseISO } from 'date-fns';
import '../../styles/transactions/TransactionsCharts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

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
        } else {
          purposesArr = purposes;
        }

        const map = {};
        purposesArr.forEach((p) => {
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

  const generateColors = (count) => {
    const colors = [];
    const step = 360 / count;

    for (let i = 0; i < count; i++) {
      const baseHue = i * step;
      const randomOffset = Math.random() * 10 - step / 2;
      const hue = Math.floor((baseHue + randomOffset + 360) % 360);
      const color = `hsl(${hue}, 80%, 55%)`;
      colors.push(color);
    }

    return colors;
  };

  const purposeSums = {};
  transactions.forEach((tx) => {
    const purposeName = purposesMap[tx.purposeId] || 'Unknown';
    purposeSums[purposeName] =
      (purposeSums[purposeName] || 0) + Number(tx.usdEquivalent.toFixed(2));
  });

  const pieData = {
    labels: Object.keys(purposeSums),
    datasets: [
      {
        label: 'Expenses by Purpose',
        data: Object.values(purposeSums),
        backgroundColor: generateColors(Object.keys(purposeSums).length),
        borderColor: '#333',
        borderWidth: 1,
      },
    ],
  };

  const dateSums = {};
  transactions.forEach((tx) => {
    const month = format(parseISO(tx.date), 'yyyy-MM');
    dateSums[month] =
      (dateSums[month] || 0) + Number(tx.usdEquivalent.toFixed(2));
  });

  const sortedDates = Object.keys(dateSums).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const lineData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Expenses by Date',
        data: sortedDates.map((date) => dateSums[date]),
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

    transactions.forEach((tx) => {
      const member = members.find((m) => m.id === tx.userId);
      const memberName = member ? member.name : 'Unknown';
      memberSums[memberName] =
        (memberSums[memberName] || 0) + Number(tx.usdEquivalent.toFixed(2));
    });

    membersData = {
      labels: Object.keys(memberSums),
      datasets: [
        {
          label: 'Expenses by Member',
          data: Object.values(memberSums),
          backgroundColor: generateColors(Object.keys(memberSums).length),
          borderColor: '#333',
          borderWidth: 1,
        },
      ],
    };
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

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
        <Pie data={pieData} options={pieOptions} />
      </div>

      <div className="line-chart">
        <h3>Expenses by Date</h3>
        <Line data={lineData} options={lineOptions} />
      </div>

      {members && members.length > 0 && (
        <div className="pie-chart">
          <h3>Expenses by Member</h3>
          <Pie data={membersData} options={pieOptions} />
        </div>
      )}
    </div>
  );
};

export default TransactionsCharts;
