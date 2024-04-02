import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts", { params: { userId } }).then((res) => res.data)
  );

  return (
    <div className="posts">
      {error ? (
        <div style={{alignItems:"center"}}>This user hasn't posted anything yet</div>
      ) : isLoading ? (
        <div>...</div>
      ) : (
        data.map((post) => <Post post={post} key={post.id} />)
      )}
    </div>
  );
};

export default Posts;
