import React, { Component } from "react";
import axios from "axios";
import "./Exercises.css";

class Exercises extends Component {
  constructor(props) {
    super(props);
    this.state = {
      targetedMuscle: "",
      name: "",
      sets: "",
      reps: [],
      desc: "",
      exercises: []
    };

    this.loadData = this.loadData.bind(this);
  }

  submitForm(e) {
    e.preventDefault();
    axios
      .post("http://localhost:4000/exercises", {
        targetedMuscle: this.state.targetedMuscle,
        name: this.state.name,
        sets: this.state.sets,
        reps: this.state.reps,
        desc: this.state.desc
      })
      .then(result => {
        this.loadData();
        this.setState({
          targetedMuscle: "",
          name: "",
          sets: "",
          reps: [],
          desc: ""
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    axios
      .get("http://localhost:4000/exercises")
      .then(result => {
        this.setState({ exercises: result.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  deleteItem(id, e) {
    e.preventDefault();
    axios
      .delete(`http://localhost:4000/exercises/${id}`)
      .then(result => {
        this.setState({
          exercises: this.state.exercises.filter(item => {
            return item._id !== result.data._id;
          })
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderReps() {
    var sets = this.state.sets;

    var myArray = [];
    for (var i = 0; i < sets; i++) {
      myArray.push(i);
    }

    return myArray.map((item, index) => {
      return (
        <input
          key={index}
          type="number"
          className="form-control"
          name={"reps[" + index + "]"}
          placeholder="Add reps"
          onChange={e => {
            var reps = this.state.reps;

            reps[index] = e.target.value;

            this.setState({ reps });
          }}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <div>
          <div className="col-sm-3" />
          <div className="col-sm-6 text-left">
            <form
              style={{
                marginTop: 20
              }}
              className="form-group-row "
              onSubmit={this.submitForm.bind(this)}
            >
              <input
                style={{ marginBottom: 10 }}
                type="text"
                className="form-control"
                name="targetedMuscle"
                placeholder="Targeted Muscle"
                value={this.state.targetedMuscle}
                onChange={e =>
                  this.setState({ targetedMuscle: e.target.value })
                }
              />
              <input
                style={{ marginBottom: 10 }}
                type="text"
                className="form-control"
                name="name"
                placeholder="Exercise Name"
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
              />
              <input
                style={{ marginBottom: 10 }}
                type="number"
                className="form-control"
                name="sets"
                placeholder="Number of Sets"
                value={this.state.sets}
                onChange={e => {
                  if (e.target.value.length > 0) {
                    var reps = this.state.reps;
                    reps = reps.slice(0, e.target.value);
                    this.setState({ reps });
                  }
                  this.setState({ sets: e.target.value });
                }}
              />
              {this.renderReps()}
              <textarea
                style={{ marginBottom: 10 }}
                className="form-control"
                rows="3"
                name="desc"
                value={this.state.desc}
                onChange={e => this.setState({ desc: e.target.value })}
              />

              <div className="text-center">
                <input
                  style={{ marginBottom: 20 }}
                  type="submit"
                  className="btn btn-default "
                  value="Add"
                />
              </div>
            </form>
          </div>
          <div className="col-sm-3" />
        </div>
        <div className="col-sm-12">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Targeted muscle</th>
                <th>Exercise name</th>
                <th>number of sets</th>
                <th>Reptetions</th>
                <th>Description</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.exercises.length > 0 &&
                this.state.exercises.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.targetedMuscle}</td>
                      <td>{item.name}</td>
                      <td>{item.sets}</td>
                      <td>
                        {item.reps.map((value, index) => {
                          if (index < item.reps.length - 1) {
                            return value + ",";
                          } else {
                            return value;
                          }
                        })}
                      </td>
                      <td>{item.desc}</td>
                      <td className="text-center">
                        <button onClick={this.deleteItem.bind(this, item._id)}>
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
    );
  }
}

export default Exercises;
