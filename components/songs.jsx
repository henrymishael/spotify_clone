import { playlistState } from '@/atoms/playlistAtom';
import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';
import Song from './song';
import Loader from './loader';
import Head from 'next/head';

function Songs({setView}) {
    const playlist = useRecoilValue(playlistState)
    const [dataLoaded, setDataLoaded] = useState(false);
    // Assuming you have a function to load data, you can use useEffect to simulate data loading
    useEffect(() => {
      // Simulate loading data
      setTimeout(() => {
        setDataLoaded(true);
      }, 1000); // Simulating a 2 second delay for loading
    }, []);

  return (
    <>
    
    {dataLoaded ? (
    <div className='md:px-4 xsm:px-2 flex flex-col  pb-28 text-white'>
      {playlist?.tracks.items.map((track, i) => (
        <Song key={track.track.id} track={track} order={i} setView={setView} />
      ))}
    </div>):
    <Loader/>
    }
    </>
  )
}

export default Songs;
