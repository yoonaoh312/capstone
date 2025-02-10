
## Focus Tracking Web Application ##


Overview

The Focus Tracking Web Application is a web-based tool that uses TensorFlow.js and PoseNet(potential use) to track users' body movements 
and monitor their concentration levels. It calculates a focus score and provides feedback on users' study habits over time, 
helping them improve productivity.

Problem Space

Many students/workers struggle to maintain focus during study/work sessions, which impacts their productivity. 
The lack of real-time feedback on their concentration makes it harder for them to recognize when they are becoming distracted. 
This application addresses the need for an interactive tool that tracks focus through motion detection and helps users improve their study routines.

User Profile

- Target Audience: Students, professionals, and anyone looking to improve their focus during study or work sessions.
- Use Case: Users will open the app before their study or work sessions, enabling focus tracking. 
            The app will monitor their movements, providing real-time feedback about staying within the focus zone.
- Special Considerations: The app should be easy to use, with a clear and simple interface for all age groups.
- It will store data locally to ensure privacy and security.

Features

- Pose Tracking with TensorFlow.js: Uses PoseNet from TensorFlow.js to detect the user’s body position and track their movements.
- Focus Zone: The user’s body position is tracked in real-time, with a focus zone displayed on the screen.
              If the user moves out of this zone, the app will provide visual or auditory feedback.
- Focus Score: The app calculates a focus score based on the user’s position and time spent within the focus zone.
               A higher score indicates better focus.
- Timer: Tracks the user's study time. The focus score is updated in real-time, reflecting how much time the user stays in focus.
- Weekly Focus History: The app will generate a weekly report of the user’s focus, showing performance trends over time,
                        including charts or graphs to visualize improvement.

Implementation

- Tech Stack
1. Frontend: React, HTML, SCSS
2. Motion Tracking: TensorFlow.js, PoseNet
3. Timer Functionality: React state management, setInterval
4. Local Storage: localStorage (for storing and tracking focus data)

- APIs
TensorFlow.js API: Used for motion detection and body tracking with PoseNet.
Charting Library: Use libraries like Chart.js for visualizing weekly focus history.

- Sitemap
Home: Displays the focus zone, timer, and focus score.
Focus History: Provides a summary of the user's past week’s focus data, with charts or graphs.
Settings: Allows users to customize the focus zone and app preferences.

- Mockups
Not ready yet. Let me simply explain:
The logo will be at the top left, and there will be a bottom navigation bar with two buttons: 'Start for Today' and 'Check the Improvement.'
Below the navigation bar, there will be a screen with a 'Start' button and a timer that shows how long you have been studying.
Under the screen, there will be a chart with the focus zone and time to show how much you have improved.

- Data
1. Focus Data: Stores time spent in the focus zone, focus score, and the user’s position(might not).
2. User History: Keeps records of the user's focus scores over time to visualize improvement.
3. Endpoints
   GET /focus-history: Retrieves the user’s weekly focus history.
   Example Response: { focusData: [ { day: "Monday", score: 80 }, { day: "Tuesday", score: 75 } ] }
   POST /update-focus: Updates the user’s focus score and position.
   Example Response: { success: true, message: "Focus score updated" }

Roadmap

Feb 11-15: Set up the project with React and integrate TensorFlow.js for motion detection. Begin building the basic UI and pose-tracking functionality.
Feb 16-18: Implement the focus zone and focus score calculation. Set up the timer and integrate local storage for tracking focus data.
Feb 19-20: Create the weekly focus history feature and integrate charting to visualize progress.
Feb 21-23: Test the app, refine the UI, and fix bugs. Write final documentation and prepare the app for presentation.
