# Link Redirect Application

This is a link redirect application that allows you to create and manage redirects from incoming URLs to outgoing URLs. It provides a simple web interface to generate incoming links, view existing redirects, export redirects as a CSV file, and import redirects from a CSV file.

## Features

- Generate incoming links that redirect to specified outgoing URLs
- View a list of all existing redirects
- Export redirects as a CSV file
- Import redirects from a CSV file to update existing redirects

## Technologies Used

- Node.js
- Express.js
- MongoDB
- EJS (Embedded JavaScript) templating
- Bootstrap (CSS framework)
- Docker

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js (version 14 or higher)
- MongoDB
- Docker (optional, if you want to run the application using Docker)

## Getting Started

1. Clone the repository:

   git clone https://github.com/your-username/link-redirect-app.git

2. Install the dependencies:

   cd link-redirect-app
   npm install

3. Set up the environment variables:

   Create a `.env` file in the root directory and provide the following variables:

   MONGO_URI=mongodb://localhost:27017/link-redirect-app

   Replace `mongodb://localhost:27017/link-redirect-app` with your MongoDB connection URI if necessary.

4. Start the application:

   npm start

   The application will be accessible at `http://localhost:3000`.

## Running with Docker

If you prefer to run the application using Docker, follow these steps:

1. Build the Docker image:

   docker-compose build

2. Start the Docker containers:

   docker-compose up -d

   The application will be accessible at `http://localhost:3000`.

## Usage

1. Open the application in your web browser at `http://localhost:3000`.

2. On the homepage, you will see a list of existing redirects, if any.

3. To generate a new incoming link, click on the "Generate Incoming Link" button, enter the outgoing URL, and click "Generate". The generated incoming link will be displayed.

4. To export the redirects as a CSV file, click on the "Export CSV" button. The file will be downloaded automatically.

5. To import redirects from a CSV file, click on the "Choose File" button, select the CSV file, and click "Import". The existing redirects will be updated based on the imported file.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

