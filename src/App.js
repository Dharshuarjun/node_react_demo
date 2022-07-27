import { useFormik } from "formik";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [users, setUser] = useState([]);
const [isEdit,setIsEdit]=useState(false);
const [editUser,setEditUser]=useState({});
  let fetchData = async () => {
    try {
      let res = await axios.get("https://express20.herokuapp.com/students");
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        if(!isEdit){
          await axios.post("https://express20.herokuapp.com/student", values);
          fetchData();
        }
        else{
          delete values._id;
          await axios.put(`https://express20.herokuapp.com/${editUser._id}`,values);
        setIsEdit(false);
        fetchData();
        }
       
      } catch (error) {
        console.log(error);
      }
    },
  });
  let handleEdit= async (id)=>{
     try {
      let student=await axios.get(`https://express20.herokuapp.com/${id}`);
      formik.setValues(student.data);
      setEditUser(student.data);
      setIsEdit(true);
     } catch (error) {
      
     }
  };
  let handleDelete=async(id)=>{
    try {
      await axios.delete(`https://express20.herokuapp.com/${id}`);
      fetchData();
    } catch (error) {
      
    }
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="col-lg-12">
              <label>Email</label>
              <input
                type="text"
                placeholder="Email"
                name="email"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </div>
            <div className="col-lg-12">
              <label>Password</label>
              <input
                type="text"
                placeholder="password"
                className="form-control"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </div>

            <div className="col-lg-12 mt-2">
              <input
                className="btn btn-primary"
                type="submit"
                value="submit"
              ></input>
            </div>
          </form>
        </div>
        <div className="col-lg-6">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Password</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                return (
                  <tr>
                    <th scope="row">{user._id}</th>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>
                      <button className="btn btn-warning" onClick={()=>handleEdit(user._id)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-danger" onClick={()=>handleDelete(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
