import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [img, setImg] = useState(""); // State to manage new story image

  // Fetch stories data from the backend
  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => res.data)
  );

  // Mutation to add a new story
  const mutation = useMutation(
    (newStory) => {
      return makeRequest.post("/stories", newStory);
    },
    {
      onSuccess: () => {
        // Invalidate the stories query to trigger a refetch
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );

  // Function to handle story upload
  const handleStoryUpload = async () => {
    try {
      // Ensure image is selected
      if (!img) {
        alert("Please select an image.");
        return;
      }

      // Upload new story
      await mutation.mutate({ img });

      // Clear the image input
      setImg("");
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };

  return (
    <div className="stories">
      {/* Form to upload new story */}
      <div className="story">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <img src={`/upload/${currentUser.profilePicture}`} alt="" />
        <span>{currentUser.username}</span>
        <button onClick={handleStoryUpload}><AddBoxOutlinedIcon/></button>
      </div>

      

      {/* Display existing stories */}
      {error ? (
        <div>Something went wrong</div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        data.map((story) => (
          <div className="story" key={story.id}>
            <img src={story.img} alt="" />
            <span>{story.username}</span>
            <span className="date">{moment(story.createdAt).fromNow()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Stories;

