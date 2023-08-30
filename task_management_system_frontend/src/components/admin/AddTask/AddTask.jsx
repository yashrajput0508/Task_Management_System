import { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import AddTaskCSS from './AddTask.module.css';
import { Formik, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../../../redux/counter/adminTask";
import { Constants } from "../../Constants";
import Alert from "../Alert/Alert";
import { AddTaskService } from "../../../services/admin/dashboard/TaskService";
import { FetchAllMembersService } from "../../../services/admin/member/MemberService";
import { useNavigate } from "react-router-dom";

export default function AddTask(params) {

    const currentDate = new Date(Date.now());
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;

    const tasks = useSelector((data) => data.adminTask.tasks);
    const [members, setMembers] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const initialValues = {
        // Your initial values here
        taskId: '',
        taskTitle: '',
        taskDescription: '',
        dueDate: '',
        priority: Constants.LOW,
        progress: true,
        taskAssigned: '',
        createdDate: todayDate.toString(),
        updatedDate: todayDate.toString()
    };


    const validate = values => {

        const errors = {};

        if (!values.taskId) {
            errors.taskId = 'Task Id is required';
        } else if (values.taskId < 0) {
            errors.taskId = 'Task Id should be positive nuumber';
        }


        if (!values.taskTitle) {
            errors.taskTitle = 'Task Title is required';
        }

        if (!values.taskDescription) {
            errors.taskDescription = 'Task Description is required';
        }
        else if (values.taskDescription.length < 120) {
            errors.taskDescription = "Minimum Length of Task Description should be 120";
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set time to midnight

        const selectedDate = new Date(values.dueDate);
        selectedDate.setHours(0, 0, 0, 0); // Set time to midnight


        if (!values.dueDate) {
            errors.dueDate = 'Due Date is required';
        }
        else if (selectedDate < currentDate) {
            errors.dueDate = 'Due Date should be a future date';
        }

        return errors;
    };

    const onSubmit = (values, actions) => {

        console.log(values);
        const isExists = tasks.some((task) => task.taskId == values.taskId);

        if (isExists) {
            setMessage("Task ID already exists");
            handleShow(true);
            return;
        }

        const addTaskService = AddTaskService(values);

        addTaskService
            .then(response => {
                if (response.success) {
                    dispatch(addTask(response.task));
                    setMessage(response.message);
                    setLink('/admin/dashboard');
                } else {
                    setMessage(response.message);
                    setLink('');
                }
                handleShow(true);
            })
            .catch(error => {
                setMessage('Task Added Unsuccessfully');
                setLink('');
                handleShow(true);
            });
    };

    useEffect(() => {
        FetchAllMembersService().then((response) => {
            if (response.success) {
                setMembers(response.members);
            } else {
                setMessage(response.message);
                handleShow();
            }
        }).catch(() => {
            setMessage("Couldn't connect to server");
            handleShow();
        })
    }, [])

    return (
        <>
            <div className="container-fluid py-3 mx-auto" style={{ height: 80 }}>
                <div className="row d-flex justify-content-center">
                    <div className="col-xl-10 col-lg-9 col-md-11 col-11 text-center">
                        <div className={`${AddTaskCSS.card} ${AddTaskCSS.fadeIn}`}>

                            {show && <Alert title={"Message"} message={message} link={link} show={show} handleClose={handleClose} />}

                            <div className="d-flex align-items-center">
                                <div className="col-md-4">
                                    <div class="d-flex gap-2 justify-content-start mb-4">
                                        <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Go Back" onClick={() => navigate(`/admin/dashboard`)}><i class="fa fa-arrow-circle-left"></i></button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h5 className={`${AddTaskCSS.dashboard_heading} text-center mb-4 h3`}><b>ADD TASK</b></h5>
                                </div>
                                <div className="col-md-4 align-content-center">
                                </div>
                            </div>

                            <Formik validate={validate} initialValues={initialValues} onSubmit={onSubmit}>
                                {({ handleSubmit, handleChange, values, touched, errors }) => (
                                    <Form noValidate onSubmit={handleSubmit}>
                                        <div className="row justify-content-between text-left">
                                            <div className="form-group col-sm-6 flex-column d-flex">
                                                <Form.Group controlId="validationFormik01">
                                                    <Form.Label className={`${AddTaskCSS.form_control_label} px-3`}>
                                                        Task Id<span className="text-danger"> *</span></Form.Label>

                                                    <Field
                                                        type="number" name="taskId" as={Form.Control}
                                                        className={`form-control ${AddTaskCSS.input} ${touched.taskId ? errors.taskId ? 'is-invalid' : 'is-valid' : ''}`}
                                                    />

                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.taskId}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="form-group col-sm-6 flex-column d-flex">
                                                {" "}
                                                <Form.Label className={`${AddTaskCSS.form_control_label} px-3`}>
                                                    Task Title<span className="text-danger"> *</span></Form.Label>
                                                <Field
                                                    type="text" name="taskTitle" as={Form.Control}
                                                    className={`form-control ${AddTaskCSS.input} ${touched.taskTitle ? errors.taskTitle ? 'is-invalid' : 'is-valid' : ''}`} />
                                                {" "}
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.taskTitle}
                                                </Form.Control.Feedback>
                                            </div>
                                        </div>
                                        <div className="row justify-content-between text-left">
                                            <div className="form-group col-sm-12 flex-column d-flex">
                                                {" "}
                                                <Form.Label className={`${AddTaskCSS.form_control_label} px-3`}>
                                                    Task Description<span className="text-danger"> *</span></Form.Label>
                                                <Field
                                                    name="taskDescription"
                                                    as="textarea"
                                                    className={`form-control ${touched.taskDescription ? errors.taskDescription ? 'is-invalid' : 'is-valid' : ''}`}
                                                />

                                                {touched.taskDescription && errors.taskDescription && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.taskDescription}
                                                    </Form.Control.Feedback>
                                                )}

                                                {" "}
                                            </div>
                                        </div>
                                        <div className="row justify-content-between text-left mb-2">
                                            <div className="form-group col-sm-4 flex-column d-flex">
                                                {" "}
                                                <Form.Label className={`${AddTaskCSS.form_control_label} px-3`}>
                                                    Due Date<span className="text-danger"> *</span></Form.Label>
                                                <Field
                                                    name="dueDate"
                                                    type="date"
                                                    className={`form-control ${touched.dueDate ? errors.dueDate ? 'is-invalid' : 'is-valid' : ''}`}
                                                />

                                                {touched.dueDate && errors.dueDate && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.dueDate}
                                                    </Form.Control.Feedback>
                                                )}

                                                {" "}
                                            </div>
                                            <div className="form-group col-sm-4 flex-column d-flex">
                                                {" "}
                                                <Form.Label className={`${AddTaskCSS.form_control_label} px-3`}>
                                                    Priority</Form.Label>

                                                <Field name="priority">
                                                    {({ field }) => (
                                                        <Form.Select {...field} aria-label="Priority">
                                                            <option value={Constants.LOW}>Low</option>
                                                            <option value={Constants.MEDIUM}>Medium</option>
                                                            <option value={Constants.HIGH}>High</option>
                                                        </Form.Select>
                                                    )}
                                                </Field>

                                                {" "}
                                            </div>
                                            <div className="form-group col-sm-4 flex-column d-flex">
                                                <Form.Label className={`${AddTaskCSS.form_control_label} px-3`}>
                                                    Task Assigned</Form.Label>

                                                <Field name="taskAssigned">
                                                    {({ field }) => (
                                                        <Form.Select {...field} aria-label="Priority">
                                                            {
                                                                members.map((member, index) =>
                                                                    <>
                                                                        <option value={member.memberId}>{member.memberName}</option>
                                                                    </>
                                                                )
                                                            }
                                                        </Form.Select>
                                                    )}
                                                </Field>
                                            </div>
                                        </div>
                                        <div className="row justify-content-end">
                                            <div className="form-group col-sm-12">
                                                <Button type="submit" className={`${AddTaskCSS.button} ${AddTaskCSS.btn_block} btn-primary ${AddTaskCSS.stylishButton}`}>Add Task</Button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

