import { useState } from "react";
import moment from "moment";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Comments from "../comments/Comments";
import "./post.scss";
import TryOutlinedIcon from '@mui/icons-material/TryOutlined';
import { Button, MenuItem, Select } from "@mui/material";

const reasons = [
  "Inappropriate language",
  "Spam",
  "Harassment",
  "Hate speech",
  "Violent content",
  "False information",
  "Irrelevant content",
];

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => res.data)
  );

  const mutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const deleteMutation = useMutation(
    (postId) => makeRequest.delete("/posts/" + postId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  const submitReport = async () => {
    try {
      await makeRequest.post("/reports", { postId: post.id, reason: reportReason });
      // Close the report form after successful submission
      setReportOpen(false);
      // Optionally, you can show a success message or update the UI
    } catch (error) {
      console.error("Error submitting report:", error);
      // Handle error (display error message, etc.)
    }
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.profilePicture} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.username}</span>
              </Link>
              <span className="date">
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
{menuOpen && post.userId === currentUser.id && (
            <Button onClick={handleDelete}>delete</Button>
          )}
          {menuOpen && post.userId !== currentUser.id && (
            <Button onClick={() => setReportOpen(true)}>report</Button>
          )}
        </div>
        <div className="content">
          <p>{post.description}</p>
          <img src={"/upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TryOutlinedIcon/>
            See Comments
          </div>

        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
{reportOpen && (
        <div className="report-form">
          <Select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Select Reason
            </MenuItem>
            {reasons.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </Select>
          <button onClick={submitReport}>Submit Report</button>
          <button onClick={() => setReportOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Post;


