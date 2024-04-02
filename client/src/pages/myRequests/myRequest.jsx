import  ShareRequest  from "../../components/shareRequest/shareRequest.jsx";
import Request from "../../components/myRequest/myRequest.jsx";
import { Box } from "@mui/material";


const MyRequest = () => {
  return (
    <div className="home">
      <Box mb="50px">
      <ShareRequest/>
      </Box>
      <Box mt="30px">
      <Request/>
      </Box>
      
    </div>
  )
};
export default MyRequest;
