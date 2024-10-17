import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import TimePreferencesGrid from "./TimePreferencesGrid";
import { saveTimePreferences, fetchTimePreferences } from "../../utils/firestore/userProfile";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";


export default function TimePreferencesPage() {
    const [selectedTimes, setSelectedTimes] = useState([]);
    const auth = getAuth(); // Get the Firebase authentication instance
    const userId = auth.currentUser?.uid; //  get the logged-in user's ID
    const navigate = useNavigate();

    // Fetch saved time preferences when the component loads
    useEffect(() => {
        if (userId) {
            fetchTimePreferences(userId).then((fetchedTimes) => {
                setSelectedTimes(fetchedTimes);
            });
        }
    }, [userId]);

    // Function to save preferences and navigate back to profile page 
    const handleSavePreferences = async () => {
        if (userId) {
            try {
                await saveTimePreferences(userId, selectedTimes);
                navigate(`/profile/${userId}`);
            } catch (error) {
                console.error('Error saving preferences:', error);
            }
        } else {
            console.error('No user is logged in or userId is undefined.');
        }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: "auto", padding: 3, alignItems: "center" }}>
            <Typography variant="h4" align="center" gutterBottom>
                Time Preferences
            </Typography>

            <TimePreferencesGrid selectedTimes={selectedTimes} setSelectedTimes={setSelectedTimes} />

            <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                {/* button that riggers save preferences action */}
                <Button variant="contained" onClick={handleSavePreferences}>
                    Save Preferences
                </Button>
            </Box>
        </Box>
    );
}
