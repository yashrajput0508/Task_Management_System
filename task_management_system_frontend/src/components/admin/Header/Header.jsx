import { Button, Container, Form, Nav, NavDropdown, Navbar, Offcanvas } from "react-bootstrap";
import HeaderCSS from './Header.module.css';
import AdminIMG from '../../../assets/AdminLogo.png';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header(params) {

    // const [clicked, setClicked] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        // setClicked(true);
        // setTimeout(() => setClicked(false), 300);
        navigate("/");
    };

    return (
        <>
            {['md'].map((expand) => (
                <Navbar key={expand} expand={expand} className="mb-3" bg="info" data-bs-theme="dark">
                    <Container fluid>
                        <Navbar.Brand href="#">
                            <img
                                alt=""
                                src={AdminIMG}
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{' '}
                            <b>ADMIN PORTAL</b></Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    ADMIN PORTAL
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-start flex-grow-1 pe-2">
                                    <Nav.Link as={Link} to="/admin/dashboard" className={`${HeaderCSS.nav} px-3`}><b>Dashboard</b></Nav.Link>
                                    <Nav.Link as={Link} to="/admin/member" className={`${HeaderCSS.nav} px-3`}><b>Member</b></Nav.Link>
                                </Nav>
                                <button className={`${HeaderCSS.btnDanger}`}
      onClick={handleClick}>Logout</button>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            ))}
        </>
    )
}