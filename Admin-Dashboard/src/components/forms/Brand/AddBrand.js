import React, { useEffect } from 'react'
import { useState } from "react";
import axios from 'axios';
import '../../../App.css';
import Navbar from '../../Navbar';
import Alert from '../../Alert';


export default function AddBrand() {

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

    const [vendorarray, setvendorarray] = useState([])

    const getVendors = async () => {
        const response = await fetch(`https://admindashb.onrender.com/api/vendor/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const json = await response.json();
        setvendorarray(json);
    }


    const [obj, setobj] = useState({
        productname: '',
        bvendors: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("inside handle submit");
        console.log(obj)
        if (obj.productname === '' || obj.bvendors === '' || obj.bvendors === "select") {
            alert("Please fill all the fields");
            return;
        }
        else {


            axios.post("https://admindashb.onrender.com/api/brand/", {
                bname: obj.productname,
                vendors: obj.bvendors,
            })
                .then((response) => {
                    showAlert("Brand Added Successfully", "success");
                    console.log(response);
                    setobj({
                        productname: '',
                        bvendors: ''
                    });
                })
                .catch((error) => console.log(error))
        }
    }



    const onDiscard = (e) => {
        e.preventDefault();
        setobj({
            productname: '',
            bvendors: ''
        });
    }

    const onChange = (e) => {
        setobj({ ...obj, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        getVendors();
    }, [])

    return (
        <>
            <div className="container">
                <div className="main m-0 p-0 bg-tailtertiary">

                    <Navbar pagename="Add Brand Page" pagenumber="105" />
                    <Alert alert={alertval} />
                    <div className='h-screen items-center flex pb-32'>

                        <div style={{ width: "800px" }} className='mt-4 bg-white border border-2 rounded-md resize-x mx-auto flex shadow-[0_20px_50px_rgba(8,_100,_150,_0.5)]'>
                            <form className='w-full mx-auto bg-white p-4' onSubmit={handleSubmit}>
                                <h2 className='text-center font-bold font-mono text-2xl'>Brands</h2>
                                <hr className='w-56 my-2 border-2 mx-auto' />
                                <div className='flex flex-col py-2'>
                                    <label>Enter Brand Name</label>
                                    <input required className='border p-2 mt-1 rounded-md' type="text" name='productname' value={obj.productname} placeholder='Enter Brand Name' onChange={onChange} />
                                </div>

                                <div className='flex flex-col py-2'>
                                    <label>Select Brand Vendor</label>
                                    <select required name="bvendors" value={obj.bvendors} onChange={onChange} className='border px-2 py-2 mt-1 w-full rounded-md'>
                                        <option value="select">Select</option>
                                        {vendorarray.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.firstname}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className='flex mx-auto mt-2'>

                                    <button type='submit' className='m-2 font-poppins font-bold border w-full mt-2 mb-2 rounded-md py-2 bg-tailtertiary3 hover:bg-tailprimary text-black' onClick={handleSubmit}>SAVE</button>
                                    <button type='submit' className='m-2 font-poppins font-bold border w-full mt-2 mb-2 rounded-md py-2 bg-tailtertiary3 hover:bg-red-600 text-black' onClick={onDiscard}>DISCARD</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


