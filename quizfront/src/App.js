import './App.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Quiz from './components/Quiz';
import Question from './components/Question';
import React from 'react';
import SignIn from './components/Login';
import TestResultsTable from './components/Results';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { Sidebar, Menu, MenuItem, useProSidebar, SubMenu } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
function App() {
  const { collapseSidebar } = useProSidebar();
    return (
      <div id="app" style={({ height: "100vh" }, { display: "flex" })}>
     <Sidebar style={{ height: "100vh" }}>
        <Menu>
          <MenuItem
            icon={<MenuOutlinedIcon />}
            onClick={() => {
              collapseSidebar();
            }}
            style={{ textAlign: "center" }}
          >
            {" "}
            <h2>Java Quiz App</h2>
          </MenuItem>
          <MenuItem component={<Link to="/" />} icon={<HomeOutlinedIcon />}>Testy</MenuItem>
           <MenuItem component={<Link to="/login" />} icon={<AddIcon />}>Dodaj test</MenuItem> 
          <MenuItem component={<Link to="/results" />} icon={<ReceiptOutlinedIcon />}>Wyniki</MenuItem>
                  </Menu>
      </Sidebar>
      <section>
        <Routes>
          <Route path="/" element={<Quiz />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/results" element={<TestResultsTable />} />
          <Route path="/quiz/:id" element={<Question />} />
        </Routes>
      </section>
      </div>
    );
  }
  
  export default App;
