import React, { useState } from 'react';
import { db } from '../firebaseConfig';

import { FaStar } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

import { UserAuth } from '../context/UserAuthContext';
import { collection, addDoc} from 'firebase/firestore';

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9"
}

const Rating = () => {
  const navigate = useNavigate();

  const stars = Array(5).fill(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');

  const location = useLocation();
  const { user } = UserAuth();
  const userId = user.uid;
  const userName = user.displayName;
  const data = location.state?.data;

  let user_id = data.user_id;
  let ride_id = data.ride_id

  const handleClick = value => {
    setCurrentValue(value)
    setRating(value); 

  };

  const handleMouseOver = value => {
    setHoverValue(value)
  };

  const handleMouseLeave = value => {
    setHoverValue(undefined)
  };

  const handleSubmitRating = async () => {
    try {
      console.log(user_id)
      console.log(rating)
      console.log(comments)
      if (user_id && rating > 0) {
        await addDoc(collection(db, 'users', user_id, 'ratings'), {
          rating: rating,
          comments: comments,
          user:userName,
          ride_id:ride_id
        })
       
        // Add a new document to the "ratings" subcollection of the user
        // await db.collection('users').doc(user_id).collection('ratings').add({
        
          // user: userName,
          // ride : ride_id
        // });
        alert('rating sent')
        setRating(0);
        setComments('');
        navigate('/');

      } else {
        alert('Please provide a valid rating and comments');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('erro submitting rating')
    }
  };

  return (
    <div style={styles.container}>
      <h2> Please give your feedback </h2>
      <div style={styles.stars}>
        {
          stars.map((_, index) => {
            return (
              <FaStar
                key={index}
                size={35}
                style={{
                  marginRight: 10,
                  marginTop: 10,
                  cursor: "pointer"
                }}
                color={(hoverValue || currentValue) > index ? colors.orange : colors.grey}
                onClick={() => handleClick(index + 1)}
                onMouseOver={() => handleMouseOver(index + 1)}
                onMouseLeave={handleMouseLeave}
              />
            )
          })
        }
      </div>
      <textarea
        placeholder="Additional comments"
        style={styles.textarea}
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      />
      <button type='submit' onClick={handleSubmitRating} style={styles.button}>Submit Rating</button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "250px 100px",
  },
  textarea: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    width: 300,
    margin: "20px 0",
    minHeight: 100,
    padding: 10
  },
  button: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    width: 200,
    padding: 10,
    background: "green",
    cursor: "pointer"
  },
  stars: {
    display: "flex"
  }
}

export default Rating;
