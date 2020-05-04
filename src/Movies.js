import React from 'react';

const API_KEY = require('./keys.json').apiKey

const API_URL_BASE = "https://api.themoviedb.org/3/movie/"
const POSTER_URL_BASE = "https://image.tmdb.org/t/p/w500/"
const IMDB_TITLE_BASE_URL = "https://www.imdb.com/title/"

const MOVIES_PER_ROW = 4
const MIN_SEARCH_QUERY_LENGTH = 3

// Visit the IMDB page of a movie with a corresponding Movie DB API id
async function goToMovieIMBDPage(id){
  const url = `${API_URL_BASE}${id}?api_key=${API_KEY}&language=en-US`
  return fetch(url)
  .then(response=>response.json())
  .then(response=>{
    const customIMDBurl = IMDB_TITLE_BASE_URL + response.imdb_id
    window.open(customIMDBurl)})
  .catch(error=>{
    console.log("Error obtaining movie's IMDB id :"+error)
  })

}

// Get JSX image object of movie with input metadata
function getMovieBlock(metadata){
  const posterURL = POSTER_URL_BASE+metadata.poster_path
  return (
      <img key={metadata.id} src={posterURL} alt={`Placeholder for poster of movie: "${metadata.original_title}"`} style={{width:'20vw', height:'30vw',cursor:'pointer'}}
      onClick={()=>goToMovieIMBDPage(metadata.id)}/>
)
}

// Get JSX array of rows of movie blocks
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

// Get top results with a search term
const searchMovies = (query) =>{
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}`

  return fetch(url)
  .then(response=>response.json())
  .then(rawData=>rawData.results)
  .catch(error=>console.log('Error with movie query'+error))
}

// Get top results with no search term on specified page
const getData = async (pageNumber) =>{
  const apiCall = fetch(`${API_URL_BASE}popular?api_key=${API_KEY}&language=en-US&page=${pageNumber}`)
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
    const routePageNumber = parseInt(this.props.match.params.page)
    const customMovie = (this.props.match.params.movie)
    var results = []

    if (customMovie && customMovie.length >= MIN_SEARCH_QUERY_LENGTH){
      // search for movie on UI, get first result, and visit IMDB page
      this.handleInputChange(customMovie)
      const queryResults = await searchMovies(customMovie)
      results = queryResults
      const firstResults = queryResults[0]
      const movieID = firstResults.id
      goToMovieIMBDPage(movieID)
    }
    else if (routePageNumber){
      this.setState({pageNumber:routePageNumber})
      results = await getData(routePageNumber)
    }
    else{
      results = await getData(this.state.pageNumber)
    }
    this.setState({resultsForPage:results})
  }

  // Hangle changes in seach input box
  handleInputChange = async (value) =>{
    if (value.length >=  MIN_SEARCH_QUERY_LENGTH){
      searchMovies(value)
      .then(results=>{
        this.setState({resultsForPage:results,pageNumber:1})
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
        <h1>Top Movies</h1>
        <div style={{display: 'flex',flexDirection:'row',width: "100%",alignItems: 'center',justifyContent: 'center'}}>
          <input type="text" placeholder="Search for a movie here..." onChange={(event) =>this.handleInputChange(event.target.value)} style={{width: '80%',height: '10vh',fontSize: '5vh',borderRadius: 10,textAlign: 'center'}}/>
        </div>
        <div style={{paddingTop: 5,display: 'flex',flexDirection: 'column',width: 1000,height: 'auto',alignItems: 'center',justifyContent: 'center'}}>
          {getMovieBlocks(this.state.resultsForPage)}
        </div>
        <div style={{display: 'flex',flexDirection:'row',width: "100%",alignItems: 'center',justifyContent: 'center'}}>
          {this.state.pageNumber > 1 ? (<a href={`/${this.state.pageNumber - 1}`} style={{color: 'aqua',cursor:'pointer'}} >previous</a>) : <div></div>}
          <div style={{margin: 5}}>page {this.state.pageNumber} </div>
          <a href={`/${this.state.pageNumber + 1}`} style={{color: 'aqua',cursor:'pointer'}} >next</a>
        </div>
        <div style={{margin:10,fontSize: 14}}>
          Made with <span style={{color: "#e25555"}}>&#9829;</span> by <a style={{color:'white',textDecoration:'none'}}href="https://github.com/williamrodz">William Rodriguez Jimenez</a>
        </div>
      </div>
    );

  }

}
