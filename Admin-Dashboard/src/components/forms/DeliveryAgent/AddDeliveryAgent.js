import React from 'react'
import { useState } from "react";
import { useEffect } from 'react';
import '../../../App.css';
import Navbar from '../../Navbar';
import axios from 'axios';
import Alert from '../../Alert';
import { useFormik } from "formik";
import { signUpSchema } from '../Schemas';


export default function AddDeliveryAgent() {
    const state = require('country-state-city').State;
    const city = require('country-state-city').City;
    const statelist = state.getStatesOfCountry("IN");
    const [citylist, setcitylist] = useState([]);


    const [alertval, setAlert] = useState(null)

    const showAlert = (message, type) => {
        setAlert({
            msg: message,
            type: type
        })
        setTimeout(() => {
            setAlert(null)
        }, 2000);
    }

    const [catarray, setcatarray] = useState([])

    const getCatArray = async () => {
        const response = await fetch(`https://admindashb.onrender.com/api/category/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const json = await response.json();
        setcatarray(json);
    }

    const initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        contact: '',
        orderId: '',
        state: '',
        city: '',
        address: '',
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
        useFormik({
            initialValues,
            validationSchema: signUpSchema,
            onSubmit: (values, action) => {
                console.log(
                    "🚀 ~ file: Registration.jsx ~ line 11 ~ Registration ~ values",
                    values
                );
                action.resetForm();
                handlereq();
            },
        });

    const [agentimage, setagentimage] = useState(null);

    const onImageChange = (e) => {
        console.log(e.target.files);
        setagentimage(e.target.files[0]);
    }


    const handlereq = () => {
        const formData = new FormData();
        formData.append('firstname', values.firstname);
        formData.append('lastname', values.lastname);
        formData.append('email', values.email);
        formData.append('contact', values.contact);
        formData.append('orderId', values.orderId);
        formData.append('city', values.city);
        formData.append('address', values.address);
        formData.append('state', values.state);
        formData.append('agentimage', agentimage);
        console.log("formdata : \n" + formData);

        axios.post("https://admindashb.onrender.com/api/delivpar/", formData)
            .then((response) => {
                console.log(response);
                showAlert("Delivery Agent Added Successfully", "success")
            })
            .catch((error) => console.log(error))

    }

    const onDiscard = (e) => {
        e.preventDefault();
        values.firstname = '';
        values.lastname = '';
        values.email = '';
        values.contact = '';
        values.orderId = '';
        values.city = '';
        values.address = '';
        values.state = '';
        setagentimage(null);
    }

    useEffect(() => {
        getCatArray();
    }, [])

    const nestedChange = (e) => {
        handleChange(e);
        const temp = city.getCitiesOfState("IN", e.target.value);
        setcitylist(temp);
    }

    return (
        <>
            <div className="container">
                <div className="main m-0 p-0 bg-tailtertiary">

                    <Navbar pagename="Add Delivery Agent Page" pagenumber="112" />
                    <Alert alert={alertval} />
                    <div className='mt-4 items-center flex pb-32'>

                        <div style={{ width: "800px" }} className='mt-4 bg-white border border-2 rounded-md resize-x mx-auto flex shadow-[0_20px_50px_rgba(8,_100,_150,_0.5)]'>

                            <form className='w-full mx-auto bg-white p-4' onSubmit={handleSubmit}>
                                <h2 className='text-center font-bold font-mono text-2xl'>DELIVERY AGENT</h2>
                                <hr className='w-36 mt-2 border-2 mx-auto' />

                                <div className='flex flex-col py-2'>
                                    <label>Firstname</label>
                                    <input value={values.firstname} autoComplete="off" className='mt-1 border p-2 rounded-md' type="text" name='firstname' placeholder='Enter First Name' onBlur={handleBlur} onChange={handleChange} />
                                    {errors.firstname && touched.firstname ? (
                                        <p className="form-error">{errors.firstname}</p>
                                    ) : null}
                                </div>
                                <div className='flex flex-col py-2'>
                                    <label>Lastname</label>
                                    <input value={values.lastname} required className='mt-1 border p-2 rounded-md' type="text" name='lastname' placeholder='Enter Last Name' onBlur={handleBlur} onChange={handleChange} />
                                    {errors.lastname && touched.lastname ? (
                                        <p className="form-error">{errors.lastname}</p>
                                    ) : null}
                                </div>


                                <div className='flex flex-col py-2'>
                                    <label>Email</label>
                                    <input value={values.email} required className='mt-1 border p-2 rounded-md' type="email" name='email' placeholder='Enter Email' onBlur={handleBlur} onChange={handleChange} />
                                    {errors.email && touched.email ? (
                                        <p className="form-error">{errors.email}</p>
                                    ) : null}
                                </div>


                                <div className='flex flex-col py-2'>
                                    <label>Contact Number</label>
                                    <input value={values.contact} required className='mt-1 border p-2 rounded-md' type="text" name='contact' placeholder='Enter Contact Number' onBlur={handleBlur} onChange={handleChange} />
                                    {errors.contact && touched.contact ? (
                                        <p className="form-error">{errors.contact}</p>
                                    ) : null}
                                </div>

                                <div>
                                    <label>Order ID</label><br />
                                    <select required value={values.orderId} className='mt-1 border px-2 py-2 w-full rounded-md' name="category" onBlur={handleBlur} onChange={nestedChange} >
                                        <option value='select'>select</option>
                                        {catarray.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.orderId}</option>
                                        ))}
                                    </select>
                                    {errors.orderId && touched.orderId ? (
                                        <p className="form-error">{errors.orderId}</p>
                                    ) : null}
                                </div>

                                <div className='flex flex-col py-2'>
                                    <label>Upload Delivery Agent Image</label>
                                    <input required className='mt-1 border p-2 rounded-md' type="file" name="agentimage" onChange={onImageChange} />
                                </div>

                                <div className='flex flex-col py-2'>
                                    <label>State</label>
                                    <select required value={values.state} className='mt-1 border px-2 py-2 w-full rounded-md' name="state" onBlur={handleBlur} onChange={nestedChange} >
                                        <option value='select'>select</option>
                                        {statelist.map((b) => (
                                            <option key={b.id} value={b.isoCode}>{b.name}</option>
                                        ))}
                                    </select>
                                    {errors.state && touched.state ? (
                                        <p className="form-error">{errors.state}</p>
                                    ) : null}
                                </div>

                                <div className='flex flex-col py-2'>
                                    <label>City</label>
                                    <select required value={values.city} className='mt-1 border px-2 py-2 w-full rounded-md' name="city" onBlur={handleBlur} onChange={handleChange} >
                                        <option value='select'>select</option>
                                        {citylist.map((b) => (
                                            <option key={b.id} value={b.name}>{b.name}</option>
                                        ))}
                                    </select>
                                    {errors.city && touched.city ? (
                                        <p className="form-error">{errors.city}</p>
                                    ) : null}
                                </div>

                                <div className='flex flex-col py-2'>
                                    <label>Address</label>
                                    <textarea onBlur={handleBlur} onChange={handleChange} value={values.address} rows="3" name="address" placeholder='Enter address' className='mt-1 border p-2 rounded-md'>
                                    </textarea>
                                    {errors.address && touched.address ? (
                                        <p className="form-error">{errors.address}</p>
                                    ) : null}
                                </div>




                                <div className='flex mx-auto mt-2'>
                                    <button type='submit' className='m-2 font-poppins font-bold border w-full mt-2 mb-2 rounded-md py-2 bg-tailtertiary3 hover:bg-tailprimary text-black' onClick={handleSubmit}>SAVE</button>
                                    <button className='m-2 font-poppins font-bold border w-full mt-2 mb-2 rounded-md py-2 bg-tailtertiary3 hover:bg-red-600 text-black' onClick={onDiscard}>DISCARD</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


