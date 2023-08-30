import { useNavigate, useParams } from "react-router-dom"
import TaskDetailCSS from './TaskDetail.module.css';
import { Button, Card, Form, Modal } from "react-bootstrap";
import { Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteTaskService, FetchALLTaskService } from "../../../services/admin/dashboard/TaskService";
import { setInitialTasks } from "../../../redux/counter/adminTask";
import { FetchAllMembersService } from "../../../services/admin/member/MemberService";
import { FetchTaskSubmissionService, UpdateTaskSubmissionService } from "../../../services/member/TaskSubmissionService";

function Star({ filled, onClick }) {
    return (
        <span onClick={onClick} className={`${TaskDetailCSS.star} ${filled ? TaskDetailCSS.filled : ''}`}>
            ★
        </span>
    );
}

function ReviewModel(params) {

    const { show, handleShow, handleClose, taskSubmission } = params;
    const [rating, setRating] = useState(taskSubmission ? taskSubmission.taskRating : 1);
    const [comment, setComment] = useState(taskSubmission ? taskSubmission.taskComment : "");
    const [validated, setValidated] = useState(false);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const onSubmit = (event) => {
        const form = event.currentTarget;

        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity()) {

            taskSubmission.taskRating = rating;
            taskSubmission.taskComment = comment;

            UpdateTaskSubmissionService(taskSubmission).then((response) => {
                if (response.success) {
                    alert("Comment Successfully Submitted");
                } else {
                    alert("Comment Cannot Submitted");
                }
            }).catch(() => {
                alert("Comment Cannot Submitted");
            });

            handleClose();
        }

        setValidated(true);
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Review</Modal.Title>
                </Modal.Header>

                <Form noValidate validated={validated} onSubmit={onSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Ratings</Form.Label>
                            <Form.Group>
                                <div className={`${TaskDetailCSS['star-rating']} ${TaskDetailCSS['star-container']}`}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            filled={star <= rating}
                                            onClick={() => handleRatingChange(star)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Comment</Form.Label>
                            <Form.Control required as="textarea" rows={3} value={comment} onChange={(data) => setComment(data.target.value)} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button type="submit" variant="primary">
                            Submit
                        </Button>
                    </Modal.Footer>
                </Form>

            </Modal>
        </>
    );
}

export default function TaskDetail(params) {

    const { taskId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [task, setTask] = useState();

    const [member, setMember] = useState('');
    const [taskSubmission, setTaskSubmission] = useState();

    const onSubmit = (values, actions) => {

        handleShow();
    };

    function deleteTask() {
        DeleteTaskService(task.taskId).then((response) => {
            if (response.success) {
                alert(response.message);
                navigate("/admin/dashboard");
            } else {
                alert(response.message);
            }
        }).catch((reason) => {
            alert(reason.message);
        })
    }

    useEffect(() => {

        FetchALLTaskService().then((response) => {
            if (response.success) {
                dispatch(setInitialTasks(response.tasks));
                setTask(response.tasks.filter((task) => task.taskId == taskId)[0]);
            }
        }).catch(() => {
        })


        FetchTaskSubmissionService(taskId).then((response) => {
            if (response.success) {
                setTaskSubmission(response.taskSubmission)
            }
        })
    }, [])

    useEffect(() => {
        if (task) {
            FetchAllMembersService().then((response) => {
                if (response.success) {
                    setMember(response.members.filter((member) => member.memberId == task.taskAssigned
                    )[0]);
                }
            })
        }
    }, [task])

    return (
        <>

            {show && <ReviewModel show={show} handleShow={handleShow} handleClose={handleClose} taskSubmission={taskSubmission} />}

            <div className="container-fluid py-3 mx-auto" style={{ height: 80 }}>
                <div className="row d-flex justify-content-center">
                    <div className="col-xl-10 col-lg-9 col-md-11 col-11 text-center mb-3">
                        <div className={`${TaskDetailCSS.card} ${TaskDetailCSS.fadeIn}`}>
                            <div className="d-flex align-items-center">
                                <div className="col-md-4">
                                    <div class="d-flex gap-2 justify-content-start mb-4">
                                        <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Go Back" onClick={() => navigate("/admin/dashboard")}><i class="fa fa-arrow-circle-left"></i></button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h5 className={`${TaskDetailCSS.dashboard_heading} text-center mb-4 h3`}><b>Task Info</b></h5>
                                </div>
                                <div className="col-md-4 align-content-center">
                                    <div class="d-flex gap-2 justify-content-end mb-4">
                                        <button class="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Edit Task" onClick={() => navigate(`/admin/dashboard/editTask/${task.taskId}`)}><i class="fa fa-edit"></i></button>
                                        <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Delete Task" onClick={() => deleteTask()}><i class="fa fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Card className="mb-4 shadow-sm">
                                        <Card.Header className="bg-secondary text-white">Details Info</Card.Header>
                                        <Card.Body>
                                            <form>
                                                <div className="row">
                                                    <label className="col-sm-1 col-form-label"></label>
                                                    <label className="col-sm-5 col-form-label text-start"><b>Task ID</b></label>
                                                    <label className="col-sm-1 col-form-label">-</label>
                                                    <div className="col-sm-5">
                                                        <input type="text" readOnly className="form-control-plaintext text-start" id="taskId" value={task ? task.taskId : ''} />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <label className="col-sm-1 col-form-label"></label>
                                                    <label className="col-sm-5 col-form-label text-start"><b>Task Title</b></label>
                                                    <label className="col-sm-1 col-form-label">-</label>
                                                    <div className="col-sm-5">
                                                        <input type="text" readOnly className="form-control-plaintext text-start" id="taskTitle" value={task ? task.taskTitle : ''} />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <label className="col-sm-1 col-form-label"></label>
                                                    <label className="col-sm-5 col-form-label text-start"><b>Task Type</b></label>
                                                    <label className="col-sm-1 col-form-label">-</label>
                                                    <div className="col-sm-5">
                                                        <input type="text" readOnly className="form-control-plaintext text-start" id="taskType" value="Task" />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <label className="col-sm-1 col-form-label"></label>
                                                    <label className="col-sm-5 col-form-label text-start"><b>Task Status</b></label>
                                                    <label className="col-sm-1 col-form-label">-</label>
                                                    <div className="col-sm-5 d-flex align-items-center justify-content-start">
                                                        <span className="badge text-bg-secondary rounded-pill">{task ? task.progress ? "OPEN" : "CLOSE" : "OPEN"}</span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <label className="col-sm-1 col-form-label"></label>
                                                    <label className="col-sm-5 col-form-label text-start"><b>Task Priority</b></label>
                                                    <label className="col-sm-1 col-form-label">-</label>
                                                    <div className="col-sm-5 d-flex align-items-center justify-content-start">
                                                        {
                                                            task ?
                                                                <>
                                                                    <span className={`${TaskDetailCSS.priority_badge} ${TaskDetailCSS[`${task.priority}_priority`]} text-white`}>
                                                                        {task.priority.toUpperCase()}
                                                                    </span>
                                                                </> :
                                                                ""
                                                        }
                                                    </div>
                                                </div>
                                            </form>
                                        </Card.Body>
                                    </Card>
                                </div>
                                <div className="col-md-6">
                                    <Card className="mb-4 shadow-sm">
                                        <Card.Header className="bg-secondary text-white">Dates & Other Info</Card.Header>
                                        <Card.Body>
                                            <form>
                                                <div className="row">
                                                    <label className="col-sm-1 col-form-label"></label>
                                                    <label className="col-sm-5 col-form-label text-start"><b>Assignee</b></label>
                                                    <label className="col-sm-1 col-form-label">-</label>
                                                    <div className="col-sm-5">
                                                        <input type="text" readOnly className="form-control-plaintext text-start" id="taskAssignee" value={member ? member.memberName : ""} />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <label className="col-sm-1 col-form-label"></label>
                                                    <label className="col-sm-5 col-form-label text-start"><b>Assigned By</b></label>
                                                    <label className="col-sm-1 col-form-label">-</label>
                                                    <div className="col-sm-5">
                                                        <input type="text" readOnly className="form-control-plaintext text-start" id="taskAssigned" value="Yash" />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <label className="col-sm-1 col-form-label"></label>
                                                    <label className="col-sm-5 col-form-label text-start"><b>Due Date</b></label>
                                                    <label className="col-sm-1 col-form-label">-</label>
                                                    <div className="col-sm-5 d-flex align-items-center justify-content-start">
                                                        <input type="text" readOnly className="form-control-plaintext text-start" id="dueDate" value={task ? task.dueDate : ""} />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <label className="col-sm-1 col-form-label"></label>
                                                    <label className="col-sm-5 col-form-label text-start"><b>Created Date</b></label>
                                                    <label className="col-sm-1 col-form-label">-</label>
                                                    <div className="col-sm-5 d-flex align-items-center justify-content-start">
                                                        <input type="text" readOnly className="form-control-plaintext text-start" id="createdDate" value={task ? task.createdDate : ""} />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <label className="col-sm-1 col-form-label"></label>
                                                    <label className="col-sm-5 col-form-label text-start"><b>Updated Date</b></label>
                                                    <label className="col-sm-1 col-form-label">-</label>
                                                    <div className="col-sm-5 d-flex align-items-center justify-content-start">
                                                        <input type="text" readOnly className="form-control-plaintext text-start" id="updatedDate" value={task ? task.updatedDate : ""} />
                                                    </div>
                                                </div>
                                            </form>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                            <div className="pt-2">
                                <Card className="mb-4 shadow-sm">
                                    <Card.Header className="bg-secondary text-white">Task Description</Card.Header>
                                    <Card.Body>
                                        <textarea readOnly className="form-control-plaintext" id="taskDescription" style={{ resize: "none" }} value={task ? task.taskDescription : ""} />
                                    </Card.Body>
                                </Card>
                            </div>
                            {
                                taskSubmission ?
                                    <>
                                        <div className="pt-2">
                                            <Card className="mb-4 shadow-sm">
                                                <Card.Header className="bg-secondary text-white">Submission</Card.Header>
                                                <Card.Body>
                                                    <textarea readOnly className="form-control-plaintext" id="submission" style={{ resize: "none" }} value={taskSubmission ? taskSubmission.taskSubmission : ""} />
                                                </Card.Body>
                                                <Card.Footer className="text-muted text-end">
                                                    <button type="button" className="btn btn-primary" onClick={() => onSubmit()}>Review</button>
                                                </Card.Footer>
                                            </Card>
                                        </div>
                                    </> :
                                    ""
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}