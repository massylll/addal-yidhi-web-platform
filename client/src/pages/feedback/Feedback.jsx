import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';

import { makeRequest } from "../../axios.js"; // Import the makeRequest instance from your Axios configuration

function Feedback() {
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [commentsThoughts, setCommentsThoughts] = useState('');
    const [postsThoughts, setPostsThoughts] = useState('');
    const [requestsThoughts, setRequestsThoughts] = useState('');
    const [storiesThoughts, setStoriesThoughts] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make POST request to the backend endpoint for submitting feedback using makeRequest
            await makeRequest.post('/feedbacks', { message: feedbackMessage });

            // Make POST request to the backend endpoint for submitting user thoughts
            await makeRequest.post('/feedbacks/thoughts', {
                commentsThoughts,
                postsThoughts,
                requestsThoughts,
                storiesThoughts
            });

            // Set submitted to true to show the confirmation message
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            // Handle error (display error message, etc.)
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', my: 4, p: 3, border: '1px solid #ccc', borderRadius: 4 }}>
            <Typography variant="h4" gutterBottom>
                Submit Feedback
            </Typography>
            {submitted ? (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Thank you for your feedback!
                    </Typography>
                    <Typography variant="body1">
                        We appreciate your input.
                    </Typography>
                </Box>
            ) : (
                <form onSubmit={handleSubmit}>
                    <Typography variant="body1" gutterBottom>
                        Tell us what you think about the comments system:
                    </Typography>
                    <FormControlLabel
                        control={<Checkbox checked={commentsThoughts === 'excellent'} onChange={() => setCommentsThoughts('excellent')} />}
                        label="Excellent"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={commentsThoughts === 'good'} onChange={() => setCommentsThoughts('good')} />}
                        label="Good"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={commentsThoughts === 'bad'} onChange={() => setCommentsThoughts('bad')} />}
                        label="Bad"
                    />
                    <Typography variant="body1" gutterBottom>
                        Tell us what you think about the posts system:
                    </Typography>
                    <FormControlLabel
                        control={<Checkbox checked={postsThoughts === 'excellent'} onChange={() => setPostsThoughts('excellent')} />}
                        label="Excellent"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={postsThoughts === 'good'} onChange={() => setPostsThoughts('good')} />}
                        label="Good"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={postsThoughts === 'bad'} onChange={() => setPostsThoughts('bad')} />}
                        label="Bad"
                    />
                    <Typography variant="body1" gutterBottom>
                        Tell us what you think about the requests system:
                    </Typography>
                    <FormControlLabel
                        control={<Checkbox checked={requestsThoughts === 'excellent'} onChange={() => setRequestsThoughts('excellent')} />}
                        label="Excellent"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={requestsThoughts === 'good'} onChange={() => setRequestsThoughts('good')} />}
                        label="Good"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={requestsThoughts === 'bad'} onChange={() => setRequestsThoughts('bad')} />}
                        label="Bad"
                    />
                    <Typography variant="body1" gutterBottom>
                        Tell us what you think about the stories system:
                    </Typography>
                    <FormControlLabel
                        control={<Checkbox checked={storiesThoughts === 'excellent'} onChange={() => setStoriesThoughts('excellent')} />}
                        label="Excellent"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={storiesThoughts === 'good'} onChange={() => setStoriesThoughts('good')} />}
                        label="Good"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={storiesThoughts === 'bad'} onChange={() => setStoriesThoughts('bad')} />}
                        label="Bad"
                    />
                    <TextField
                        id="feedbackMessage"
                        label="Feedback Message"
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Enter your feedback here..."
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        variant="outlined"
                        sx={{ mt: 2, mb: 2 }}
                    />
                    <Button variant="contained" color="primary" type="submit">
                        Submit Feedback
                    </Button>
                </form>
            )}
        </Box>
    );
}

export default Feedback;

