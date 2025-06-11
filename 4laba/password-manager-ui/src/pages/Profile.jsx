import React from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = React.useState(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://192.168.1.64:8000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {profile.email}</p>
      <p>ID: {profile.id}</p>
    </div>
  );
};

export default Profile;
