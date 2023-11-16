import { artistIdState, artistState } from '@/atoms/artistAtom';
import { playlistIdState, playlistState } from '@/atoms/playlistAtom';
import { currentTrackIdState } from '@/atoms/songAtom';
import useSpotify from '@/hooks/useSpotify';
import { shuffle } from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import Loader from './loader';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { BsFillPlayFill } from 'react-icons/bs';
import Songs from './songs';
import Head from 'next/head';
import Song from './song';
import Songnew from './Songnew';


const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
]

const colors1 = [
  "to-indigo-500",
  "to-blue-500",
  "to-green-500",
  "to-red-500",
  "to-yellow-500",
  "to-pink-500",
  "to-purple-500",
]

const defaultMarket = 'US';

function Artist({view, setView, artistIdState, track}) {
  const { data: session } = useSession();
  const spotifyApi = useSpotify()
  const [color, setColor] = useState(null);
  const [color1, setColor1] = useState(null);
  const [hover, setHover] = useState(false);
  const [opacity, setOpacity] = useState(0)
  const [textOpacity, setTextOpacity] = useState(0);
  const currentTrack = useRecoilValue(currentTrackIdState)
  const [dataLoaded, setDataLoaded] = useState(false);
  const [artist, setArtist] = useRecoilState(artistState)
  const artistId = useRecoilValue(artistIdState)
  const [topTracks, setTopTracks] = useState([]);
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [artistid, setArtistId] = useRecoilState(artistIdState)

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
    if (!spotifyApi || !artistId) {
      return;
    }
    spotifyApi.getArtist(artistId).then((data) => {
      setArtist(data.body);
    })
    .catch((err) => console.log("something went wrong!", err))
  }, [spotifyApi, artistId]);
  console.log(artist);


  useEffect(() => {
    if (!spotifyApi || !artistId) {
      return;
    }
    spotifyApi.getArtistTopTracks(artistId, defaultMarket).then((data) => {
      setTopTracks(data.body.tracks);
    })
    .catch((err) => console.log("something went wrong!", err))
  }, [spotifyApi, artistId]);

  console.log(topTracks);

  useEffect(() => {
    if (!spotifyApi || !artistId) {
      return;
    }
    spotifyApi.getArtistRelatedArtists(artistId).then((data) => {
      setRelatedArtists(data.body.artists);
    })
    .catch((err) => console.log("something went wrong!", err))
  }, [spotifyApi, artistId]);

  console.log(relatedArtists);

  function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  

   // Assuming you have a function to load data, you can use useEffect to simulate data loading
   useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setDataLoaded(true);
    }, 1500); // Simulating a 2 second delay for loading
  }, []);

 

  useEffect(() => {
    setColor(shuffle(colors).pop());
    setColor1(shuffle(colors1).pop());
  },[artistId])

  return (
    <>
    <Head>
      <title> {artist?.name} | Spotify Playlist</title>
    </Head>
    {dataLoaded ? (
    <div  className='flex-grow h-screen overflow-y-scroll scrollbar-none'>
      
      <header onScroll={''} style={{opacity: opacity}}  className={` z-10 sticky top-0 h-20 md:text-4xl xsm:text-2xl  bg-black p-8 flex items-center font-bold gap-4`}>
        <div style={{opacity: textOpacity}} className='w-10 h-10' >
          <img src={artist?.images?.[0]?.url} alt="" />
        </div>
        <div style={{opacity: textOpacity}}  >{artist?.name}</div>
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
         <img className='md:w-44 md:h-44 xsm:w-40 xsm:h-40 rounded-full' src={artist?.images?.[0]?.url} alt="" />
        </div>
        <div>
          <p className='text-sm font-bold'>Artist</p>
          <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{artist?.name}</h1>
        </div>
      </section>
      <div className='space-y-4'>
        <h2 className='text-xl font-bold my-4 px-12 '>Top tracks</h2>
      <div className='text-white px-8 flex flex-col space-y-1 pb-10'>
        {topTracks && topTracks.map((topTrack, i) => {
          return  <Songnew
                    key={topTrack.id}
                    track={topTrack}
                    order={i}
                    setView={setView}
        />
        })}
        </div>
      </div>
      <div className='space-y-4 '>
        <h2 className='text-xl font-bold my-4 px-12 '>Related Artists</h2>
        <div className='flex flex-wrap gap-4 pb-28 px-12'>
        {relatedArtists.slice(0,4).map((artist) => {
            return (
              <div
              onClick={()=>{
                setView=("artist")
                setArtistId(artist.id)
              }
            } 
               key={artist.id} className='cursor-pointer relative group w-56  mb-2 bg-neutral-800 hover:bg-neutral-700 p-4'>
                <div className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 bottom-[7rem] group-hover:bottom-[7.5rem] right-8'>
                        <BsFillPlayFill className='h-6 w-6 text-black'/>
                    </div>
                    <img className={cn('duration-700 ease-in-out w-48 h-48 mb-4 rounded-full', 
         
         )} src={artist?.images?.[0]?.url} alt=""
        
         />
                    <p className='text-base text-white mb-1 w-48 truncate'>{artist?.name}</p>
                    <p className='text-sm text-neutral-400 mb-8 w-48 truncate'>Artist</p>
                </div>
              
            )
          })}
        </div>
      </div>
      </div>
     
    </div> ): 
      (<Loader/>)} 
      </>
  )
}

export default Artist
