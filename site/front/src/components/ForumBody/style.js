import styled from "styled-components";
import fundoSobre from '../../assets/Predio.jpg';

export const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  gap: 20px;
  padding: 20px; 
  background-color: #f9f9f9; 
`;

export const Card = styled.div`
  width: 300px;
  padding: 20px;
  margin-bottom:50px;
  background-color: #ffffff; 
  border: 1px solid #ddd; 
  border-radius: 8px; 
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  transition: transform 0.3s ease, box-shadow 0.3s ease; 

  &:hover {
    transform: translateY(-5px); 
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 6px; 
  margin-bottom: 10px;
`;

export const CardTitle = styled.h3`
  font-size: 1.4rem;
  color: #333; 
  margin-bottom: 10px;
  text-align: center;
`;

export const CardContent = styled.p`
  font-size: 1rem;
  color: #555; 
  line-height: 1.5;
  text-align: center;
`;

export const Modal = styled.div`
  position: fixed;
  z-index:9999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out; 

   h3{
    margin: 30px 0px 20px 0px;
    font-size: 1.1rem;
    
   }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto; 
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-in-out; 

   

  @keyframes slideIn {
    from {
      transform: translateY(-50px);
    }
    to {
      transform: translateY(0);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  

  h4 {
    font-size: 1.4rem;
    color: #333;
  }

  .close {
    margin-left: 50px;
     margin-bottom: 50px;
    background-color: transparent; 
    color: #ffff; 
    border: none; 
    cursor: pointer; 
    font-size: 1.1rem; 
    padding: 2px 12px 2px 12px; 
    background-color:red;
    transition: color 0.3s; 
    
    &:hover {
      color: #ffff;
      background-color:#FF0011;
    }
  }

  
`;

export const ModalBody = styled.div`
  margin-top: 10px;
  text-align: left;

  img {
    max-width: 100%;
    max-height: 400px;
    margin: 0px 0px 0px 0px 0px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); 
  }

  p {
    font-size: 1rem;
    color: #666; 
    line-height: 1.6;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      background-color: #f4f4f4;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
      font-size: 1rem;
      color: #555;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }

      &:hover {
        background-color: #ebebeb;
      }
    }
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export const Button = styled.button`
  padding: 5px 10px;
  background-color: #002776;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

 
`;

export const FilterInput = styled.input`
  display: inline-block;
  padding: 10px 15px;
  border: 1px solid #ddd; 
  border-radius: 5px; 
  font-size: 1rem; 
  color: #333; 
  margin-bottom: 20px; 
  width: 100%; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 

  &:focus {
    outline: none; 
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); 
  }
`;

export const SobreContainer = styled.div`
  position: relative;
  height: 400px; 
  overflow: hidden; 
  background-image: url(${fundoSobre});
  background-size: cover; 
  background-attachment: fixed; 
  background-position: center; 
`;

export const SobreContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  color: white; 
  text-align: center; 
  padding: 20px;
  backdrop-filter: blur(5px); 
  border-radius: 10px; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); 
`;

export const SobreText = styled.div`
  h2 {
    font-size: 2rem; 
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem; 
    line-height: 1.5;
  }
`;