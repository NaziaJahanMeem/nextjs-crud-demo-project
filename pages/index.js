import {useState, useEffect} from "react"
import {Table,Container,Row,Col,Button,ButtonGroup,Form,Navbar} from "react-bootstrap"
import {toast,ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import axios from "axios"
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
const api = "http://localhost:4000/users"

const initialState={
  name:"",
  email:"",
  contact:"",
  birthDate:"",
  address:""
}
function Home(){
  const styles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0px 0px 50px'
  }

  const [state,setState]=useState(initialState)
  const [data,setData]=useState([])
  const [userId,setUserId]=useState(null)
  const [editMode,setEditMode]=useState(false)
  const {name,email,contact,birthDate,address}=state
  useEffect(()=>{
    loadUsers()
  },[])
  const loadUsers=async()=>{
    const response=await axios.get(api)
    //const data=await response.json()
    setData(response.data)
  }
  const handleSubmit=(e)=>{
    e.preventDefault()
    if(!name || !address || !email || !birthDate || !contact){
      toast.error("Please Fill all the fields")
    }else{
      if(!editMode){
        axios.post(api,state)
        setState({name:"",email:"",contact:"",birthDate:"",address:""})
        setTimeout(()=>loadUsers(),500)
      }else{
        axios.put(`${api}/${userId}`,state)
        setState({name:"",email:"",contact:"",birthDate:"",address:""})
        setTimeout(()=>loadUsers(),500)
        setUserId(null)
        setEditMode(false)
      }
      
    }
  }
  const handleChange=(e)=>{
    let {name,value} = e.target
    setState({
      ...state,
      [name]:value
    })
  }
  const handleDelete=async(id)=>{
    if(window.confirm("Delete User?")){
      axios.delete(`${api}/${id}`)
      setTimeout(()=>loadUsers(),500)
    }
  }
  const handleUpdate=(id)=>{
    const user=data.find((item)=>item.id==id)
    setState({...user})
    setUserId(id)
    setEditMode(true)
  }
  return (
    <>
    <ToastContainer />
      <Container>
        <Row style={styles}>
          <Col md={4}>
            <Navbar bg="dark" variant="dark" expand="lg" className="justify-content-center">
              <Navbar.Brand>
                Add User
              </Navbar.Brand>
            </Navbar>
            <Form onSubmit={handleSubmit}>
              <Form.Group style={{marginBottom:"15px"}}>
                <Form.Label style={{ textAlign:"left" }}>Name</Form.Label>
                <Form.Control autoComplete="off" type="text" placeholder="Enter Name" name="name" value={name} onChange={handleChange} />
              </Form.Group>
              <Form.Group style={{marginBottom:"15px"}}>
                <Form.Label style={{ textAlign:"left" }}>Email</Form.Label>
                <Form.Control autoComplete="off" type="text" placeholder="Enter Email" name="email" value={email} onChange={handleChange} />
              </Form.Group>
              <Form.Group style={{marginBottom:"15px"}}>
                <Form.Label style={{ textAlign:"left" }}>Contact</Form.Label>
                <Form.Control autoComplete="off" type="text" placeholder="Enter Contact" name="contact" value={contact} onChange={handleChange} />
              </Form.Group>
              <Form.Group style={{marginBottom:"15px"}}>
                <Form.Label style={{ textAlign:"left" }}>Birthday</Form.Label>
                <Form.Control autoComplete="off" type="date" placeholder="Enter birthday" name="birthDate" value={birthDate} onChange={handleChange} />
              </Form.Group>
              <Form.Group style={{marginBottom:"15px"}}>
                <Form.Label style={{ textAlign:"left" }}>Address</Form.Label>
                <Form.Control autoComplete="off" type="text" placeholder="Enter Address" name="address" value={address} onChange={handleChange} />
              </Form.Group>
              <div style={{margin: '10px 0px 15px', display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                <Button type="submit" variant="primary" >{editMode? "Update":"Submit"}</Button>
              </div>
              
            </Form>
          </Col>
        </Row>
        <Row style={styles}>
          <Col md={8}>
            <Navbar bg="dark" variant="dark" expand="lg" className="justify-content-center">
              <Navbar.Brand>
                User Info
              </Navbar.Brand>
            </Navbar>
            <Table bordered hover>
              <thead>
                <tr style={{textAlign:"center"}}>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Birthday</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              {data && data.map((item,index) =>(
                <tbody key={index}>
                  <tr style={{textAlign:"center"}}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.contact}</td>
                    <td>{item.birthDate}</td>
                    <td>{item.address}</td>
                    <td>
                      <ButtonGroup>
                        <Button style={{ marginRight:"5px" }} variant="secondary" onClick={()=> handleUpdate(item.id)}>
                          Update
                        </Button>
                        <Button style={{ marginRight:"5px" }} variant="danger" onClick={()=> handleDelete(item.id)}>
                          Delete
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>

                </tbody>
              ))}

            </Table>
          </Col>
        </Row>
      </Container>
  </>
  
  )
}

export default Home