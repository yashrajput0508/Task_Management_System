import { Field, Formik } from 'formik';
import AddMemberCSS from './AddMemberCSS.module.css';
import { Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
// import { addMember } from '../../../redux/counter/members';
import { AddMemberService } from '../../../services/admin/member/MemberService';
import Alert from '../Alert/Alert';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMember } from '../../../redux/counter/memberCounter';

export default function AddMember(params) {

    const currentDate = new Date(Date.now());
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const todayDate = `${year}-${month}-${day}`;

    const initialValues = {
        // Your initial values here
        memberId: '',
        memberName: '',
        username: '',
        password: '',
        dob: '',
        status: 'true',
        createdDate: todayDate.toString(),
        updatedDate: todayDate.toString()
    };

    const validate = values => {

        const errors = {};

        if (!values.memberId) {
            errors.memberId = 'Member Id is required';
        } else if (values.memberId < 0) {
            errors.memberId = 'Member Id should be positive nuumber';
        }

        if (!values.memberName) {
            errors.memberName = 'Member Name is required';
        }

        if (!values.username) {
            errors.username = 'Username is required';
        } else if (values.username.length < 4) {
            errors.username = 'Username must be at least 4 characters long';
        } else if (values.username.length > 20) {
            errors.username = 'Username must be no more than 20 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
            errors.username = 'Username can only contain letters, numbers, and underscores';
        }

        if (!values.password) {
            errors.password = 'Password is required';
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set time to midnight

        const selectedDate = new Date(values.dueDate);
        selectedDate.setHours(0, 0, 0, 0); // Set time to midnight


        if (!values.dob) {
            errors.dob = 'DOB is required';
        } else {
            const dob = new Date(values.dob);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();

            // Check if the user is younger than 18
            if (age < 18) {
                errors.dob = 'You must be at least 18 years old.';
            }
        }

        return errors;
    };

    const onSubmit = (values, actions) => {
        // Handle form submission logic here

        const addMemberService = AddMemberService(values);

        addMemberService
            .then((value) => {
                if (value.success) {
                    dispatch(addMember(value.member));
                    setMessage(value.message);
                    setLink("/admin/member");
                } else {
                    setMessage(value.message);
                }
                handleShow();
            })
            .catch((error) => {
                setMessage(error.message);
                handleShow();
            });
    };

    return (
        <>

            {show && <Alert title={"Message"} message={message} link={link} show={show} handleClose={handleClose} />}

            <div className="container-fluid py-3 mx-auto" style={{ height: 80 }}>
                <div className="row d-flex justify-content-center">
                    <div className="col-xl-10 col-lg-9 col-md-11 col-11 text-center">
                        <div className={`${AddMemberCSS.card} ${AddMemberCSS.fadeIn}`}>

                            <div className="d-flex align-items-center">
                                <div className="col-md-4">
                                    <div class="d-flex gap-2 justify-content-start mb-4">
                                        <button class="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Go Back" onClick={() => navigate(`/admin/member`)}><i class="fa fa-arrow-circle-left"></i></button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <h5 className={`${AddMemberCSS.dashboard_heading} text-center mb-4 h3`}><b>Add Member</b></h5>
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
                                                    <Form.Label className={`${AddMemberCSS.form_control_label} px-3`}>
                                                        Member Id<span className="text-danger"> *</span></Form.Label>

                                                    <Field
                                                        type="number" name="memberId" as={Form.Control}
                                                        className={`form-control ${AddMemberCSS.input} ${touched.memberId ? errors.memberId ? 'is-invalid' : 'is-valid' : ''}`}
                                                    />

                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.memberId}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                            <div className="form-group col-sm-6 flex-column d-flex">
                                                {" "}
                                                <Form.Label className={`${AddMemberCSS.form_control_label} px-3`}>
                                                    Member Name<span className="text-danger"> *</span></Form.Label>
                                                <Field
                                                    type="text" name="memberName" as={Form.Control}
                                                    className={`form-control ${AddMemberCSS.input} ${touched.memberName ? errors.memberName ? 'is-invalid' : 'is-valid' : ''}`} />
                                                {" "}
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.memberName}
                                                </Form.Control.Feedback>
                                            </div>
                                            <div className="form-group col-sm-6 flex-column d-flex">
                                                {" "}
                                                <Form.Label className={`${AddMemberCSS.form_control_label} px-3`}>
                                                    Username<span className="text-danger"> *</span></Form.Label>
                                                <Field
                                                    type="text" name="username" as={Form.Control}
                                                    className={`form-control ${AddMemberCSS.input} ${touched.username ? errors.username ? 'is-invalid' : 'is-valid' : ''}`} />
                                                {" "}
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.username}
                                                </Form.Control.Feedback>
                                            </div>
                                            <div className="form-group col-sm-6 flex-column d-flex">
                                                {" "}
                                                <Form.Label className={`${AddMemberCSS.form_control_label} px-3`}>
                                                    Password<span className="text-danger"> *</span></Form.Label>
                                                <Field
                                                    type="text" name="password" as={Form.Control}
                                                    className={`form-control ${AddMemberCSS.input} ${touched.password ? errors.password ? 'is-invalid' : 'is-valid' : ''}`} />
                                                {" "}
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.password}
                                                </Form.Control.Feedback>
                                            </div>
                                        </div>
                                        <div className="row justify-content-between text-left">
                                            <div className="form-group col-sm-6 flex-column d-flex">
                                                {" "}
                                                <Form.Label className={`${AddMemberCSS.form_control_label} px-3`}>
                                                    DOB<span className="text-danger"> *</span></Form.Label>
                                                <Field
                                                    name="dob"
                                                    type="date"
                                                    className={`form-control ${touched.dob ? errors.dob ? 'is-invalid' : 'is-valid' : ''}`}
                                                />

                                                {touched.dob && errors.dob && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.dob}
                                                    </Form.Control.Feedback>
                                                )}

                                                {" "}
                                            </div>
                                            <div className="form-group col-sm-6 flex-column d-flex">
                                                {" "}
                                                <Form.Label className={`${AddMemberCSS.form_control_label} px-3`}>
                                                    Status</Form.Label>

                                                <Field name="status"

                                                    className={`form-control ${AddMemberCSS.input}`}
                                                >
                                                    {({ field }) => (
                                                        <Form.Select {...field} aria-label="Status">
                                                            <option value="true">Active</option>
                                                            <option value="false">Inactive</option>
                                                        </Form.Select>
                                                    )}
                                                </Field>

                                                {" "}
                                            </div>
                                            <div className="form-group col-sm-6 flex-column d-flex">
                                                {" "}
                                                <Form.Label className={`${AddMemberCSS.form_control_label} px-3`}>
                                                    Created Date<span className="text-danger"> *</span></Form.Label>
                                                <Field
                                                    name="createdDate"
                                                    type="date"
                                                    className={`form-control`}
                                                    disabled
                                                />
                                                {" "}
                                            </div>
                                            <div className="form-group col-sm-6 flex-column d-flex">
                                                {" "}
                                                <Form.Label className={`${AddMemberCSS.form_control_label} px-3`}>
                                                    Updated Date<span className="text-danger"> *</span></Form.Label>
                                                <Field
                                                    name="updatedDate"
                                                    type="date"
                                                    className={`form-control`}
                                                    disabled
                                                />
                                                {" "}
                                            </div>
                                        </div>
                                        <div className="row justify-content-end">
                                            <div className="form-group col-sm-12">
                                                <Button type="submit" className={`${AddMemberCSS.button} ${AddMemberCSS.btn_block} btn-primary ${AddMemberCSS.stylishButton}`}>Add Member</Button>
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
    )
}