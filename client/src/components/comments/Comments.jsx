import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import { Button, Select, MenuItem } from "@mui/material";

const reasons = [
  "Inappropriate language",
  "Spam",
  "Harassment",
  "Hate speech",
  "Violent content",
  "False information",
  "Irrelevant content",
];

const Comments = ({ postId }) => {
const [content, setContent] = useState("");
  const [openReportForms, setOpenReportForms] = useState({});
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch comments data
  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => res.data)
  );

  // Mutation to add new comment
  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  // Function to handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate({ content, postId });
    setContent("");
  };

  // Function to submit report
  const submitReport = async (commentId) => {
    try {
      await makeRequest.post("/reports", {
        commentId,
        reason: openReportForms[commentId],
      });
      setOpenReportForms((prev) => ({ ...prev, [commentId]: "" }));
    } catch (error) {
      console.error("Error submitting report:", error);
      // Handle error
    }
  };

  // Function to toggle report form visibility
  const toggleReportForm = (commentId) => {
    setOpenReportForms((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // Function to handle comment deletion
  const handleDelete = async (commentId) => {
    try {
      await makeRequest.delete(`/comments/${commentId}`);
      queryClient.invalidateQueries(["comments"]);
    } catch (error) {
      console.error("Error deleting comment:", error);
      // Handle error
    }
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePicture} alt="" />
        <input
          type="text"
          placeholder="Write a comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={handleCommentSubmit}>Send</Button>
      </div>
      {error ? (
        <div>Something went wrong</div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        data.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={"/upload/" + comment.profilePicture} alt="" />
          <div className="info">
            <span>{comment.username}</span>
            <p>{comment.content}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
            {/* Display delete button for the current user's comment */}
            {currentUser.id === comment.userId && (
              <Button onClick={() => handleDelete(comment.id)}>Delete</Button>
            )}
            {/* Display report button for other users' comments */}
            {currentUser.id !== comment.userId && (
              <Button onClick={() => toggleReportForm(comment.id)}>Report</Button>
            )}
            {/* Display report form if it's open for this comment */}
            {openReportForms[comment.id] && (
              <div className="report-form">
                <Select
                  value={openReportForms[comment.id]}
                  onChange={(e) =>
                    setOpenReportForms((prev) => ({
                      ...prev,
                      [comment.id]: e.target.value,
                    }))
                  }
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
                <Button onClick={() => submitReport(comment.id)}>Submit Report</Button>
              </div>
            )}
          </div>
          ))
      )}
    </div>
  );
};

export default Comments;

