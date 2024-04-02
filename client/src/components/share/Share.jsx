import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Button } from "@mui/material";

const Share = () => {
const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const createPostMutation = useMutation(
    (newPost) => makeRequest.post("/posts", newPost),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
      onError: (error) => {
        console.error("Error creating post:", error);
        // Handle error display or logging as needed
      },
    }
  );

  const handleShareClick = async (event) => {
    event.preventDefault();
    let imageUrl = "";
    try {
      if (file) {
        imageUrl = await upload();
      }
      const newPost = {
        description: description,
        img: imageUrl,
      };
      createPostMutation.mutate(newPost);
      setDescription("");
      setFile(null);
    } catch (error) {
      console.error("Error sharing post:", error);
      // Handle error display or logging as needed
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={"/upload/" + currentUser.profilePicture} alt="" />
          <input
            type="text"
            placeholder={`What's on your mind ${currentUser.username}?`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(event) => setFile(event.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="Add Image" />
                <span>Add Image</span>
              </div>
            </label>
<div className="item">
              <img src={Friend} alt="Tag Friends" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <Button style={{borderRadius:"15px"}}  onClick={handleShareClick}>Post</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;

