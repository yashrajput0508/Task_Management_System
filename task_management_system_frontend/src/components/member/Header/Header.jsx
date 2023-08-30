import { Button, Container, Form, Nav, NavDropdown, Navbar, Offcanvas } from "react-bootstrap";
import HeaderCSS from './Header.module.css';
import MemberIMG from '../../../assets/MemberLogo.png';
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function Header(params) {

    const navigate = useNavigate();
    const {memberId} = useParams();

    const handleClick = () => {
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
                                src={MemberIMG}
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{' '}
                            <b>EMBER PORTAL</b></Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    MEMBER PORTAL
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-start flex-grow-1 pe-2">
                                    <Nav.Link as={Link} to={`/member/${memberId}/dashboard`} className={`${HeaderCSS.nav} px-3`}><b>Dashboard</b></Nav.Link>
                                    <Nav.Link as={Link} to={`/member/${memberId}/mytask`} className={`${HeaderCSS.nav} px-3`}><b>MyTask</b></Nav.Link>
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