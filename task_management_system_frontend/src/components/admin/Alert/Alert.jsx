import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Alert(params) {

    const { title, message, link, show, handleClose } = params;
    const navigate = useNavigate();

    return (
        <>
            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{message}</Modal.Body>
                    <Modal.Footer>
                        {
                            link!=''?
                                <>
                                    <Button variant="secondary" onClick={() => navigate(link)}>
                                        Close
                                    </Button>
                                </> :
                                <>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                </>
                        }

                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}