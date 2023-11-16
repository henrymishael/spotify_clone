import React, { useEffect, useState } from 'react'
import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    RssIcon,
    HeartIcon,
    ArrowCircleLeftIcon
} from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import useSpotify from '@/hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '@/atoms/playlistAtom';
import Image from 'next/image';

function Sidebar({view, setView}) {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, SetPlaylists] = useState([]);
  const [playlistId, setPlaylistid] = useRecoilState(playlistIdState);

  console.log("you've picked playlist ***", playlistId);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
        spotifyApi.getUserPlaylists().then((data) => {
            SetPlaylists(data.body.items)
        })
    };
  }, [session, spotifyApi]);
 
  return (
    <div className='text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen  scrollbar-none w-[15rem] grow-0 shrink-0 sm:hidden md:flex md:flex-col bg-[#121212] pb-24 '>
      <div className='space-y-4 '>
      <button onClick={()=>signOut()} className='flex flex-row items-center space-x-2 hover:text-white'>
            <ArrowCircleLeftIcon className='h-5 w-5'/>
            <p>Logout</p>
           
        </button>
        
        <button  className={`flex flex-row items-center space-x-2 hover:text-white`}>
            <HomeIcon className='h-5 w-5'/>
            <p>Home</p>
        </button>
        <button onClick={()=>setView("search")} className={`${view === 'search' ? 'text-white' : null } flex flex-row items-center space-x-2 hover:text-white`}>
            <SearchIcon className='h-5 w-5'/>
            <p>Search</p>
        </button>
        <button onClick={()=>setView("library")} className={`${view === 'library' ? 'text-white' : null } flex flex-row items-center space-x-2 hover:text-white`}>
            <LibraryIcon className='h-5 w-5'/>
            <p>Your Library</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-500' />
       
        <button className='flex flex-row items-center space-x-2 hover:text-white'>
            <PlusCircleIcon className='h-5 w-5'/>
            <p>Create Playlist</p>
        </button>
        <button className='flex flex-row items-center space-x-2 hover:text-white'>
            <HeartIcon className='h-5 w-5'/>
            <p>Liked Songs</p>
        </button>
        <button className='flex flex-row items-center space-x-2 hover:text-white'>
            <RssIcon className='h-5 w-5'/>
            <p>Your episodes</p>
        </button>
        <hr className='border-t-[0.1px] border-gray-500' />

        {/* playlist */}
        {playlists.map((playlist) => (
            <div key={playlist.id} className='flex flex-row items-center gap-2'>
                <div className='w-10 h-10 overflow-hidden'>
                    <img className='rounded-md w-10 h-10' src={playlist?.images?.[0]?.url} alt="" />
                </div>
            <p 
            onClick={() =>{ 
                setView("playlist")
                setPlaylistid(playlist.id)}} className={` cursor-pointer hover:text-white`}>
                {playlist.name}
            </p>
            </div>
        ))}
        
       
      </div>
         
    </div>
  )
}

export default Sidebar

