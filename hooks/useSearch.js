import useSpotify from './useSpotify';
import { useSession } from 'next-auth/react';

import React, { useEffect, useState } from 'react'

function useSearch() {
    const [searchData, setSearchData] = useState(null)
    const spotifyApi = useSpotify();

    useEffect(() =>{
        async function updateSearchResults(query) {
            const searchInfo = await fetch('https://api.spotify.com/v1/search' + new URLSearchParams({
            q: query,
            type:["artist", "playlist", "track"]
            }), {
                headers: {
                    Authorization: `Bearer $Bearer ${spotifyApi.getAccessToken()}`,
                }
    
            })
            .then((response) => response.json());
            setSearchData(searchInfo)
        }
        updateSearchResults();
        },[query, spotifyApi])

  return  
        searchData;
}

export default useSearch
