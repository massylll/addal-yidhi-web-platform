import { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import './shareRequest.css';
import {MenuItem, Select} from "@mui/material"

 const ShareRequest = () => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const createRequestMutation = useMutation(
    (newRequest) => makeRequest.post('/requests', newRequest),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['requests']);
        // Optionally, you can show a success message or redirect the user
      },
      onError: (error) => {
        console.error('Error creating request:', error);
        // Handle error display or logging as needed
      },
    }
  );

  const handleShareClick = async (event) => {
    event.preventDefault();
    try {
      const newRequest = {
        category: category,
        description: description,
      };
      createRequestMutation.mutate(newRequest);
      setDescription('');
      setCategory('');
    } catch (error) {
      console.error('Error sharing request:', error);
      // Handle error display or logging as needed
    }
  };

  return (
    <div className="share-request">
      <div className="container">
        <div className="top">
          <img src={`/upload/${currentUser.profilePicture}`} alt="" />
          <input
            type="text"
            placeholder={`Wanna say sum, ${currentUser.username}?`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div className="category-select">
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
          <MenuItem value="Archery">Archery</MenuItem>
            <MenuItem value="Athletics">Athletics</MenuItem>
            <MenuItem value="Basketball">Basketball</MenuItem>
            <MenuItem value="Baseball">Baseball</MenuItem>
            <MenuItem value="Boxing">Boxing</MenuItem>
            <MenuItem value="Cycling">Cycling</MenuItem>
            <MenuItem value="Football">Football</MenuItem>
            <MenuItem value="Golf">Golf</MenuItem>
            <MenuItem value="Gymnastics">Gymnastics</MenuItem>
            <MenuItem value="Handball">Handball</MenuItem>
            <MenuItem value="Hockey">Hockey</MenuItem>
            <MenuItem value="Martial Arts">Martial Arts</MenuItem>
            <MenuItem value="Rugby">Rugby</MenuItem>
            <MenuItem value="Sailing">Sailing</MenuItem>
            <MenuItem value="Skiing">Skiing</MenuItem>
            <MenuItem value="Snowboarding">Snowboarding</MenuItem>
            <MenuItem value="Surfing">Surfing</MenuItem>
            <MenuItem value="Swimming">Swimming</MenuItem>
            <MenuItem value="Table Tennis">Table Tennis</MenuItem>
            <MenuItem value="Tennis">Tennis</MenuItem>
            <MenuItem value="Volleyball">Volleyball</MenuItem>
            <MenuItem value="Weightlifting">Weightlifting</MenuItem>
            <MenuItem value="Wrestling">Wrestling</MenuItem>
          </Select>
        </div>
        <div className="bottom">
          <button onClick={handleShareClick}>Request</button>
        </div>
      </div>
    </div>
  );
};
export default ShareRequest;


