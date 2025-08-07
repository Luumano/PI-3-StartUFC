import React from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import Description from '../../components/Description/Description'
import Info from '../../components/Info/Info'
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import Germinar from '../Germinar/Germinar'
import QuemSomos from '../QuemSomos/QuemSomos'
import NewsList from '../NewsList/NewsList'


const Home = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <Description />
      <QuemSomos />
      <Info />
      <NewsList />
      <Germinar />
      <Footer />
    </div>
  );
};

export default Home
