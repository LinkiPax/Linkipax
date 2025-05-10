// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHouse, faNetworkWired, faBriefcase, faCommentDots, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
// import { Navbar, Nav, Form, FormControl, Button, NavDropdown, Spinner } from 'react-bootstrap'; // Import Spinner for loading state
// import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for routing
// import axios from 'axios';
// import './Navbar.css';
// import Cookies from 'js-cookie';

// const NavbarComponent = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // Add loading state
//   const navigate = useNavigate(); // Use navigate instead of useHistory
//   const [clickCount, setClickCount] = useState(0);// Add click count state

//   // Navigation items data
//   const navItems = [
//     { name: "Home", icon: faHouse, path: "/home" },
//     { name: "My Network", icon: faNetworkWired, path: "/network" },
//     { name: "meeting", icon: faBriefcase, path: "/meeting" },
//     { name: "Messaging", icon: faCommentDots, path: "/messages" },
//     { name: "Notification", icon: faBell, path: "/notifications" },
//   ];

//   // Fetch user data when component mounts
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = Cookies.get('auth_token'); // Get the token from cookies
//         console.log("Token:", token);
//         if (!token) {
//           // If there's no token, redirect to login
//           navigate("/");
//           return;
//         }
        
//         localStorage.setItem("auth_token", token); // Store the token in localStorage
//         let tokens=localStorage.getItem("auth_token");
//         let userId = localStorage.getItem("userId");
//         const response = await axios.get(`http://localhost:5000/user/me/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${tokens}`, // Send the token in the Authorization header
//           },
//         });
//         setUser(response.data); // Set the user data if logged in
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setUser(null); // Set user to null if not logged in or error occurs
//         if (error.response && error.response.status === 401) {
//           navigate("/"); // Redirect to login if unauthorized
//         }
//       } finally {
//         setLoading(false); // Set loading to false after the data fetch is complete
//       }
//     };
  
//     fetchUserData();
//   }, [navigate]); // Re-run only when navigate changes (e.g., after logout)
//     // Handle triple-click detection
//     useEffect(() => {
//       let timer;
//       if (clickCount === 3) {
//         navigate("/resume"); // Redirect to the desired page
//         setClickCount(0); // Reset click count
//       } else {
//         // Reset the count if no further clicks happen within 500ms
//         timer = setTimeout(() => setClickCount(0), 500);
//       }
  
//       return () => clearTimeout(timer); // Cleanup the timer
//     }, [clickCount, navigate]);
  
//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem("auth_token"); // Remove token on logout
//     Cookies.remove('auth_token'); // Also remove token from cookies
//     setUser(null); // Clear user data
//     navigate("/"); // Redirect to login page
//   };

//   return (
//     <Navbar expand="lg" className="navbar">
//       <div className="navbar__container">
//         {/* Logo Section */}
//         <Navbar.Brand href="#home" className="navbar__logo" onClick={() => setClickCount(prev => prev + 1)}  >
//           <h1>Linkify</h1>
//         </Navbar.Brand>

//         {/* Search Section */}
//         <Form className="d-flex navbar__search">
//           <FormControl
//             type="search"
//             placeholder="Search..."
//             className="mr-2"
//             aria-label="Search"
//           />
//           <Button variant="outline-primary">Search</Button>
//         </Form>

//         {/* Navigation Items */}
//         <Nav className="ml-auto navbar__pages">
//           {navItems.map((item, index) => (
//             <Nav.Item key={index}>
//               <Nav.Link as={Link} to={item.path}>
//                 <div className={`navbar__item ${item.name.replace(/\s/g, "")}`}>
//                   <FontAwesomeIcon icon={item.icon} className="navbar__icon" />
//                   <span>{item.name}</span>
//                 </div>
//               </Nav.Link>
//             </Nav.Item>
//           ))}

//           {/* "Me" Dropdown */}
//           {loading ? (
//             <Spinner animation="border" variant="primary" /> // Show spinner while loading user data
//           ) : user ? (
//             <Nav.Item>
//               <NavDropdown title={<div className="navbar__item"><FontAwesomeIcon icon={faUser} className="navbar__icon" /><span>{user.name || 'Me'}</span></div>} id="me-dropdown">
//                 <NavDropdown.Item as={Link} to={`/profile/${user._id}`}>Profile</NavDropdown.Item>
//                 <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
//                 <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
//               </NavDropdown>
//             </Nav.Item>
//           ) : (
//             <>
//               <Nav.Item>
//                 <Nav.Link as={Link} to="/">
//                   <div className={`navbar__item ${"Login"}`}>
//                     <FontAwesomeIcon icon={faUser} className="navbar__icon" />
//                     <span>Login</span>
//                   </div>
//                 </Nav.Link>
//               </Nav.Item>
//               <Nav.Item>
//                 <Nav.Link as={Link} to="/signup">
//                   <div className={`navbar__item ${"Sign Up"}`}>
//                     <FontAwesomeIcon icon={faUser} className="navbar__icon" />
//                     <span>Sign Up</span>
//                   </div>
//                 </Nav.Link>
//               </Nav.Item>
//             </>
//           )}
//         </Nav>
//       </div>
//     </Navbar>
//   );
// };
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faNetworkWired, faBriefcase, faCommentDots, faBell, faUser, faMoon, faSun, faFilm, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Nav, Form, FormControl, Button, NavDropdown, Spinner, Container, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import Cookies from 'js-cookie';

