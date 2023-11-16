import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react'
import { PiMagnifyingGlass } from 'react-icons/pi';
import useSearch from '@/hooks/useSearch';
import FeaturedPlaylists from './featuredPlaylists';
import SearchResults from './SearchResults';
import useSpotify from '@/hooks/useSpotify';
import Head from 'next/head';
import { currentTrackIdState, isPlayingState } from '@/atoms/songAtom';



function Search({setView, playlistIdState,currentTrackIdState, isPlayingState }) {
  const { data: session } = useSession();
  const {accessToken} = session;
  const [searchData, setSearchData] = useState(null)
  const [inputValue, setInputValue] = useState('') 
  const inputRef = useRef(null)
  const spotifyApi = useSpotify();
  

  

  async function updateSearchResults(query) {
    try {
      const response = await fetch(
        'https://api.spotify.com/v1/search?' + new URLSearchParams({
          q: query,
          type: "artist,playlist,track"
        }), {
        headers: {
          Authorization: `Bearer ${spotifyApi.getAccessToken()}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log(data);
      setSearchData(data); // Adjust this based on the structure of the response
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  



  useEffect(() => {
    inputRef.current.focus()
  }, [inputRef])

  return (
    <>
    <Head>
      <title>Spotify - Search</title>
    </Head>
    <div className='flex-grow h-screen'>
      <header   className=' z-10 sticky top-0 h-20 md:text-4xl xsm:text-2xl flex items-center  px-8'>
        <input ref={inputRef} value={inputValue} onChange={async (e) => {
          setInputValue(e.target.value)
          await updateSearchResults(e.target.value)
        }} className='rounded-full bg-white w-96 pl-12 text-neutral-900 text-xl py-2 font-normal outline-0' type="text" />
        <PiMagnifyingGlass className='absolute top-7 left-10 h-6 w-6 text-neutral-800'/>
        <div></div>
      </header>
      <div className={`flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-xl absolute right-8 z-20 top-5 `}
      
      >
          <img className='rounded-full w-10 h-10' src={session?.user.image} alt="dp" />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className='h-5 w-5' />
        </div>
        <div className=''>
          {searchData === null ? <FeaturedPlaylists 
             setView = {setView}
             playlistIdState={playlistIdState}
          /> : <SearchResults 
                playlists={searchData?.playlists.items}
                songs={searchData?.tracks.items}
                artists={searchData?.artists.items}
                setView = {setView}
                playlistIdState={playlistIdState}
                isPlayingState={isPlayingState}
                currentTrackIdState={currentTrackIdState}
                
                />
               }
        </div>
    </div>
    </>
  )
}
export default Search;
