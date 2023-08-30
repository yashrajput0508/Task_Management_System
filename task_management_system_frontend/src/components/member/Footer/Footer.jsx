import { Button, Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import FooterCSS from './Footer.module.css';

export default function Footer(params) {
    return (
        <>
            <Navbar bg="info" data-bs-theme="dark" fixed="bottom">
                <Container fluid>
                    <Navbar.Collapse className="justify-content-center">
                        <Navbar.Text className="footer" style={{color:'white'}}>
                            &copy; 2023. All rights reserved.
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}