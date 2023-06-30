import React, { useState, useEffect } from 'react'
import { db } from '../firebaseConfig'
import { collection, addDoc, getDocs } from "firebase/firestore"
 
import { Link } from 'react-router-dom'
import moment from 'moment'
import styled from 'styled-components/macro'

//import { API_URL_POS_SHARING,  THUMBSUP_URL  } from '../reusable/urls'
import HeroImage from '../assets/figma-pic.png'
import { device } from '../Commons/breakpoints' 

import Button from 'components/Button'

const PositiveSharing = () => {
  const [positiveThoughtsList, setPositiveThoughtsList] = useState([])
  const [newPositiveThought, setNewPositiveThought] = useState('')

 
  const onNewPositiveThoughtChange = (e) => {
    setNewPositiveThought(e.target.value)
  }

  const onFormSubmit = async (e) => {
    e.preventDefault()

    try {
      const docRef = await addDoc(collection(db, "todos"), {
        newPositiveThought: newPositiveThought,    
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    //setNewPositiveThought('')
  }
  
  const fetchPost = async () => {
       
    await getDocs(collection(db, "todos"))
        .then((querySnapshot)=>{              
            const newData = querySnapshot.docs
                .map((doc) => ({...doc.data(), id:doc.id }));
                setPositiveThoughtsList(newData);                
            console.log(positiveThoughtsList, newData);
        })
   
}

useEffect(()=>{
    fetchPost();
}, [])


  return (
    <>
    
      <GreenHeroImage>      
        <Form onSubmit={onFormSubmit}>
        <Title>Share with us...</Title>
          <Paragraph>a positive thought or an achievement you want to celebrate with us!</Paragraph>
          <TextArea
            id="newPositiveThought"
            type="text"
            value={newPositiveThought}
            onChange={onNewPositiveThoughtChange}
            placeholder="Enter text..."
          />
          <Button type="onSubmit"> Send </Button>
        </Form>
      </GreenHeroImage>
      
      {/* {accessToken ?  */}
    
      <ThoughtsContainer>
      {positiveThoughtsList.map(thought => (
        <ThoughtWrapper key={thought._id}>
          <p>{thought.message}</p>
          <Date>{moment(thought.createdAt).fromNow()}</Date>
         {/*  <ThumbsUpBtn onClick={() => onThumbsupIncrease(thought._id)}>
            {thought.thumbsup}👍
          </ThumbsUpBtn>  */} 
        </ThoughtWrapper>        
      ))}
        </ThoughtsContainer>
      
      {/*   : */}
        <>
          <SignupWrapper>
            <SignText>This is a safe space for members of our community</SignText>
            <SignText>Join us and start sharing!</SignText>
            <Link to="/signup"><SignButton type="submit">Signup</SignButton></Link>
            <SignText>Already a member?</SignText>
            <Link to="/login"><SignButton type="submit">Login</SignButton></Link>
          </SignupWrapper>
        </>
{/* } */}
    </>
  )
}

const GreenHeroImage = styled.div`
  background-image:url(${HeroImage});
  background-size:cover;
  width:100%;
  padding:30px;
`

const Form = styled.form`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  margin:2.2em;
`

const Title = styled.h1`
  color:white;
  font-weight:500;
`

const Paragraph = styled.p`
  font-size:1.2em;
  color:white;
  margin-bottom:20px;
  text-align:center; 
  
  @media ${device.tablet} {
    width:500px; 
  }
`

const TextArea = styled.textarea`
  width:350px;
  height:50px;
  border:black;
  margin:20px 0 42px 0;
  font-size:1.2em;
  font-family:'Roboto', sans-serif;
  font-weight:100;
  padding:10px;
  border-radius:5px;
  text-align: center;  

  @media ${device.tablet} {
    width:500px; 
  }
`

const ThoughtsContainer = styled.div`
  height:fit-content;
  background-color:#E7E4DE;
  padding:20px;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding-top:40px; 
`

const ThoughtWrapper = styled.div`
  background-color:white;
  border: 1px solid gray;
  border-radius:5px;
  margin-bottom:20px;
  padding:20px;
  width:350px; 
  
  @media ${device.tablet} {
    width:500px; 
  }
`

const Date = styled.p`
  font-size:.8em;
  margin-top:20px;
`

const ThumbsUpBtn = styled.button`
  margin-top:5px;
`

const SignupWrapper = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding:2em;

`

const SignText = styled.p`
  color:#155306;
  font-weight:350;
  font-size:1.2em;
`

const SignButton = styled.button`
  width:100px;
  background-color:#AAAC48;
  font-size:1.2em;
  margin:1em 1em 2em 1em;
  border-radius:5px;
  padding:.5em;
  color:white;
  border-color:white;
  justify-content:center;
  cursor: grab;
  
`

export default PositiveSharing

// OLD CODE

/* const [positiveThoughtsList, setPositiveThoughtsList] = useState([])
const [newPositiveThought, setNewPositiveThought] = useState('')


useEffect(() => {
  fetchPositiveThoughts()
}, [])

  const fetchPositiveThoughts = () => {
    fetch(API_URL_POS_SHARING)
      .then((res) => res.json())
      .then((thoughts) => {
        if (thoughts.success) {
          setPositiveThoughtsList(thoughts.allPositiveThoughts)
        }
      })
      .catch((err) => console.error(err))
  }

  const onNewPositiveThoughtChange = (event) => {
    setNewPositiveThought(event.target.value)
  }

  const onFormSubmit = (event) => {
    event.preventDefault()

    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ message: newPositiveThought }),
    }

    fetch(API_URL_POS_SHARING, options)
      .then((res) => res.json())
      .then(() => fetchPositiveThoughts())
      .catch((err) => console.error(err))

    setNewPositiveThought('')
  }

  const onThumbsupIncrease = (_id) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch(THUMBSUP_URL(_id), options)
      .then((res) => res.json())
      .then(() => fetchPositiveThoughts())
      .catch((err) => console.error(err))
  } */