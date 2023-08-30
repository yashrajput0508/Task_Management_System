import { useNavigate, useParams } from "react-router-dom"
import TaskDetailCSS from './TaskDetail.module.css';
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Field, Formik } from "formik";
import { useEffect, useState } from "react";
import { FetchALLTaskService, UpdateTaskService } from "../../../services/admin/dashboard/TaskService";
import { AddTaskSubmissionService, FetchTaskSubmissionService } from "../../../services/member/TaskSubmissionService";

export default function TaskDetail(params) {

    const { memberId, taskId } = useParams();
    const [isdisabled, setDisabled] = useState(true);
    const navigate = useNavigate();

    const [filtertask, setFilterTask] = useState();
    const [taskSubmission, setTaskSubmission] = useState();

    const [initialValues, setInitialValues] = useState({
        taskId: '',
        memberId:'',
        taskSubmission: '',
        taskRating: 1,
        taskComment: ''
    });

    const validate = values => {

        const errors = {};

        if (!values.taskSubmission) {
            errors.taskSubmission = 'Task Submission should not be empty';
        }

        return errors;
    };

    function Stars({count}) {
        const stars = [];

        for (let i = 0; i < count; i++) {
            stars.push(<span key={i} className="fa fa-star text-warning"></span>);
        }

        for (let i = 0; i < 5-count; i++) {
            stars.push(<span key={i} className="fa fa-star-o"></span>);
        }

        return <>{stars}</>
    }

    const onSubmit = (values, actions) => {
        // Handle form submission logic here
        values.taskId = filtertask.taskId;
        values.memberId = memberId;
        const addTaskSubmission = AddTaskSubmissionService(values);

        addTaskSubmission.then((response) => {
            if (response.success) {
                alert(response.message);

                filtertask.progress = false;
                setFilterTask(filtertask);

                UpdateTaskService(filtertask).then(() => {
                    console.log("updated");
                })

                if (!filtertask.progress) {
                    FetchTaskSubmissionService(filtertask.taskId).then((value) => {
                        if (value.success) {
                            setTaskSubmission(value.taskSubmission);
                        }
                    }).catch((reason) => {
                        console.log(reason.message);
                    })
                }
            } else {
                alert(response.message);
            }
        }).catch((reason) => {
        })

    };

    useEffect(() => {
        FetchALLTaskService().then((response) => {
            if (response.success) {
                setFilterTask(response.tasks.find((task) => task.taskId == taskId));
            }
        })
    }, [])

    useEffect(() => {
        if (filtertask && !filtertask.progress) {
            FetchTaskSubmissionService(filtertask.taskId).then((value) => {
                if (value.success) {
                    setTaskSubmission(value.taskSubmission);
                    setInitialValues(value.taskSubmission);
                } else {
                    console.log(value.message);
                }
            }).catch((reason) => {
                console.log(reason.message);
            })
        }
    }, [filtertask])

    return (
        <>
            <div className="container-fluid py-3 mx-auto" style={{ height: 80 }}>
                <div className="row d-flex justify-content-center">
                    <div className="col-xl-10 col-lg-9 col-md-11 col-11 text-center mb-3">
                        <div className={`${TaskDetailCSS.card} ${TaskDetailCSS.fadeIn}`}>
                            <h5 className={`${TaskDetailCSS.dashboard_heading} text-center mb-4 h3`}><b>Task Info</b></h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <Card className="mb-4 shadow-sm">
                                        <Card.Header className="bg-secondary text-white">Details Info</Card.Header>
                                        <Card.Body>
                                            <form>
                                                <div class="row">
                                                    <label for="taskId" class="col-sm-1 col-form-label"></label>
                                                    <label for="taskId" class="col-sm-5 col-form-label text-start"><b>Task ID</b></label>
                                                    <label for="taskId" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5">
                                                        <input type="text" readonly className="form-control-plaintext text-start" id="taskId" value={filtertask ? filtertask.taskId : ''} />
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <label for="taskTitle" class="col-sm-1 col-form-label"></label>
                                                    <label for="taskTitle" class="col-sm-5 col-form-label text-start"><b>Task Title</b></label>
                                                    <label for="taskTitle" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5">
                                                        <input type="text" readonly className="form-control-plaintext text-start" id="taskTitle" value={filtertask ? filtertask.taskTitle : ''} />
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <label for="taskType" class="col-sm-1 col-form-label"></label>
                                                    <label for="taskType" class="col-sm-5 col-form-label text-start"><b>Task Type</b></label>
                                                    <label for="taskType" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5">
                                                        <input type="text" readonly className="form-control-plaintext text-start" id="taskType" value="Task" />
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <label for="taskStatus" class="col-sm-1 col-form-label"></label>
                                                    <label for="taskStatus" class="col-sm-5 col-form-label text-start"><b>Task Status</b></label>
                                                    <label for="taskStatus" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5 d-flex align-items-center justify-content-start">
                                                        <span class="badge text-bg-secondary rounded-pill">{filtertask ? filtertask.progress == true ? 'OPEN' : 'CLOSED' : 'OPEN'}</span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <label for="taskRatings" class="col-sm-1 col-form-label"></label>
                                                    <label for="taskRatings" class="col-sm-5 col-form-label text-start"><b>Task Ratings</b></label>
                                                    <label for="taskRatings" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5 d-flex align-items-center justify-content-start">
                                                        <div class="rating">
                                                            <span class="fa fa-star text-warning"></span>
                                                            <span class="fa fa-star text-warning"></span>
                                                            <span class="fa fa-star text-warning"></span>
                                                            <span class="fa fa-star-half-o text-warning"></span>
                                                            <span class="fa fa-star-o"></span>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <label for="taskPriority" class="col-sm-1 col-form-label"></label>
                                                    <label for="taskPriority" class="col-sm-5 col-form-label text-start"><b>Task Priority</b></label>
                                                    <label for="taskPriority" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5 d-flex align-items-center justify-content-start">

                                                        {
                                                            filtertask ?
                                                                <>
                                                                    <span className={`${TaskDetailCSS.priority_badge} ${TaskDetailCSS[`${filtertask.priority}_priority`]}`}>
                                                                        {filtertask.priority.toUpperCase()}
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
                                <div class="col-md-6">

                                    <Card className="mb-4 shadow-sm">
                                        <Card.Header className="bg-secondary text-white">Dates & Other Info</Card.Header>
                                        <Card.Body>
                                            <form>
                                                <div class="row">
                                                    <label for="taskAssignee" class="col-sm-1 col-form-label"></label>
                                                    <label for="taskAssignee" class="col-sm-5 col-form-label text-start"><b>Assignee Id</b></label>
                                                    <label for="taskAssignee" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5">
                                                        <input type="text" readonly className="form-control-plaintext text-start" id="taskAssignee" value={filtertask ? filtertask.taskAssigned : ''} />
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <label for="taskAssigned" class="col-sm-1 col-form-label"></label>
                                                    <label for="taskAssigned" class="col-sm-5 col-form-label text-start"><b>Assigned By</b></label>
                                                    <label for="taskAssigned" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5">
                                                        <input type="text" readonly className="form-control-plaintext text-start" id="taskAssigned" value="Yash" />
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <label for="submissionRatings" class="col-sm-1 col-form-label"></label>
                                                    <label for="submissionRatings" class="col-sm-5 col-form-label text-start"><b>Submission Ratings</b></label>
                                                    <label for="submissionRatings" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5 d-flex align-items-center justify-content-start">
                                                        <div class="rating">
                                                            {
                                                                taskSubmission ?
                                                                    <>
                                                                        <Stars count={taskSubmission.taskRating} />
                                                                    </>
                                                                    : "Not Given"
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <label for="dueDate" class="col-sm-1 col-form-label"></label>
                                                    <label for="dueDate" class="col-sm-5 col-form-label text-start"><b>Due Date</b></label>
                                                    <label for="dueDate" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5 d-flex align-items-center justify-content-start">
                                                        <input type="text" readonly className="form-control-plaintext text-start" id="dueDate" value={filtertask ? filtertask.dueDate : ''} />
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <label for="createDate" class="col-sm-1 col-form-label"></label>
                                                    <label for="createDate" class="col-sm-5 col-form-label text-start"><b>Created Date</b></label>
                                                    <label for="createDate" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5 d-flex align-items-center justify-content-start">
                                                        <input type="text" readonly className="form-control-plaintext text-start" id="createdDate" value={filtertask ? filtertask.createdDate : ''} />
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <label for="updateDate" class="col-sm-1 col-form-label"></label>
                                                    <label for="updateDate" class="col-sm-5 col-form-label text-start"><b>Updated Date</b></label>
                                                    <label for="updateDate" class="col-sm-1 col-form-label">-</label>
                                                    <div class="col-sm-5 d-flex align-items-center justify-content-start">
                                                        <input type="text" readonly className="form-control-plaintext text-start" id="updatedDate" value={filtertask ? filtertask.updatedDate : ''} />
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
                                        <textarea readOnly className="form-control-plaintext" id="taskDescription" style={{ resize: "none" }} value={filtertask ? filtertask.taskDescription : ''} />
                                    </Card.Body>
                                </Card>
                            </div>
                            <div className="pt-2">
                                <Formik validate={validate} initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
                                    {({ handleSubmit, handleChange, values, touched, errors }) => (
                                        <Form noValidate onSubmit={handleSubmit}>
                                            <Card className="mb-4 shadow-sm">
                                                <Card.Header className="bg-secondary text-white">Submission</Card.Header>
                                                <Card.Body>
                                                    <Field
                                                        disabled={filtertask ? filtertask.progress == false ? true : false : false}
                                                        name="taskSubmission"
                                                        as="textarea"
                                                        className={`form-control ${touched.taskSubmission ? errors.taskSubmission ? 'is-invalid' : 'is-valid' : ''}`}
                                                    />

                                                    {touched.taskSubmission && errors.taskSubmission && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.taskSubmission}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Card.Body>
                                                <Card.Footer className="text-muted">
                                                    <div className="">
                                                        {
                                                            filtertask ?
                                                                filtertask.progress == true ? <button type="submit" class="btn btn-primary">Submit</button>
                                                                    : ""
                                                                : ""
                                                        }
                                                    </div>
                                                </Card.Footer>
                                            </Card>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                            {
                                taskSubmission && taskSubmission.taskComment != '' ?

                                    <div className="pt-2">
                                        <Card className="mb-4 shadow-sm">
                                            <Card.Header className="bg-secondary text-white">Comment</Card.Header>
                                            <Card.Body>
                                                <textarea readOnly className="form-control-plaintext" id="taskDescription" style={{ resize: "none" }} value={taskSubmission.taskComment} />
                                            </Card.Body>
                                        </Card>
                                    </div> :
                                    ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}