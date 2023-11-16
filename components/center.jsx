import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { BsFillPlayFill, BsPlayCircleFill } from "react-icons/bs";
import React, { useEffect, useState } from 'react'
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistAtom, playlistIdState, playlistState } from '@/atoms/playlistAtom';
import spotifyApi from '@/lib/spotify';
import useSpotify from '@/hooks/useSpotify';
import Songs from './songs';
import { PlayIcon } from '@heroicons/react/solid';
import Loader from './loader';
import Head from 'next/head';
import { currentTrackIdState } from '@/atoms/songAtom';

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
]
function Center({view, setView, track}) {
  const { data: session } = useSession();
  const spotifyApi = useSpotify()
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState)
  const [hover, setHover] = useState(false);
  const [opacity, setOpacity] = useState(0)
  const [textOpacity, setTextOpacity] = useState(0);
  const currentTrack = useRecoilValue(currentTrackIdState)
  const [dataLoaded, setDataLoaded] = useState(false);
    
 
  // Assuming you have a function to load data, you can use useEffect to simulate data loading
    useEffect(() => {
      // Simulate loading data
      setTimeout(() => {
        setDataLoaded(true);
      }, 1500); // Simulating a 2 second delay for loading
    }, []);

  function changeOpacity(scrollPos) {
    //scrollPos = 0 -> opacity = 0;
    //scrollPos = 300 -> opacity = 1;
    //scrollPos = 310 => opacity = 1;
    const offset = 300
    const textOffset = 10
    if (scrollPos < offset) {
      const newOpacity = 1 - ((offset - scrollPos)/offset)
      setOpacity(newOpacity);
      setTextOpacity(0);
    } else {
      setOpacity(1);
      const delta = scrollPos - offset
      const newTextOpacity = 1 - ((textOffset - delta)/textOffset)
      setTextOpacity(newTextOpacity)
    }
  }
  

  useEffect(() => {
    setColor(shuffle(colors).pop());
  },[playlistId])

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then((data) => {
      setPlaylist(data.body);
    })
    .catch((err) => console.log("something went wrong!", err))
  }, [spotifyApi, playlistId]);

  console.log(playlist);


  return (
    <>
    <Head>
  <title>{currentTrack?.name}{playlist?.name} | Spotify Playlist</title>
    </Head>
    {dataLoaded ? (
    <div  className='flex-grow h-screen overflow-y-scroll scrollbar-none'>
      
      <header style={{opacity: opacity}}  className=' z-10 sticky top-0 h-20 md:text-4xl xsm:text-2xl bg-black p-8 flex items-center font-bold  '>
        <div style={{opacity: textOpacity}}  >{playlist?.name}</div>
      </header>
      <div className={`flex items-center bg-[#121212] space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-xl absolute right-8 z-20 top-5`}>
          <img className='rounded-full w-10 h-10' src={session?.user.image} alt="dp" />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className='h-5 w-5' />
        </div>
        <div onScroll={(e)=>changeOpacity(e.target.scrollTop)} className='relative -top-20 h-screen overflow-y-scroll bg-[#121212]'>
      <section   className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
      <div className='relative group md:w-44 md:h-44 xsm:w-40 xsm:h-40'>
        <div className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 bottom-1 group-hover:bottom-3 right-3'>
          <BsFillPlayFill className='h-6 w-6 text-black'/>
        </div>
         <img className='md:w-44 md:h-44 xsm:w-40 xsm:h-40' src={playlist?.images?.[0]?.url} alt="" />
        </div>
        <div>
          <p>PLAYLIST</p>
          <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
        </div>
      </section>
      
      <div>
        <Songs
          setView={setView}
        />
      </div>
      </div>
     
    </div> ): 
      (<Loader/>)} 
      </>
  )
}

export default Center;
