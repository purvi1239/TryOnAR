The AI Tracks (The Eyes): A machine learning model scans your webcam feed and sticks invisible tracking dots to your facial features (like your eyes and nose).

The Math Calculates (The Brain): The JavaScript code measures the distance and angles between those dots to figure out exactly where the center of your face is, how close you are to the camera (size), and which way you are looking (tilt).

The Engine Draws (The Artist): A 3D graphics engine called Three.js takes that math and draws the .gltf 3D glasses over your video feed at those exact coordinates, updating 30 times a second.

The HTML Overrides (Your Custom Hacks): Because 3D models are made in all different shapes and sizes, your custom HTML attributes (like data-3d-x and data-rotate-x) step in at the very end to manually nudge, shrink, or tilt the glasses so they fit your face perfectly!