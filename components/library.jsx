import { playlistIdState, playlistState } from '@/atoms/playlistAtom';
import useSpotify from '@/hooks/useSpotify';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { BsFillPlayFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import Head from 'next/head';
import Loader from './loader';
import Skeletal from './skeletal';

function Library({setView, playlistIdState }) {
    const { data: session } = useSession();
    const spotifyApi = useSpotify()
    const [dataLoaded, setDataLoaded] = useState(false);
    const [dataLoaded1, setDataLoaded1] = useState(false);
    const [playlistId, setPlaylistid] = useRecoilState(playlistIdState);
    const [playlists, SetPlaylists] = useState([]);
    const [isLoading, setLoading] = useState(true)
    // useEffect(() => {
    //     spotifyApi.getPlaylist(playlistId).then((data) => {
    //       SetPlaylist(data.body);
    //     })
    //     .catch((err) => console.log("something went wrong!", err))
    //   }, [spotifyApi, playlistId]);

    // function selectPlaylist(playlist) {
    //     setView('playlist')

    // }

    useEffect(() => {
      // Simulate loading data
      setTimeout(() => {
        setDataLoaded(true);
      }, 1500); // Simulating a 1.5 seconds delay for loading
      setTimeout(() => {
        setDataLoaded1(true);
      }, 2500); // Simulating a 1.5 seconds delay for loading
    }, []);


    useEffect(() => {
            setLoading(false)
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
               
                SetPlaylists(data.body.items)
            })
        };
      }, [session, spotifyApi]);

      function cn(...classes) {
        return classes.filter(Boolean).join(' ');
    }

  return (
    <>
    <Head>
   
      <title>{session?.user?.name} Library - SpotifyMusic</title>
    </Head>
    {dataLoaded ? (
    <div className='flex-grow h-screen'>
      <header   className=' z-10 sticky top-0 h-20 md:text-4xl xsm:text-2xl  p-8'>
        <div></div>
      </header>
      <div className={`flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-xl absolute right-8 z-20 top-5 `}
      
      >
          <img className='rounded-full w-10 h-10' src={session?.user.image} alt="dp" />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className='h-5 w-5' />
        </div>
        <div className='flex flex-col gap-4 px-8 h-screen overflow-y-scroll'>
            <h2 className='text-xl font-bold'>Create Playlists</h2>
            <div className='flex flex-wrap mb-48 gap-6 xsm:justify-center md:justify-normal '>
                {playlists.map((playlist) => {
                    return (
                      <>
                      {dataLoaded1 ? (
                    <div onClick={()=>{setView("playlist")
                    setPlaylistid(playlist.id)}} key={playlist.id} className={`flex flex-col justify-center cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4 ${isLoading ? 'grayscale bg-gray-200'
                    : 'grayscale-0 blur-0'}`}
                    onLoadingComplete={() => setLoading(false)}
                    >
                            <div className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 bottom-[7rem] group-hover:bottom-[7.5rem] right-8'>
                                <BsFillPlayFill className='h-6 w-6 text-black'/>
                            </div>
                            <img className={cn('duration-700 ease-in-out w-48 h-48 mb-4', 
                 
                 )} src={playlist?.images?.[0]?.url} alt=""
                
                 />
                            <p className='text-base text-white mb-1 w-48 truncate'>{playlist?.name}</p>
                            <p className='text-sm text-neutral-400 mb-8 w-48 truncate'>By {playlist?.owner?.display_name}</p>
                        </div> ) : 
                        (<Skeletal />)}
                        </>
                        )
                })}
            </div>
        </div>
    </div>) : 
    
    
    (<Loader />)}
    </>
  )
}

export default Library
