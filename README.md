# LAB - Class 9

## Project: Survey API

### Author: Jelani R

### Problem Domain  

Create a new application using your API Server and Authentication System learnings.

Time to build something cool! You’ve learned so much and as a class we’ve covered a lot of
material. By giving you the opportunity to build and deploy an Auth Server, you gain fluency,
foster understanding, and put your new skills to work. You may build something that looks and
functions similar to lab-08, or perhaps you build something that surpasses lab-08. Either way,
the goal of this lab is to reinforce any learnings that might need reinforcing.

Your application must employ the following programming concepts:

1. API Auth server must be deployed. A single, backend application is expected
2. Use of your API server to perform database operations
3. Use of login/auth/acl to control access to your resources

### My Project

I created a survey API where survey creators can create surveys (and edit and delete them) and
then users can view them and respond to them. Then the creators of the surveys can view responses
to their surveys. This project has 3 tables in its 'survey_api' database: Users, Surveys, Responses.

### Links and Resources

- [GitHub Actions ci/cd](https://github.com/Jchips/survey-api/actions)
<!-- - [back-end server url](https://auth-api-dev-4rc4.onrender.com) -->
- [Pull Request](https://github.com/Jchips/survey-api/pull/2)

### Setup

#### `.env` requirements

- PORT:enter-whatever-port-you-want
- DATABASE_URL=postgres-database-url
- SECRET=a-secret-for-jwt-tokens

#### How to initialize/run your application

- `nodemon` (if installed) OR
- `npm start`

#### Features / Routes

- Creators and admins can create/edit/delete surveys
- Any type of user can post anonymous responses to surveys
- There is a query parameter to view all surveys by a specific creator
- Creators can view all the responses to a survey that they posted if they are logged in
- Admin can view all the users (everyone)
- Admin can delete users (everyone) that are being bad

- What was your key takeaway?

    My key takeaway was how to create a rest api from scratch that uses basic and bearer auth and implements acl.

- Pull request: <https://github.com/Jchips/survey-api/pull/2>

/surveys routes

- GET : `/surveys` - Fetches all surveys.
      - With the parameter uid, you can get all surveys from a certain creator by entering their user id number.
- GET : `/surveys/:id` - Fetches specific survey
- POST : `/surveys` - Create a survey (only for creators and admins)
- PUT : `/surveys/:id` - Update a survey (only for creators and admins)
- DELETE : `/surveys/:id` - Delete a survey (only for creators and admins)

/responses routes

- GET : `/responses/:user_id/:survey_id` - Fetches all responses to a survey that you posted (only for creators and admins)
- POST : `/responses` - Create a response to a survey

Auth routes

- POST : `/signup` - Sign up a user
- POST : `/signin` - Sign in with a user that already signed up
- GET : `/users` - Displays all user names (only for admins)
- GET : `/delete/:id` - Delete a user (only for admins)

#### Tests

- How do you run tests?
`npm test`
- Any tests of note?
  - Tests to make sure CRUD operations are performing right
  - Error handling tests
  - POST to /signup to create a new user
  - POST to /signin to login as a user (use basic auth)
  - Tests to make sure only authenticated and authorized users can access routes that have limited access

#### UML

<!-- ![Lab 8 UML](./src/assets/lab-8-uml.png) -->
