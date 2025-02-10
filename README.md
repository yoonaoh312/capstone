
##Focus Tracking Web Application##


* Overview

A web application that uses TensorFlow.js for motion detection to track the user's focus. 
The app stores focus data over the course of a month to allow users to monitor their concentration and improve their study habits.

* Required Tech Stack

1. Frontend: React, HTML, SCSS
2. Motion Tracking: TensorFlow.js, PoseNet (for detecting body movements and tracking focus)
3. Timer Functionality: React state management, setInterval
4. Local Storage: localStorage (for storing and tracking focus data)

* Key Features

Pose Tracking with TensorFlow.js: Uses PoseNet from TensorFlow.js to detect and track the user's body movements. 
The system will track whether the user stays within a predefi ned focus zone based on their position.
Focus Score: Calculates a focus score based on the user's position in the focus zone and the time they stay in focus.
Timer: Tracks the total study time and updates the focus score based on how much time the user spends in the focus zone.


* UI Design

Focus Zone Display: The screen shows a focus zone with the user’s position (tracked by PoseNet), letting them know if they are staying focused.
Timer and Focus Score: Displays the timer for how long the user has been focused and the current focus score.
Weekly Focus History: Shows a summary of daily focus data and compares performance over the past week through a simple chart or graph.

* Expected Impact

Improved Focus: By visualizing their concentration and tracking focus over time, users can improve their study habits and productivity.
Real-time Feedback: Users get immediate feedback on their movements and focus, helping them stay within the focus zone and avoid distractions.
Personalized Progress Tracking: With weekly comparisons, users can see how they’ve improved their focus over the past week and make necessary adjustments.
