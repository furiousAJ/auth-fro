import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import baseUrl from '../../../Api';
import { jwtDecode } from "jwt-decode";
import { Buffer } from 'buffer';
import './product.scss';
import Productedit from './Productedit';
import { useNavigate } from 'react-router-dom';

const Productview = () => {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/sellerlogin');
    } else {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setSellerId(decodedToken._id);
      }
    }
  }, [navigate]);

  const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const [product, setProduct] = useState([]);
  const [selected, setSelected] = useState();
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (sellerId) {
      axios.get(`${baseUrl}/product/sellerproductview?sellerId=${sellerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        setProduct(response.data);
      })
      .catch(err => {
        console.error(err);
        // Handle error (e.g., redirect to login page or display error message)
      });
    }
  }, [sellerId]);

  const deleteValues = (id) => {
    axios.put(`${baseUrl}/product/delete/${id}`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      alert("Inactive");
      window.location.reload(false);
    })
    .catch(error => {
      console.error(error);
      // Handle error
    });
  };

  const activeValues = (id) => {
    axios.put(`${baseUrl}/product/active/${id}`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) => {
      alert("ACTIVE");
      window.location.reload(false);
    })
    .catch(error => {
      console.error(error);
      // Handle error
    });
  };

  const updateValues = (value) => {
    setSelected(value);
    setUpdate(true);
  };

  return (
    <div className='bb'>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ProductName</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Inactive</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {product.map((value, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{value.Productname}</TableCell>
                  <TableCell>{value.Productprice}</TableCell>
                  <TableCell>{value.Quantity}</TableCell>
                  <TableCell>{value.Description}</TableCell>
                  <TableCell>{value.prod[0].Categoryname}</TableCell>
                  <TableCell>
                    <img src={`data:image/jpeg;base64,${Buffer.from(value.Photo.data)}`} className='imgpro' alt='Error' />  </TableCell>
                  <TableCell>{value.Status}</TableCell>
                  <TableCell><ModeEditOutlineIcon color='success' onClick={() => updateValues(value)} /></TableCell>
                  <TableCell><ToggleOnIcon color='primary' onClick={() => activeValues(value._id)} /></TableCell>
                  <TableCell><ToggleOffIcon color='error' onClick={() => deleteValues(value._id)} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {update && <Productedit data={selected} method='put' />}
    </div>
  );
};

export default Productview;
