import React from 'react';
import { useLocation } from 'react-router-dom'

const API_KEY = require('./keys.json').apiKey


const POSTER_URL_BASE = "https://image.tmdb.org/t/p/w500/"
const MOVIES_PER_ROW = 4
const IMDB_TITLE_BASE_URL = "https://www.imdb.com/title/"
const MIN_SEARCH_QUERY_LENGTH = 3


async function getMovieIMDBid(id){
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
  return fetch(url)
  .then(response=>response.json())
  .then(response=>{
    const customIMDBurl = IMDB_TITLE_BASE_URL + response.imdb_id
    window.open(customIMDBurl)})
  .catch(error=>{
    console.log("Error obtaining movie's IMDB id :"+error)
  })

}

function getMovieBlock(metadata){
  const posterURL = POSTER_URL_BASE+metadata.poster_path
  return (
      <img key={metadata.id} src={posterURL} alt={`${metadata.original_title} poster`} style={{width:'20vw', height:'30vw'}}
      onClick={()=>getMovieIMDBid(metadata.id)}/>
)
}

function getMovieBlocks(resultsForPage){
  const rows = []

  var itemsInRow = []

  for (var i = 0; i < resultsForPage.length; i++) {
    const movieMetadata = resultsForPage[i]
    const newBlock = getMovieBlock(movieMetadata)
    itemsInRow.push(newBlock)


    if ((i+1) % MOVIES_PER_ROW === 0){
      const newRow = (<div key={i} style = {{display: 'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'center'}}>
                      {itemsInRow}
                    </div>)
      rows.push(newRow)
      itemsInRow = []
    }
  }

  return rows

}


const searchMovies = (query) =>{
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}`
  console.log("url: ",url)

  return fetch(url)
  .then(response=>response.json())
  .then(rawData=>rawData.results)
  .catch(error=>console.log('Error with movie query'+error))
}

const getData = async (pageNumber) =>{
  const apiCall = fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNumber}`)
  return apiCall.then(response=>response.json()).then(rawData=>rawData.results)
  .catch(error=>{
    console.log("Error fetching data from API"+error)
  })
}


export default class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {resultsForPage:[],pageNumber:1}
  }


  async componentDidMount(){
    const rawData = await getData(this.state.pageNumber)
    this.setState({resultsForPage:rawData})

  }

  handleInputChange = async (value) =>{
    if (value.length >=  MIN_SEARCH_QUERY_LENGTH){
      searchMovies(value)
      .then(results=>{
        this.setState({resultsForPage:results})
      })
    } else{
      getData(this.state.pageNumber)
      .then(results=>{
        this.setState({resultsForPage:results})
      })
    }

  }

  render (){
    return (
      <div className="container"
      style = {{  backgroundColor: '#282c34',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'calc(10px + 2vmin)',
        color: 'white'}}
      >
        <h1>Movies</h1>
        <div style={{display: 'flex',flexDirection:'row',width: "100%",alignItems: 'center',justifyContent: 'center'}}>
          <input type="text" onChange={(event) =>this.handleInputChange(event.target.value)} style={{width: '80%',height: '10vh',fontSize: '5vh',borderRadius: 10}}/>
        </div>
        <div style={{paddingTop: 5,display: 'flex',flexDirection: 'column',width: 1000,height: 'auto',alignItems: 'center',justifyContent: 'center'}}>
          {getMovieBlocks(this.state.resultsForPage)}
        </div>

        <div style={{display: 'flex',flexDirection:'row',width: "100%",alignItems: 'center',justifyContent: 'center'}}>
          <div>previous | current page number | next</div>
        </div>

      </div>
    );

  }

}
