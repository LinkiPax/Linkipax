import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import './AnalyticsDashboard.css'; // Ensure this CSS file exists and styles the dashboard

const AnalyticsDashboard = ({ profileId, postId }) => {
  const [profileViewData, setProfileViewData] = useState({ labels: [], counts: [] });
  const [postImpressionData, setPostImpressionData] = useState({ labels: [], counts: [] });

  // Fetch Profile View Trends
  const fetchProfileViewTrends = async () => {
    try {
      const response = await axios.get(`/api/profile-views/trends/${profileId}`);
      const labels = response.data.map((item) => item._id);
      const counts = response.data.map((item) => item.count);
      setProfileViewData({ labels, counts });
    } catch (error) {
      console.error('Error fetching profile view trends:', error);
    }
  };

  // Fetch Post Impression Trends
  const fetchPostImpressionTrends = async () => {
    console.log("Fetching post impression trends for postId:", postId);
    try {
      const response = await axios.get(`http://localhost:5000/post-impression/api/post-impressions/trends/${postId}`);
      console.log("Response data:", response.data); // Log the data for debugging
      
      if (!Array.isArray(response.data)) {
        throw new Error('Unexpected response format.');
      }
      
      const labels = response.data.map(item => item._id);
      const counts = response.data.map(item => item.count);
      setPostImpressionData({ labels, counts });
    } catch (error) {
      console.error('Error fetching post impression trends:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchProfileViewTrends();
      await fetchPostImpressionTrends();
    };
    fetchData();
  }, [profileId, postId]);

  return (
    <div className="analytics-dashboard">
      <h2>Analytics Dashboard</h2>

      {/* Profile View Trends */}
      <div className="chart-container">
        <h3>Profile View Trends</h3>
        {profileViewData.labels.length > 0 ? (
          <Line
            data={{
              labels: profileViewData.labels,
              datasets: [
                {
                  label: 'Profile Views',
                  data: profileViewData.counts,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
              ],
            }}
          />
        ) : (
          <p>Loading profile view trends...</p>
        )}
      </div>

      {/* Post Impression Trends */}
      <div className="chart-container">
        <h3>Post Impression Trends</h3>
        {postImpressionData.labels.length > 0 ? (
          <Line
            data={{
              labels: postImpressionData.labels,
              datasets: [
                {
                  label: 'Post Impressions',
                  data: postImpressionData.counts,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                },
              ],
            }}
          />
        ) : (
          <p>Loading post impression trends...</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
