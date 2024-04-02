import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button } from "@mui/material";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    fullname:user.fullname,
    username: user.username,
    email: user.email,
    password: user.password,
    phone_number : user.phoneNumber,
    location: user.location,
  });

  const upload = async (file) => {
    console.log(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users/", user);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    
    
    let coverUrl;
    let profileUrl;
    coverUrl = cover ? await upload(cover) : user.coverPicture;
    profileUrl = profile ? await upload(profile) : user.profilePicture;
    
    mutation.mutate({ ...texts, coverPicture: coverUrl, profilePicture: profileUrl });
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update My Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + user.coverPicture
                  }
                  style={{borderRadius:"50%"}}
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : "/upload/" + user.profilePicture
                  }
                  style={{borderRadius:"50%"}}
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            value={texts.username}
            name="username"
            onChange={handleChange}
          />
          <label>Fullname</label>
          <input
            type="text"
            value={texts.fullname}
            name="fullname"
            onChange={handleChange}
          />
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Phone number</label>
          <input
            type="text"
            value={texts.phone_number}
            name="phoneNumber"
            onChange={handleChange}
          />
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={texts.location}
            onChange={handleChange}
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <Button style={{borderRadius:"15px"}} className="close" onClick={() => setOpenUpdate(false)}>
          close
        </Button>
      </div>
    </div>
  );
};

export default Update;
