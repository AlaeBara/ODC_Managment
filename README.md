# Training Management System - Orange Digital Center Agadir

## Project Overview
This project is a comprehensive Training Management System, specifically developed for the **Orange Digital Center Agadir**. It aims to optimize the management of training programs, candidates, and evaluations within the center. The system offers distinct functionalities for Mentors and Administrators, facilitating the coordination and monitoring of training activities.

## Objective
The main objective of this web application is to improve the efficiency and quality of training processes within the Orange Digital Center Agadir. It enables centralized management of training programs, precise tracking of candidates, and simplified evaluation of programs.

## Features

### Mentor Section
- **Secure Authentication**: 
  - Login with JWT (JSON Web Tokens)
  - Protected routes for authenticated users only
- **Formation Management**:
  - Add new formations
  - Modify existing formations
  - View formations in a calendar
- **Candidate Management**:
  - Import candidates via Excel files
  - View candidates by formation
  - Validate candidates via phone
  - Check attendance for formation days
- **Evaluation**:
  - Generate evaluation links for each formation
  - View anonymous evaluations for each formation
  - Access evaluation statistics and summaries
- **Additional Features**:
  - Search functionality for efficient data retrieval
  - User profile page
  - Cloud storage integration (Google Drive API) for Excel file storage

### Admin Section
- **Secure Authentication**:
  - Login with JWT
  - Protected routes for authenticated Admin only
- **Dashboard**:
  - Overview of key statistics
  - View current and upcoming formations
- **Mentor Management**:
  - Create mentor accounts
  - Delete mentor accounts
- **Formation Overview**:
  - View all existing formations
  - Filter formations by name, date, or mentor
  - Access detailed information for each formation
  - View evaluation summaries for each formation
- **Profile Management**:
  - Admin profile page

### Candidate Evaluation
- **Anonymous Evaluation Submission**:
  - Access evaluation form via unique link
  - Submit evaluations anonymously
  - User-friendly interface for easy completion

## Technical Stack
- Frontend: React
- Backend: Express 
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
- File Handling: Excel file 
- Cloud Storage: Google Drive API integration
