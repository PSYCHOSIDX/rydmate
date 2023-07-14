import React, {useState} from 'react';

import {FaStar} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';  
import Button from 'react-bootstrap/Button';


const colors = {
orange: "#FFBA5A",
grey: "#a9a9a9"
}

function Rating() {

const stars= Array(5).fill(0);
const [currentValue, setCurrentValue] = useState(0);
const [hoverValue, setHoverValue] = useState(undefined);

const handleClick= value=> {
  setCurrentValue(value)
};

const handleMouseOver= value =>{
  setHoverValue(value)
};

const handleMouseLeave = value=>{
  setHoverValue(undefined)
};

return (
   <div style={styles.container}>
      <h2> Please give your feedback </h2>
      <div style={styles.stars}>
        {
          stars.map((_, index) => {
            return(
              <FaStar
              key={index} 
              size={35}
              style={{
                marginRight: 10,
                marginTop: 10,
                cursor: "pointer"
              }}
            color={(hoverValue|| currentValue) > index ? colors.orange: colors.grey}  
            onClick={()=> handleClick(index+1)}
            onMouseOver={()=> handleMouseOver(index+1)}
            onMouseLeave={handleMouseLeave}

              />

            )
          })
        }
      </div>
        <textarea placeholder="Additional comments" 
        style={ styles.textarea} />
        <Button type='submit'  style={ styles.button }> Submit </Button>

    </div>
   

  );
}

const styles={
  container:{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "250px 100px",
    
  },
  textarea:{
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    width: 300,
    margin: "20px 0",
    minHeight: 100,
    padding:10

  }, 
  button: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    width: 200,
    padding: 10,
    background: "green",

  }
}

export default Rating;