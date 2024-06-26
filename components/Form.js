import React from 'react'
import { createContext, useState} from 'react';
import {TailSpin} from 'react-loader-spinner';
import {ethers} from 'ethers';
import {toast} from 'react-toastify';
import DonationTracking from '../artifacts/contracts/DonationTracking.sol/DonationTracking.json'

import FormChart from './formChart';

const FormState = createContext();

const Form = () => {

  const [form, setForm] = useState({
    donationEventTitle: "",
    story: "",
    requiredAmount: "",
    category: "education",
});

const [loading, setLoading] = useState(false);
const [address, setAddress] = useState("");
const [uploaded, setUploaded] = useState(false);

const [storyUrl, setStoryUrl] = useState();
const [imageUrl, setImageUrl] = useState();

const FormHandler = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    })
}

const [image, setImage] = useState(null);

const ImageHandler = (e) => {
    setImage(e.target.files[0]);
}

const startDonationEvent = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if(form.donationEventTitle === "") {
      toast.warn("Title Field Is Empty");
    } else if(form.story === "" ) {
      toast.warn("Story Field Is Empty");
    } else if(form.requiredAmount === "") {
      toast.warn("Required Amount Field Is Empty");
    } else if(uploaded == false) {
        toast.warn("Files Upload Required")
    }
    else {        
      setLoading(true);  

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        DonationTracking.abi,
        signer
      );
        
      const DonationEventAmount = ethers.utils.parseEther(form.requiredAmount);

      const donationEventData = await contract.createDonationEvent(
        form.donationEventTitle,
        DonationEventAmount,
        imageUrl,
        form.category,
        storyUrl
      );

      await donationEventData.wait();   

      setAddress(donationEventData.to);
    }
}


return (
  <>
  {/** title + intro  */}
  <div className='flex justify-center w-[100%]'>
    <div className='my-20 w-[80%]'>
        <div className='flex flex-col'>
          <h2 className='text-[30px] font-bold'>Start a DonationEvent</h2>
          <p className='text-[16px] mt-[10px]'>
          On the <span className='font-bold'>DonateBlocks</span> platform, you can start a DonationEvent and make a positive impact in the world. Before creating a DonationEvent, please make sure that you have all the necessary details and information. 
          Once you create a DonationEvent, it will be stored on the blockchain, which means that it cannot be changed or modified. Therefore, it is important to ensure that all information is accurate and complete before creating a DonationEvent. 
          Lets make a difference together with <span className='font-bold'>DonateBlocks</span>!
          </p>
      </div>
      </div>
  </div>
  <FormState.Provider value={{form, setForm, image, setImage, ImageHandler, FormHandler, setImageUrl, setStoryUrl, startDonationEvent, setUploaded}} >

<div className='flex justify-center w-[100%]'>
    <div className='w-[80%]'>
        {loading == true ?
            address == "" ?
                <div className="w-[100%] h-[80vh] flex justify-center items-center">
                    <TailSpin height={60} />
                </div> :
            <div className='flex flex-col items-center rounded-[8px] w-[100%] h-[80vh]'>
                <h1>DonationEvent Started Sucessfully!</h1>
                <h1>{address}</h1>
                <div className='flex justify-center'>
                  <button className='cursor-pointer w-[100%] mt-[30px] p-2 font-bold rounded-[8px] bg-[#6AA4B0]'>
                    Go To DonationEvent
                  </button>
                </div>
            </div>
            :
            <div className='flex flex-col'>
                <FormChart />
            </div>    

        }
    </div>
</div>
</FormState.Provider>
</>
)
}

export default Form;
export {FormState};