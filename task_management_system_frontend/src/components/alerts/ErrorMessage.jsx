import { Alert, Button } from "react-bootstrap";

export default function ErrorMessage(params) {

  return (
    <>
      <Alert key={'danger'} variant={'danger'} style={{textAlign:"center"}}>
        User Not Found
      </Alert>
    </>
  )
}