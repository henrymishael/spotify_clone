import { millisToMinutesAndSeconds } from '@/lib/time'
import React, { useEffect, useState } from 'react'
import { BsFillPlayFill } from 'react-icons/bs'
import Skeletal from './skeletal';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '@/atoms/playlistAtom';
import { currentTrackIdState, isPlayingState } from '@/atoms/songAtom';
import spotifyApi from '@/lib/spotify';
import { useSession } from 'next-auth/react';
import useSongInfo from '@/hooks/useSongInfo';
import { artistIdState } from '@/atoms/artistAtom';

function SearchResults({playlists, songs, artists, setView, isPlayingState, currentTrackIdState }) {

  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [playlistId, setPlaylistid] = useRecoilState(playlistIdState);
  const [currentTrackid, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [artistId, setArtistId] = useRecoilState(artistIdState)
  // const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
  const {data: session} = useSession()

  function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }

useEffect(() => {
  // Simulate loading data
  setTimeout(() => {
    setDataLoaded(true);
  }, 1500); // Simulating a 1.5 seconds delay for loading
  
  setLoading(false);
}, []);


const playSong = (song) => {
  setCurrentTrackId(song.id);
  setIsPlaying(true);

  const accessToken = spotifyApi.getAccessToken();
  if (accessToken) {
    spotifyApi.play({
      uris: [song.uri]
    });
  } else{
    console.log("on play", song)
  }
};

const fetchCurrentSong = () => {
  if (!songInfo) {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      console.log('Now playing: ', data.body?.item);
      setCurrentTrackId(data.body?.item?.id);
      console.log(data.body)
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data.body?.is_playing);
      });
    });
  }
}

useEffect(() => {
  if (spotifyApi.getAccessToken() && !currentTrackid) {
    fetchCurrentSong();
    setVolume(50);
  }
}, [currentTrackIdState, spotifyApi, session])


    // async function playSong(track) {
    //   setCurrentTrackId(track.id);
    //   setIsPlaying(true);
    //  if (session && session.accessToken) {
    //   const response = await fetch('https://api.spotify.com/v1/me/player/play',{
    //     method: 'PUT',
    //     headers: {
    //           Authorization: `Bearer ${session.accessToken}`
    //     },
    //     body: JSON.stringify({
    //       uris:[track.uri]
    //     })

    //   })
    //   console.log("on play", response.status)
    //  }}

  return (
    <div className='flex flex-col gap-8 px-8 h-screen overflow-y-scroll '>
      <div className='grid grid-cols-2'>
        <div className='space-y-4'>
          <h2 className='text-xl font-bold'>Top result</h2>
          <div onClick={()=>{setView("playlist")
            setPlaylistid(playlists[0].id)}} className='h-64 pr-8'>
            <div className='cursor-pointer relative group min-h-64 w-full bg-neutral-800 hover:bg-neutral-700 p-4 flex flex-col gap-4 rounded-md transition duration-500'>
            <div className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-500 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center group-hover:bottom-8 rounded-full bg-green-500 bottom-6 right-8'>
                        <BsFillPlayFill className='h-6 w-6 text-black'/>
                    </div>
                    {playlists && <>
                    <img className='h-28 w-28 rounded' src={playlists[0].images[0].url} alt="" />
                    <p className='text-2xl font-bold'>{playlists[0].name}
                    </p>
                    <p className='text-sm text-neutral-400'>By {playlists[0].owner.display_name}</p>
                    </>}
            </div>
          </div>
        </div>
        <div className='space-y-4'>
              <h2 className='text-xl font-bold'>Top Songs</h2>
              <div className='flex flex-col'>
                {songs.slice(0,4).map((song) => {
                  return (
                    <div 
                    onClick={() => playSong(song)} 
                    key={song.id} className='cursor-default w-full h-16 px-4 rounded-md flex items-center gap-4 hover:bg-neutral-700'>
                      <img className='h-10 w-10' src={song.album.images[0].url} alt="" />
                      <div>
                        <p className='text-[14px] truncate'>{song?.name}</p>
                        <p className='text-sm text-neutral-400'>{song?.artists[0].name}</p>
                      </div>
                      <div className='flex-grow flex items-center justify-end'>
                        <p className='text-sm text-neutral-400'>
                        {millisToMinutesAndSeconds(song?.duration_ms)}
                        </p>
                      </div>
                    </div>

                  )
                })}
              </div>
        </div>
      </div>
      <div className='space-y-4'>
        <h2 className='text-xl font-bold'>Artists</h2>
        <div className='flex flex-wrap gap-4'>
          {artists.slice(0,4).map((artist) => {
            return (
              <div
              onClick={()=>{
                setView("artist")
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
      <div className='space-y-4 mb-48'>
        <h2 className='text-xl font-bold'>Playlists</h2>
        <div className='flex flex-wrap gap-4'>
        {playlists.slice(0,4).map((playlist) => {
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
    </div>
  )
}

export default SearchResults
