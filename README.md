<!-- @format -->

# Safe Space - Final project

Safe Space is community based website for people experiencing burnout syndrom where they can found information, resources and a forum to share their thoughts and feelings in a safe space.

## View it live

⚠️ UPDATE: Due to the removal of Heroku's free dynos (where we had our server hosted), I had to shut this server down, so the app is not fully functional momentarily. I will experiment with FireBase to make it work.

BE: https://final-project-dannuzak.herokuapp.com/

FE: https://final-project-dannuzak.netlify.app/


## App structure

### Home/Login page

From the home page the user can access the resources page without loging in. If the user wants to share a thought they have to login/signup.

A login to test the page is:
username:Lyo
pass:kobelyo

The signup function will be finished later.

### Sharing page

This is a simple forum where users can share with others a positive thought or an achievement. Other users can interact by liking the post.

### Resources page

A collection of cards with contact information of different specialists that can help to heal burnout symptoms.
The user can filter the results by clicking the buttons or by entering a key word in the search bar.
The search bar search in all the fields of the cards.

## Frontend

Frontend is built with **React Hooks** with **Redux**.
For the routing I used **React Router**.
For the styling I used **Styled components**.

## Backend

⚠️ UPDATE: Due to the removal of Heroku's free dynos (where we had our server hosted), I had to shut this server down, so the app is not fully functional momentarily. I will experiment with FireBase to make it work.

The **RESTfulAPI** in the backend is built with **Node.js**. The data is stored in a **database** built with **MongoDB** and **Mongoose**. The dataset was created with **Mockaroo**, a database generator using fake data.

### MongoDB Collections

#### users

The username and password are stored in this collection.

#### positivethoughts

This collection is created when the user shares a thought.

#### resource1

This collection lists personal and contact information of different specialists.

### Endpoints

- GET /resources_1 - endpoint to show the directory listing specialists contact information
- GET /pos_sharing - endpoint to get all the thoughts shared by users
- POST /pos_sharing - endpoint for the user to share a positive thought
- DELETE /pos_sharing/:\_id - endpoint to delete a positive thought
- POST /post_sharing/:\_id/emojis - endpoint to increase the amount of thumbsup
- POST /signin - endpoint for the user to signin

## Process

I started by making and mockup in Figma of all the views of the website. This helped me to have clearity of the pages, components and routing needed to structure my website.

I built my project following this order:

1. BE and FE for the homepage + styling
2. BE and FE for the resources page + styling
3. BE and FE for the sharing page + styling

## Cross-Browser Compatibility

- Chrome
- Edge
- Safari
- Firefox

