import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Account, Explore, Home } from '../pages';
import { AnimatePresence } from 'framer-motion';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/explore" element={<Explore />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
