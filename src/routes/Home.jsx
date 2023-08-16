import Banner from '../components/Banner'
import Search from '../components/Search/Search'
import HouseList from '../components/Houses/HouseList';
//import VoIP from '../components/VoIP/VoIP';

const Home = () => {
  return (
    <>
      <Banner />
      
      <Search />
      <HouseList />
    </>
  )
}

export default Home;