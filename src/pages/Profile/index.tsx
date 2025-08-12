import React from "react";
import ProfileForm from "../../components/Profile/ProfileForm";
import BackButton from "../../components/BackButton";

const Profile: React.FC = () => {
  return (
    <div>
      <BackButton to="/dashboard" variant="linkedin" title={`Profile`} />

      <div className="py-5 mt-5 intro-y box">
        <div className="px-5 sm:px-20">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;