const NavbarComponent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Navigation items data
  const navItems = [
    { name: "Home", icon: faHouse, path: "/home" },
    { name: "My Network", icon: faNetworkWired, path: "/network" },
    { name: "Meeting", icon: faBriefcase, path: "/meeting" },
    { name: "Messaging", icon: faCommentDots, path: "/messages" },
    { name: "Notification", icon: faBell, path: "/notifications" },
    { name: "shorts", icon: faFilm, path: "/shorts"}
  ];

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (!token) {
          navigate("/");
          return;
        }
        
        localStorage.setItem("auth_token", token);
        let tokens = localStorage.getItem("auth_token");
        let userId = localStorage.getItem("userId");
        const response = await axios.get(`http://localhost:5000/user/me/${userId}`, {
          headers: {
            Authorization: `Bearer ${tokens}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        if (error.response && error.response.status === 401) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  // Handle triple-click detection
  useEffect(() => {
    let timer;
    if (clickCount === 3) {
      navigate("/resume");
      setClickCount(0);
    } else {
      timer = setTimeout(() => setClickCount(0), 500);
    }

    return () => clearTimeout(timer);
  }, [clickCount, navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    Cookies.remove('auth_token');
    setUser(null);
    navigate("/");
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setExpanded(false);
    }
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
      {/* Navbar */}
      <Navbar expanded={expanded} expand="lg" className={`navbar ${darkMode ? "dark-mode" : ""}`} bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"}>
        <Container fluid>
          {/* Logo Section */}
          <Navbar.Brand href="#home" className="navbar__logo" onClick={() => setClickCount(prev => prev + 1)}>
            <h1>Linkify</h1>
          </Navbar.Brand>

          {/* Toggle Button for Mobile */}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />

          {/* Collapsible Content */}
          <Navbar.Collapse id="responsive-navbar-nav">
            {/* Search Section */}
            <Form className="d-flex navbar__search mx-auto my-2 my-lg-0" onSubmit={handleSearch}>
              <InputGroup className={`search-bar ${isSearchFocused ? 'focused' : ''}`}>
                <InputGroup.Text className="search-icon">
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <FormControl
                  type="search"
                  placeholder="Search for people, jobs, posts..."
                  className="search-input"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && (
                  <Button 
                    variant="link" 
                    className="clear-search" 
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                )}
                <Button 
                  variant="primary" 
                  className="search-button" 
                  type="submit"
                  disabled={!searchQuery.trim()}
                >
                  Search
                </Button>
              </InputGroup>
            </Form>

            {/* Rest of your Navbar content remains the same */}
            <Nav className="ml-auto navbar__pages">
              {navItems.map((item, index) => (
                <Nav.Item key={index}>
                  <Nav.Link as={Link} to={item.path} onClick={() => setExpanded(false)}>
                    <div className={`navbar__item ${item.name.replace(/\s/g, "")}`}>
                      <FontAwesomeIcon icon={item.icon} className="navbar__icon" />
                      <span>{item.name}</span>
                    </div>
                  </Nav.Link>
                </Nav.Item>
              ))}

              {/* Dark Mode Toggle Button */}
              <Nav.Item>
                <Nav.Link onClick={toggleDarkMode}>
                  <div className="navbar__item">
                    <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="navbar__icon" />
                    <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                  </div>
                </Nav.Link>
              </Nav.Item>

              {/* "Me" Dropdown */}
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : user ? (
                <Nav.Item>
                  <NavDropdown title={<div className="navbar__item"><FontAwesomeIcon icon={faUser} className="navbar__icon" /><span>{user.name || 'Me'}</span></div>} id="me-dropdown">
                    <NavDropdown.Item as={Link} to={`/profile/${user._id}`} onClick={() => setExpanded(false)}>Profile</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/settings" onClick={() => setExpanded(false)}>Settings</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/uploadshorts" onClick={() => setExpanded(false)}>UploadShorts</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </Nav.Item>
              ) : (
                <>
                  <Nav.Item>
                    <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                      <div className={`navbar__item ${"Login"}`}>
                        <FontAwesomeIcon icon={faUser} className="navbar__icon" />
                        <span>Login</span>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as={Link} to="/signup" onClick={() => setExpanded(false)}>
                      <div className={`navbar__item ${"Sign Up"}`}>
                        <FontAwesomeIcon icon={faUser} className="navbar__icon" />
                        <span>Sign Up</span>
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;