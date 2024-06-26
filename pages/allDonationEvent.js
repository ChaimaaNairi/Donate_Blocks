/* eslint-disable @next/next/no-img-element */
import styled from 'styled-components';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import Image from 'next/image';
import { ethers } from 'ethers';
import DonationTracking from '../artifacts/contracts/DonationTracking.sol/DonationTracking.json'
import { useState } from 'react';
import Link from 'next/link'
import WalletBar from '../components/web3/walletbar'; 

export default function AllDonationEvents({AllData, HealthData, EducationData,AnimalData}) {
  const [filter, setFilter] = useState(AllData);

  return (
    <div className='flex flex-col items-center w-[100%]'>
      <WalletBar/>

        <div className="my-5 text-center">
          <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">All donationEvents</h2>
      </div>
 
      {/* Filter Section */}

      <div className='font flex items-center w-[70%] py-[8px] my-[15px] bg-gray-200 px-5 rounded-[24px]'>
        <FilterAltIcon className='mr-[10px]' style={{fontSize:30}} />
        <div className='font px-5 py-1 rounded-[8px] cursor-pointer hover:bg-gray-100' onClick={() => setFilter(AllData)}>All</div>
        <div className='font px-5 py-1 rounded-[8px] cursor-pointer hover:bg-gray-100'  onClick={() => setFilter(HealthData)}>Health</div>
        <div className='font px-5 py-1 rounded-[8px] cursor-pointer hover:bg-gray-100'  onClick={() => setFilter(EducationData)}>Education</div>
        <div className='font px-5 py-1 rounded-[8px] cursor-pointer hover:bg-gray-100' onClick={() => setFilter(AnimalData)}>Animal</div>
      </div>

      {/* Cards Container */}

      <div className='grid lg:grid-cols-2 grid-col items-center w-[75%] mt-[25px]'>
      {/* Card */}
      {filter.map((e) => {
        return (
          
          <div key={e.title} className='p-2 rounded-[15px] bg-gray-400 m-4 mt-[20px]' >
          
          <div className='flex flex-row items-center justify-center'>
            <div className='relative h-[150px] w-[45%] m-2'>
            <Image 
            className='rounded-[8px]'
              alt="donateBlock dapp"
              layout='fill' 
              src={"https://donateblock.infura-ipfs.io/ipfs/" + e.image} 
            />
          </div>

        <div className='flex flex-col items-start'>
          <div className='flex flex-row justify-center mx-[2px] p-[5px]'>
            <div className=' flex items-center font-bold mr-2'><AccountBoxIcon className='mx-1' />Owner: </div> 
            <div className='flex items-center font-semibold'>{e.owner.slice(0,10)}...{e.owner.slice(39)}</div>
          </div>
          <div className='flex flex-row justify-center mx-[2px] p-[5px]'>
            <div className='flex items-center font-bold mr-2'><PaidIcon className='mx-1' />Amount: </div> 
            <div className='flex items-center font-semibold'>{e.amount} Matic</div>
          </div>
          <div className='flex flex-row justify-center mx-[2px] p-[5px]'>
            <div className='flex items-center font-bold mr-2'><EventIcon className='mx-1'/>Date: </div>
            <div className='flex items-center  font-semibold'>{new Date(e.timeStamp * 1000).toLocaleString()}</div>
          </div>
      </div>

          </div>

          <div className='flex justify-center font-bold text-2xl my-0 p-[5px]'>
            {e.title}
          </div>

          
          <Link className='flex justify-center' passHref href={'/' + e.address}>
            <div className='mt-5 font-bold hover:scale-105 bg-[#fff] py-3 px-5 text-center w-[200px] rounded-[10px]'>
            Go to DonationEvent
          </div>
          </Link>
        </div>
        
        )
      })}
        {/* Card */}

      </div>

    </div>
  )
}

export async function getStaticProps() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_ADDRESS,
    DonationTracking.abi,
    provider
  );

  const getAllDonationEvents = contract.filters.donationEventCreated();
  const AllDonationEvents = await contract.queryFilter(getAllDonationEvents);
  const AllData = AllDonationEvents.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.donationEventAddress
    }
  });

  const getHealthDonationEvents = contract.filters.donationEventCreated(null,null,null,null,null,null,'Health');
  const HealthDonationEvents = await contract.queryFilter(getHealthDonationEvents);
  const HealthData = HealthDonationEvents.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.donationEventAddress
    }
  });

  const getEducationDonationEvents = contract.filters.donationEventCreated(null,null,null,null,null,null,'education');
  const EducationDonationEvents = await contract.queryFilter(getEducationDonationEvents);
  const EducationData = EducationDonationEvents.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.donationEventAddress
    }
  });

  const getAnimalDonationEvents = contract.filters.donationEventCreated(null,null,null,null,null,null,'Animal');
  const AnimalDonationEvents = await contract.queryFilter(getAnimalDonationEvents);
  const AnimalData = AnimalDonationEvents.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      timeStamp: parseInt(e.args.timestamp),
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      address: e.args.donationEventAddress
    }
  });

  return {
    props: {
      AllData,
      HealthData,
      EducationData,
      AnimalData
    },
    revalidate: 10
  }
}
