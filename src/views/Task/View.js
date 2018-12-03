import React,{Component} from "react";
import Layout from '../../components/Layout';
import Task from '../../api/task';
import currencies from '../../api/currencies';
import { Link } from 'react-router-dom';
import Popup from "reactjs-popup";
import'./TaskView.css'
import Chat from "./Chat";
import Auth from '../../api/auth';
import moment from 'moment';
import Alert from '../../components/Alert';
import auth from "../../api/auth";

export default class View extends Component{

  constructor(props){
    super(props);

    this.state={
      task:{
        id:'',
        start:'',
        deadline:'',
        urgency:'',
        description:'',
        title:''
      },
      offer:{
        price:'',
        totalHours:'',
        currency:'',
        complexity:'',
      },
      error:''
    }
  }

  componentDidMount(){
    this.loadtasks(this.props.match.params.id);
  }

  /**
   *loads the selected task from the database into the state
   * @param {int} id
   */
  loadtasks = async id=>{

    const res = await Task.get(id);
    if(res=== null){
      return null;
    }
    this.setState({task:res})
  }

  /**
   * event listener for input
   * adds changes to this.state
   * @param  {Object} event
   */
  changeHandler = event => {
      const tempOffer = JSON.parse(JSON.stringify(this.state.offer))
      tempOffer[event.target.name] = event.target.value
      this.setState({
         offer:tempOffer
      })
    }

  /**
   * event listener for Submit
   * validates all inputfields before sending a post request to the server
   * @param {Object} event
   */
  submitHandler= async event =>{
    event.preventDefault();
    try {
      const res = await Task.createEstimate( this.state.task.id,{
      price: Number(this.state.offer.price),
      totalHours:Number(this.state.offer.totalHours),
      currency: String(await currencies.get()),
      complexity:Number(this.state.offer.complexity),
  });

    } catch(err) {
      this.setState({ error: err.message })
    }
  }

  /**
   * render a task
   * @param {Object} task
   * @return {JSX} a task as a list item
   */
  fieldRendertaskDescription(task){
    return(
      <label key ={task.id}>
        <div className="flex-container">
          <div>
            <b>published</b>
            <div>
              {moment(task.start).format('DD. MMM YYYY')}
            </div>
          </div>
          <div>
            <b>Deadline</b>
            <div>
            {moment(task.deadline).format('DD. MMM YYYY')}
            </div>
          </div>
          <div>
            <b>Urgency</b>
            <div >
              {task.urgency}
            </div>
          </div>
        </div>
          <div>
            <hr></hr>
            <h6>task Description:</h6>
            <p>{task.description}</p>
          </div>
      </label>
    )
  }

  /**
   * Creates the task overview view
   * @return {JSX} View
   */
  render(){
    return (
      <Layout>
        <section>
          <h1>{this.state.task.title}</h1>
          <h3>task Details</h3>
          {this.state.error && (
            <Alert>{this.state.error}</Alert>
          )}
          <hr></hr>
          {this.fieldRendertaskDescription(this.state.task)}
          <Popup trigger={<button> Make offer</button>}>
            <div className='popUpInner'>
              <label>
                <form onSubmit={this.submitHandler}>
                  <p><b>hourly pay:</b></p>
                  <input name='price' type='number' onChange={this.changeHandler}  placeholder="Hourly pay..." required/>
                  <p><b>total hours:</b></p>
                  <input name='totalHours' type='number' onChange={this.changeHandler}  placeholder="Man Hours..." required/>
                  <p> <b>Task Complexity:</b></p>
                  <input name='complexity' type='number' onChange={this.changeHandler}  placeholder="Complexity..." required/>
                  <input type="submit" value="Submit"/>
                </form>
              </label>
            </div>
          </Popup>
          <hr></hr>
          <Chat taskId={this.state.task.id}></Chat>
          <Link to='/task/List'>
            <button>Back</button>
          </Link>
        </section>
      </Layout>
    )
  }
}
