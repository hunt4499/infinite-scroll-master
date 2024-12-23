import React from "react";
import {
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
} from "reactstrap";
import moment from "moment";
import "./App.css";
import AwesomeLoader from "./components/Loader"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCount: 1,
      editMode: false,
      selectedRowData: null,
      data: [],
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleOnScroll);
    this.handleFetchData();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleOnScroll);
  }

  handleOnScroll = () => {
    let state = this.state;
    let scrollTop = document.documentElement.scrollTop,
      windowHeight = window.innerHeight,
      height = document.body.scrollHeight - windowHeight,
      scrollPercentage = scrollTop / height;
    if (scrollPercentage >= 1) {
      this.setState({ pageCount: state.pageCount + 1 });
      this.handleFetchData();
    }
  };

  handleFetchData = async () => {
    let state = this.state;
    let newData,
      resObj = [];
    try {
      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = `https://api.stackexchange.com/2.2/questions?page=${state.pageCount}&pagesize=30&order=desc&sort=activity&site=stackoverflow`;
      const response = await fetch(proxyurl + url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      newData = await response.json();
      if (state.pageCount === 1) {
        this.setState({
          data: newData.items,
        });
      } else {
        resObj = [...state.data, ...newData.items];
        this.setState({ data: resObj });
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleToggelModal = () => {
    let state = { ...this.state };
    state.editMode = false;
    state.selectedRowData = null;
    this.setState({ ...state });
  };

  handlePopup = (itmes) => {
    let state = { ...this.state };
    state.selectedRowData = itmes;
    state.editMode = true;
    this.setState({ ...state });
  };

  render() {
    let { data, editMode, selectedRowData } = this.state;
    return (
      <React.Fragment>
        <div className="App">
          <div className="container">
            <h1>Infinite Scroll</h1>
            {data && data.length > 0 ? (
              <Table
                className="mb-0"
                striped
                bordered
                hover
                responsive
                id="tableId"
              >
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Title</th>
                    <th>Creation date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((itmes, index) => {
                    return (
                      <tr
                        key={index + itmes}
                        data-item={itmes}
                        onClick={() => this.handlePopup(itmes)}
                      >
                        <td>{itmes.owner.display_name}</td>
                        <td>{itmes.title}</td>
                        <td>
                          {moment(itmes.creation_date).format("DD/MM/YY_HH:mm")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            ) : <AwesomeLoader/>}
          </div>
          {editMode === true ? (
            <Modal isOpen={editMode}>
              <ModalHeader className="text-capitalize">{selectedRowData.owner.display_name}</ModalHeader>
              <ModalBody>
              <p>Title: {selectedRowData.title}</p>
              <p>Link: {selectedRowData.link}</p>
              <p>Reputation: {selectedRowData.owner.reputation}</p>
              <p>User Id: {selectedRowData.owner.user_id}</p>
              <p>Profile link: {selectedRowData.owner.link}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={this.handleToggelModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
