import React, { useEffect, useState } from 'react'
import { BsFillPlayFill } from 'react-icons/bs'
import Skeletal from './skeletal'
import { useSession } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '@/atoms/playlistAtom';

function FeaturedPlaylists({setView }) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [playlists, SetPlaylists] = useState([]);
    const { data: session } = useSession();
    const [playlistId, setPlaylistid] = useRecoilState(playlistIdState);
    const spotifyApi = useSpotify()
    // const [playlistId, setPlaylistid] = useRecoilState(playlistIdState);

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
          setDataLoaded(true);
        }, 1500); // Simulating a 1.5 seconds delay for loading
        // setTimeout(() => {
        //   setDataLoaded(true);
        // }, 2500); // Simulating a 1.5 seconds delay for loading
      }, []);

      useEffect(() => {
        setLoading(false)
    if (spotifyApi.getAccessToken()) {
        spotifyApi.getFeaturedPlaylists().then((data) => {
            
            SetPlaylists(data.body.playlists.items)
        })
    };
  }, [session, spotifyApi]);

  function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}



  return (
    <div className='flex flex-col gap-4 px-8 h-screen overflow-y-scroll'>
    <h2 className='text-xl font-bold'>Featured Playlists</h2>
    <div className='flex flex-wrap mb-48 gap-6 xsm:justify-center md:justify-normal '>
        {playlists.map((playlist) => {
            return (
              <>
              {dataLoaded ? (
            <div onClick={()=>{setView("playlist")
            setPlaylistid(playlist.id)}} key={playlist.id} className={`flex flex-col justify-center cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4 ${isLoading ? 'grayscale bg-gray-200'
            : 'grayscale-0 blur-0'}`}
            onLoadingComplete={() => setLoading(false)}
            >
                    <div className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 bottom-[7rem] group-hover:bottom-[7.5rem] right-8'>
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
  )
}

export default FeaturedPlaylists
