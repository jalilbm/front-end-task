# Project Title

## Overview

This project is a user management system built with React and TypeScript. It was bootstrapped with Create React App (CRA).

## Installation

To get started, clone the repository and install the required packages. This project uses SCSS for styling, so you'll need to install Sass.

```
npm install sass
```

**Note**: Installing external packages was generally not allowed for this task. However, SCSS was explicitly permitted by the interviewer, and the only way to use SCSS is by installing Sass.

## How to Start the App

```
npm start
```

## Features

### Login

For testing the login functionality, we used the [Reqres API](https://reqres.in/).

- **Successful Login**: Use the email `eve.holt@reqres.in` with any password.
- **Unsuccessful Login**: Use any other email to test a failed login attempt.

### User Management

- Search users
- Add, edit, and delete users.
- Sort users by different fields.
- Pagination support.

## Notes

### Omitted Features

- The "Forgot Password" and "Signup" features were not implemented in the UI as they were not part of the task requirements.

### Authentication

- The Reqres API provides a simple, non-expiring token. Therefore, session and authentication are handled in a basic manner, without considering token expiry and refresh tokens.

### Routing

- Due to the requirement of not installing any external packages, a custom routing mechanism was implemented.

### Time Constraints

Due to time limitations, the following areas could be improved:

- Better commenting
- Code cleaning
- Code refactoring
- More animations

## Contributing

Feel free to contribute to this project by submitting a pull request.

## License

This project is licensed under the MIT License.
